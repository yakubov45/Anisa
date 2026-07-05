"use client";

import { useTranslation } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function Newsletter() {
    const { t, lang } = useTranslation();

    const descText = lang === 'ru' 
        ? "Получите ранний доступ к лимитированным сборкам, секретным промокодам и новостям о железе нового поколения. Никакого спама, только мощь."
        : lang === 'uz'
        ? "Cheklangan kompyuterlar, maxfiy promokodlar va eng so'nggi avlod ehtiyot qismlari haqidagi yangiliklardan birinchilardan bo'lib xabardor bo'ling. Faqat foydali ma'lumotlar."
        : "Get first access to limited edition drops, secret promo codes, and next-gen hardware news before anyone else. No spam, only power.";

    return (
        <section className="relative w-full py-6 md:py-10 flex justify-center overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-primary/20 rounded-[100%] blur-[120px] pointer-events-none z-0" />
            
            <div className="relative z-10 w-full max-w-[1200px] mx-auto px-4 md:px-8">
                <div className="relative bg-[#0a0a0c]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden shadow-2xl">
                    
                    {/* Decorative Grid Line */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />
                    
                    <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
                        
                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary font-bold text-[10px] uppercase tracking-[0.3em]">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                {t('newsletter_desc') || "EXCLUSIVE VIP ACCESS"}
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-[1.1]">
                                {t('newsletter_title') || "JOIN THE ELITE"}
                            </h2>
                            
                            <p className="text-white/50 text-sm md:text-base font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                                {descText}
                            </p>
                        </div>

                        {/* Input Area */}
                        <div className="w-full lg:w-1/2 max-w-lg">
                            <div className="relative group/form">
                                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-red-500 to-orange-600 rounded-3xl blur opacity-25 group-focus-within/form:opacity-50 transition duration-1000 group-hover/form:duration-200" />
                                
                                <div className="relative flex flex-col sm:flex-row gap-3 bg-[#050505] p-3 rounded-3xl border border-white/10">
                                    <div className="relative flex-1">
                                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                        </div>
                                        <input 
                                            type="email" 
                                            placeholder={t('newsletter_placeholder') || "Enter your email"}
                                            className="w-full bg-transparent border-none px-14 py-4 text-white placeholder:text-white/30 focus:ring-0 outline-none font-bold text-xs uppercase tracking-widest"
                                        />
                                    </div>
                                    <button className="bg-primary hover:bg-primary/90 text-white font-black px-8 py-4 rounded-2xl transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 shrink-0">
                                        {t('newsletter_subscribe') || "SUBSCRIBE"}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
