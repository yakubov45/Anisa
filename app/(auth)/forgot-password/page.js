"use client";

import { useState } from "react";
import { authService } from "@/lib/services/auth.service";
import Link from "next/link";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authService.forgotPassword(email);
            setSent(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface px-4 py-20">
            <div className="w-full max-w-[480px] bg-surface/60 backdrop-blur-3xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 space-y-10 animate-slide-up relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="text-center space-y-3 relative">
                    <div className="text-4xl mb-4">🔑</div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                        Recover
                    </h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        Restore your ecosystem access
                    </p>
                </div>

                {sent ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-pop-in">
                        <p className="text-green-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                            A recovery link has been dispatched to your inbox. Please check your mail.
                        </p>
                        <Link href="/login" className="block text-primary font-black text-[10px] uppercase tracking-widest hover:underline">
                            Return to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 relative">
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
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground text-background font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                        >
                            {loading ? "Sending..." : "Send Link"}
                        </button>
                    </form>
                )}

                <div className="text-center relative pt-4">
                    <Link href="/login" className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary transition-colors">
                        ← Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
