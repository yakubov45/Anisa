"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { authService } from "@/lib/services/auth.service";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function AuthContainer({ initialMode = "login" }) {
    const { t } = useTranslation();
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
        name: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (mode === "register") {
                if (formData.password !== formData.confirmPassword) {
                    throw new Error("Passwords do not match.");
                }
                await authService.register(formData);
            } else {
                await authService.login(formData.email, formData.password);
            }
            router.push("/");
        } catch (err) {
            console.warn(`${mode} error:`, err.code);
            if (err.code === "auth/email-already-in-use") {
                setError(t('auth_email_in_use') || "This email is already in use.");
            } else if (err.code === "auth/weak-password") {
                setError(t('auth_weak_password') || "Password must be at least 6 characters.");
            } else if (err.code === "auth/invalid-credential") {
                setError(t('auth_invalid_credential') || "Noto'g'ri email yoki parol kiritildi.");
            } else {
                setError(err.message || "Authentication failed.");
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

    const inputClasses = "w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-400 dark:placeholder:text-white/20 text-foreground dark:text-white font-bold";
    const labelClasses = "text-[10px] font-black text-surface-500 dark:text-surface-400 uppercase tracking-widest pl-2";

    return (
        <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 p-6 md:p-14 rounded-3xl md:rounded-[3rem] shadow-2xl border border-surface-200 dark:border-white/10 relative overflow-hidden min-h-[500px] flex flex-col justify-center">

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
                    className="space-y-4 md:space-y-6 relative"
                >
                    <div className="text-center space-y-1 md:space-y-2">
                        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                            {mode === "login" ? t('auth_sign_in') : t('auth_create_account')}
                        </h1>
                        <p className="text-surface-500 font-bold uppercase text-[8px] md:text-[10px] tracking-[0.3em]">
                            {mode === "login" ? t('auth_access_ecosystem') : t('auth_join_community')}
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
                        <div className="space-y-3">
                            {mode === "register" && (
                                <div className="space-y-1">
                                    <label className={labelClasses}>{t('auth_fullname')}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={inputClasses}
                                        placeholder="ENTER NAME"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className={labelClasses}>{t('auth_email') || "Email Address"}</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="ENTER EMAIL"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between items-center px-2">
                                    <label className={labelClasses}>{t('auth_password') || "Password"}</label>
                                    {mode === "login" && (
                                        <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">{t('auth_forgot_title') || "Forgot?"}?</Link>
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
                                    <label className={labelClasses}>{t('auth_confirm_password') || "Confirm Password"}</label>
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
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em] mt-4"
                        >
                            {loading ? t('auth_processing') : (mode === "login" ? t('auth_enter_portal') : t('auth_register_now'))}
                        </button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-200 dark:border-white/10" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-white dark:bg-zinc-900 px-4 text-surface-500 font-black tracking-widest">{t('auth_alternative')}</span></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        type="button"
                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/5 text-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-surface-100 transition-all active:scale-95 shadow-sm uppercase text-[10px] tracking-widest"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        {mode === "login" ? t('auth_continue_google') : t('auth_join_google')}
                    </button>

                    <p className="text-center text-[10px] text-surface-500 font-black uppercase tracking-[0.2em] pt-4">
                        {mode === "login" ? (
                            <>
                                {t('auth_new_to_onepc')}{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("register")}
                                    className="text-primary hover:underline"
                                >
                                    {t('auth_create_account')}
                                </button>
                            </>
                        ) : (
                            <>
                                {t('auth_already_member')}{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("login")}
                                    className="text-primary hover:underline"
                                >
                                    {t('auth_sign_in')}
                                </button>
                            </>
                        )}
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
