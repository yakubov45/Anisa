"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthContainer({ initialMode = "login" }) {
    const [mode, setMode] = useState(initialMode); // 'login' or 'register'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    // Form states
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phoneNumber: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (mode === "register") {
                // Phone validation
                const phoneRegex = /^\+998\d{9}$/;
                if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
                    throw new Error("Please enter a valid Uzbek phone number (+998XXXXXXXXX).");
                }
                
                // Password confirmation
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match.");
                }

                await authService.register(formData);
            } else {
                await authService.login(formData.email, formData.password);
            }
            router.push("/");
        } catch (err) {
            console.error(`${mode} error:`, err);
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already in use.");
            } else if (err.code === "auth/weak-password") {
                setError("Password must be at least 6 characters.");
            } else if (err.code === "auth/operation-not-allowed") {
                setError("Email/Password registration is not enabled. Please enable it in Firebase Console.");
            } else if (err.code === "auth/invalid-credential") {
                setError("Invalid email or password.");
            } else {
                setError(err.message || "Authentication failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authService.loginWithGoogle();
            router.push("/");
        } catch (err) {
            setError("Google Login failed.");
        }
    };

    const inputClasses = "w-full bg-surface-100/50 dark:bg-white/5 border border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-400 dark:placeholder:text-white/20 text-foreground dark:text-white font-medium";
    const labelClasses = "text-[10px] font-black text-surface-500 dark:text-surface-400 uppercase tracking-widest pl-2";

    return (
        <div className="w-full max-w-[480px] bg-surface/60 backdrop-blur-3xl p-6 md:p-14 rounded-3xl md:rounded-[3rem] shadow-2xl border border-surface-200 dark:border-white/10 relative overflow-hidden min-h-[500px] md:min-h-[600px] flex flex-col justify-center">

            {/* Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

            <AnimatePresence mode="wait">
                <motion.div
                    key={mode}
                    initial={{ x: mode === "login" ? -20 : 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: mode === "login" ? 20 : -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-6 md:space-y-10 relative"
                >
                    <div className="text-center space-y-2 md:space-y-3">
                        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </h1>
                        <p className="text-surface-500 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em]">
                            {mode === "login" ? "Access your hardware ecosystem" : "Join the elite hardware community"}
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl text-center"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleAuth} className="space-y-3">
                        {mode === "register" && (
                            <>
                                <div className="space-y-1">
                                    <label className={labelClasses}>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className={labelClasses}>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phoneNumber"
                                        required
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="+998 90 123 45 67"
                                    />
                                </div>
                            </>
                        )}

                        <div className="space-y-1">
                            <label className={labelClasses}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="space-y-1">
                            <div className="flex justify-between items-center px-2">
                                <label className={labelClasses}>Password</label>
                                {mode === "login" && (
                                    <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot?</Link>
                                )}
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {mode === "register" && (
                            <div className="space-y-1">
                                <label className={labelClasses}>Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-primary transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground text-background font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                        >
                            {loading ? "Processing..." : (mode === "login" ? "Enter Portal" : "Register Now")}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200 dark:border-white/10" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-surface/10 backdrop-blur-md px-4 text-surface-500 font-black tracking-widest">Alternative</span></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full bg-surface-100/50 dark:bg-surface-100/5 border border-surface-200 dark:border-white/5 text-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-surface-200/50 transition-all active:scale-95 shadow-sm uppercase text-[10px] tracking-widest"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        {mode === "login" ? "Continue with Google" : "Join with Google"}
                    </button>

                    <p className="text-center text-[10px] text-surface-500 font-black uppercase tracking-[0.2em] pt-4">
                        {mode === "login" ? (
                            <>
                                New to OnePC?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("register")}
                                    className="text-primary hover:underline"
                                >
                                    Create Account
                                </button>
                            </>
                        ) : (
                            <>
                                Already a member?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("login")}
                                    className="text-primary hover:underline"
                                >
                                    Sign In
                                </button>
                            </>
                        )}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
