"use client";

import { useState, useEffect } from "react";
import { authService } from "@/lib/services/auth.service";
import { useUser } from "@/lib/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useUser();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/dashboard");
        }
    }, [user, authLoading, router]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authService.login(email, password);
            router.push("/");
        } catch (err) {
            setError("Invalid credentials. Please check your details.");
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface px-4 py-20">
            <div className="w-full max-w-[480px] bg-surface/60 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 space-y-10 animate-slide-up relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="text-center space-y-3 relative">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                        Sign In
                    </h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Access your hardware ecosystem
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest p-4 rounded-2xl text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 relative">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-100/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-500 text-foreground font-medium"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center px-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Password</label>
                            <Link href="/forgot-password" title="Forgot Password" className="text-[10px] font-black text-primary hover:underline uppercase tracking-widest">Forgot?</Link>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-surface-100/50 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-500 text-foreground font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground text-background font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                    >
                        {loading ? "Authenticating..." : "Enter Portal"}
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
                    Continue with Google
                </button>

                <p className="text-center text-[10px] text-surface-500 font-black uppercase tracking-[0.2em] pt-4">
                    New to OnePC? <Link href="/register" className="text-primary hover:underline">Create Account</Link>
                </p>

            </div>
        </div>
    );
}
