"use client";

import { useTranslation } from "@/lib/LanguageContext";

export default function Newsletter() {
    const { t, lang } = useTranslation();

    const descText = lang === 'ru'
        ? "Подписывайтесь на наши официальные каналы, чтобы быть в курсе последних выходов железа, эксклюзивных акций и свежих новостей."
        : lang === 'uz'
            ? "Eng so'nggi kompyuterlar, eksklyuziv aksiyalar va yangiliklardan xabardor bo'lish uchun rasmiy sahifalarimizga a'zo bo'ling."
            : "Follow our official channels to stay updated on the latest hardware releases, exclusive promotions, and news.";

    return (
        <section className="relative w-full py-6 md:py-10 flex justify-center overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="relative bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl">

                    {/* Decorative Grid Line */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

                    <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-10">

                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {t('newsletter_title') || "STAY CONNECTED"}
                            </div>

                            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-white tracking-tighter uppercase leading-[1.1]">
                                {t('newsletter_title') || "BIZ BILAN ALOQADA BO'LING"}
                            </h2>

                            <p className="text-white/60 text-sm md:text-base font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                                {descText}
                            </p>
                        </div>

                        {/* Social Media Buttons Area */}
                        <div className="w-full lg:w-1/2 max-w-lg flex flex-col sm:flex-row lg:flex-col gap-4">

                            {/* Telegram Link */}
                            <a
                                href="https://t.me/OnePcuz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#229ED9]/20 to-sky-500/10 border border-[#229ED9]/30 hover:border-[#229ED9] transition-all duration-300 shadow-lg hover:shadow-[#229ED9]/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-[#229ED9] text-white flex items-center justify-center shadow-md shadow-[#229ED9]/30 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-xs uppercase tracking-widest">{t('btn_telegram_channel') || "TELEGRAM KANAL"}</h4>
                                        <p className="text-[#229ED9] text-[11px] font-bold tracking-wider mt-0.5">t.me/OnePcuz</p>
                                    </div>
                                </div>
                                <div className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </a>

                            {/* Instagram Link */}
                            <a
                                href="https://www.instagram.com/onepcuz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-pink-500/20 via-purple-500/10 to-orange-500/20 border border-pink-500/30 hover:border-pink-500 transition-all duration-300 shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md shadow-pink-500/30 group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-xs uppercase tracking-widest">{t('btn_instagram_page') || "INSTAGRAM SAHIFA"}</h4>
                                        <p className="text-pink-400 text-[11px] font-bold tracking-wider mt-0.5">@onepcuz</p>
                                    </div>
                                </div>
                                <div className="text-white/40 group-hover:text-white group-hover:translate-x-1 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </div>
                            </a>

                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
