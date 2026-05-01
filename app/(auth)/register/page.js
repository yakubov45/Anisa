"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { useUser } from "@/lib/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useUser();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic validation for phone
        if (phoneNumber.length < 9) {
            setError("Please enter a valid phone number.");
            setLoading(false);
            return;
        }

        try {
            await authService.register({ name, email, password, phoneNumber });
            router.push("/");
        } catch (err) {
            setError("Registration failed. Email might already be in use.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await authService.loginWithGoogle();
            router.push("/");
        } catch (err) {
            setError("Google Registration failed.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface px-4 py-20">
            <div className="w-full max-w-[480px] bg-surface/60 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 space-y-10 animate-slide-up relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="text-center space-y-3 relative">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                        Create Account
                    </h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Join the elite hardware community
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-6 relative">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Full Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-white/20 text-white font-medium"
                            placeholder="John Doe"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Phone Number</label>
                        <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-white/20 text-white font-medium"
                            placeholder="+998 90 123 45 67"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-white/20 text-white font-medium"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-white/20 text-white font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                    >
                        {loading ? "Creating Account..." : "Register Now"}
                    </button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase"><span className="bg-surface/10 backdrop-blur-md px-4 text-surface-400 font-black tracking-widest">Alternative</span></div>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full bg-surface-100/50 border border-white/5 text-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-4 hover:bg-surface-200/50 transition-all active:scale-95 shadow-sm uppercase text-[10px] tracking-widest"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                    Join with Google
                </button>

                <p className="text-center text-[10px] text-surface-500 font-black uppercase tracking-[0.2em] pt-4">
                    Already a member? <Link href="/login" className="text-primary hover:underline">Sign In</Link>
                </p>

            </div>
        </div>
    );
}
