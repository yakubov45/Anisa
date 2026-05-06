"use client";

import { useState } from "react";
import { authService } from "@/lib/services/auth.service";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function ForgotPasswordPage() {
    const { t } = useTranslation();
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
            <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-surface-200 dark:border-white/10 space-y-10 animate-slide-up relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

                <div className="text-center space-y-3 relative">
                    <div className="text-4xl mb-4">🔑</div>
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                        {t('auth_forgot_title')}
                    </h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                        {t('auth_forgot_subtitle')}
                    </p>
                </div>

                {sent ? (
                    <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-pop-in">
                        <p className="text-green-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                            {t('auth_forgot_sent_msg')}
                        </p>
                        <Link href="/login" className="block text-primary font-black text-[10px] uppercase tracking-widest hover:underline">
                            {t('auth_forgot_back_login')}
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8 relative">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">
                                {t('auth_forgot_email_label')}
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-400 text-foreground font-bold"
                                placeholder="ENTER EMAIL ADDRESS"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                        >
                            {loading ? t('auth_forgot_sending') : t('auth_forgot_send_link')}
                        </button>
                    </form>
                )}

                <div className="text-center relative pt-4">
                    <Link href="/login" className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary transition-colors">
                        ← {t('auth_forgot_back_login')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
