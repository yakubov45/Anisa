"use client"

import { useState, useEffect } from "react";
import { subscriptionService } from "@/lib/services/subscription.service";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function Footer() {
    const { t, lang } = useTranslation();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useUIStore();
    const [counts, setCounts] = useState({
        youtube: 4250,
        telegram: 12800,
        instagram: 8430,
        facebook: 2100
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setCounts(prev => ({
                youtube: prev.youtube + Math.floor(Math.random() * 3),
                telegram: prev.telegram + Math.floor(Math.random() * 2),
                instagram: prev.instagram + Math.floor(Math.random() * 3),
                facebook: prev.facebook + Math.floor(Math.random() * 1)
            }));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    const socialPlatforms = [
        {
            name: 'YouTube',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
            count: counts.youtube,
            color: 'hover:text-[#FF0000]'
        },
        {
            name: 'Telegram',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.206 8.19l-1.802 8.473c-.135.61-.497.76-.99.48l-2.744-2.023-1.324 1.275c-.147.147-.27.27-.554.27l.198-2.796 5.093-4.598c.22-.196-.048-.304-.342-.11L8.33 13.064l-2.715-.847c-.59-.186-.6-.59.124-.874l10.605-4.087c.49-.18.92.112.748.934z" /></svg>,
            count: counts.telegram,
            color: 'hover:text-[#26A5E4]'
        },
        {
            name: 'Instagram',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4.162 4.162 0 1 1 0-8.324A4.162 4.162 0 0 1 12 16zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" /></svg>,
            count: counts.instagram,
            color: 'hover:text-[#E4405F]'
        },
        {
            name: 'Facebook',
            icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" /></svg>,
            count: counts.facebook,
            color: 'hover:text-[#1877F2]'
        }
    ];

    const handleSubscribe = async (e) => {
        if (e) e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            await subscriptionService.subscribe(email);
            addToast("IDENTITY SYNCHRONIZED SUCCESSFULLY!");
            setEmail("");
        } catch (error) {
            addToast(error.message.toUpperCase(), "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getLangLabel = () => {
        if (lang === 'uz') return "O'zbekcha";
        if (lang === 'ru') return "Русский";
        return "English";
    };

    return (
        <footer className="mt-auto bg-[#111113] border-t border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 md:gap-12 mb-12">

                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <div className="flex flex-col gap-1">
                            <img src="/icons/footer-logo.svg" alt="OnePC" className="h-7 md:h-7 w-auto brightness-0 invert" />
                            <span className="text-xs md:text-[11px] font-black text-zinc-500 uppercase tracking-[0.4em] leading-none mt-2 md:mt-1">{t('footer_tagline')}</span>
                        </div>
                        <p className="text-zinc-400 text-sm md:text-xs font-medium leading-relaxed max-w-xs opacity-70">
                            {t('footer_desc')}
                        </p>
                    </div>

                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs md:text-[11px] font-black text-white uppercase tracking-[0.4em]">{t('footer_resources')}</h4>
                        <ul className="space-y-4 md:space-y-3">
                            {[
                                { name: 'Product Map', url: '/support' },
                                { name: 'System Warranty', url: '/support' },
                                { name: 'Elite Support', url: '/support' },
                                { name: 'Deployments', url: '/support' }
                            ].map(item => (
                                <li key={item.name}>
                                    <a href={item.url} className="text-zinc-500 text-xs md:text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors">{item.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-1 space-y-4">
                        <h4 className="text-xs md:text-[11px] font-black text-white uppercase tracking-[0.4em]">{t('footer_deployments')}</h4>
                        <ul className="space-y-4 md:space-y-3">
                            {[
                                { name: 'Registry', url: '/legal' },
                                { name: 'Privacy Protocol', url: '/legal' },
                                { name: 'Operational Terms', url: '/legal' },
                                { name: 'Security Audit', url: '/legal' },
                                { name: t('nav_about'), url: '/about' }
                            ].map(item => (
                                <li key={item.name}>
                                    <a href={item.url} className="text-zinc-500 text-xs md:text-[11px] font-black uppercase tracking-widest hover:text-primary transition-colors">{item.name}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="col-span-2 md:col-span-1 space-y-6">
                        <form onSubmit={handleSubscribe} className="space-y-3">
                            <h4 className="text-xs md:text-[11px] font-black text-white uppercase tracking-[0.4em]">Broadcast System</h4>
                            <p className="text-zinc-400 text-[11px] md:text-[10px] leading-relaxed font-bold uppercase tracking-widest">{t('footer_subscribe_text')}</p>
                            <div className="relative group">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('newsletter_placeholder')}
                                    className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-4 md:py-3 text-xs md:text-[11px] font-mono tracking-widest focus:ring-1 focus:ring-primary/40 transition-all text-white placeholder:text-zinc-600 outline-none"
                                />
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-white text-[10px] md:text-[9px] font-black px-4 py-2 md:px-3 md:py-1.5 rounded-lg hover:bg-white hover:text-black transition-all uppercase tracking-widest disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : 'SYNC'}
                                </button>
                            </div>
                        </form>

                        <div className="space-y-4 pt-2">
                            <div className="flex flex-wrap items-center gap-6 md:gap-5 opacity-80">
                                {['click', 'payme', 'uzcard', 'humo', 'visa', 'mastercard'].map(p => (
                                    <img key={p} src={`/icons/main-${p}.webp`} alt={p} className="h-7 md:h-5 w-auto grayscale hover:grayscale-0 transition-all cursor-pointer brightness-125" />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Social Hub Row */}
                <div className="pt-12 border-t border-white/5">
                    <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16">
                        {socialPlatforms.map((platform) => (
                            <div key={platform.name} className="flex items-center gap-5 md:gap-6 group cursor-pointer">
                                <div className={`text-zinc-600 transition-all duration-300 group-hover:scale-125 ${platform.color}`}>
                                    {platform.icon}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] md:text-[10px] font-black text-white uppercase tracking-[0.3em] leading-none mb-2">{platform.name}</span>
                                    <div className="items-center gap-2 hidden sm:flex">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-[13px] md:text-[12px] font-mono text-zinc-500 font-bold tracking-tight">{platform.count.toLocaleString()} SUBS</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-10 md:mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <p className="text-zinc-600 text-[11px] md:text-[10px] font-black uppercase tracking-[0.4em]">
                        &copy; 2026 ONEPC ENTERPRISE. {t('footer_rights')}
                    </p>
                    <div className="flex gap-8 md:gap-6">
                        <span className="text-zinc-600 text-[11px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">{getLangLabel()}</span>
                        <span className="text-zinc-600 text-[11px] md:text-[10px] font-black uppercase tracking-[0.4em] opacity-40">UTC +5:00</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
