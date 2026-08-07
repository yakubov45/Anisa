"use client"

import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/lib/LanguageContext';
import ProductCard from '@/features/product/ProductCard';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { FEATURES } from '@/lib/features';

// Data is now passed as props from the server component (app/page.js)
export default function DiscountBanner({ flashDeals, totalProducts = 500 }) {
    const { t } = useTranslation();
    const scrollRef = useRef(null);
    const ticking = useRef(false);
    const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const settings = flashDeals?.settings || null;
    const products = flashDeals?.products || [];

    const handleScroll = () => {
        if (scrollRef.current && !ticking.current) {
            window.requestAnimationFrame(() => {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
                setScrollProgress(progress);
                ticking.current = false;
            });
            ticking.current = true;
        }
    };

    useEffect(() => {
        if (!settings?.endTime) return;
        
        const now = new Date().getTime();
        const end = new Date(settings.endTime).getTime();
        if (end - now <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const diff = end - now;
            if (diff <= 0) {
                clearInterval(timer);
                setIsExpired(true);
                setTimeLeft({ h: 0, m: 0, s: 0 });
            } else {
                setTimeLeft({
                    h: Math.floor((diff / (1000 * 60 * 60))),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [settings]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' 
                ? scrollLeft - clientWidth 
                : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    // ─── FLASH DEALS MODE ─────────────────────────────────────────
    if (settings && !isExpired && products.length > 0) {
        const flashDealsTitle = t('home_flash_deals').split(' ');
        return (
            <section className="relative overflow-hidden rounded-3xl md:rounded-[3rem] bg-[#0A0A0B] border border-white/5 shadow-2xl shadow-primary/10 animate-fade-in">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
                
                <div className="relative z-10 p-6 md:p-14 space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-[0.2em] animate-pulse">
                                    {t('home_promo_active')}
                                </span>
                                <div className="w-12 h-px bg-white/10" />
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                                {flashDealsTitle[0]} <span className="text-primary italic">{flashDealsTitle.slice(1).join(' ')}</span>
                            </h2>
                        </div>

                        <div className="flex items-center gap-4 md:gap-6 bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] border border-white/10 backdrop-blur-md">
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-white tabular-nums">{timeLeft.h.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">{t('home_hours')}</span>
                            </div>
                            <div className="text-2xl font-black text-primary opacity-50 mb-4">:</div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-white tabular-nums">{timeLeft.m.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">{t('home_mins')}</span>
                            </div>
                            <div className="text-2xl font-black text-primary opacity-50 mb-4">:</div>
                            <div className="flex flex-col items-center">
                                <span className="text-3xl font-black text-primary tabular-nums">{timeLeft.s.toString().padStart(2, '0')}</span>
                                <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">{t('home_secs')}</span>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button onClick={() => scroll('left')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all active:scale-95 group shadow-xl">
                                <svg className="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                            </button>
                            <button onClick={() => scroll('right')} className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary hover:scale-110 transition-all active:scale-95 group shadow-xl">
                                <svg className="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                            </button>
                        </div>
                    </div>

                    <div ref={scrollRef} onScroll={handleScroll} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                        {products.map((product) => (
                            <div key={product.id} className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] snap-start">
                                <ProductCard product={product} badge="FLASH" />
                            </div>
                        ))}
                    </div>

                    <div className="relative w-full h-[2px] bg-white/5 rounded-full mt-6 overflow-hidden">
                        <div className="absolute h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(227,30,36,0.5)]" style={{ width: `${Math.max(10, (1 / products.length) * 100)}%`, left: `${scrollProgress * (1 - Math.max(0.1, 1 / products.length))}%` }} />
                    </div>
                </div>
            </section>
        );
    }

    // ─── FALLBACK: STATIC PROMO BANNER (always visible) ──────────
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden rounded-2xl md:rounded-[3rem] bg-gradient-to-br from-[#0d0d0f] via-[#120508] to-[#0d0d0f] border border-primary/20 shadow-2xl shadow-primary/10"
        >
            {/* Animated background blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-primary/15 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] bg-primary/5 rounded-full blur-[80px]" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative z-10 p-7 md:p-16 flex flex-col md:flex-row items-center gap-8 md:gap-16">
                {/* Left: Text content */}
                <div className="flex-1 space-y-5 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">
                            {t('home_promo_active') || "MAXSUS TAKLIF"}
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                        {t('promo_banner_title') || (
                            <>
                                Eng yaxshi narxlarda <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-rose-400 to-orange-400">
                                    Gaming PC lar!
                                </span>
                            </>
                        )}
                    </h2>

                    <p className="text-white/50 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                        {t('promo_banner_desc') || "Professionallar tomonidan yig'ilgan, kafolatlangan va eng yuqori sifatdagi gaming kompyuterlar. Hoziroq buyurtma bering!"}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 justify-center md:justify-start">
                        <Link
                            href="/prebuilts"
                            className="inline-flex items-center gap-3 bg-primary text-white font-black px-7 py-3.5 rounded-2xl text-[11px] uppercase tracking-widest shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all active:scale-95"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                            {t('nav_prebuilts') || "Kompyuterlar"}
                        </Link>
                        {FEATURES.PC_BUILDER && (
                            <Link
                                href="/pc-builder"
                                className="inline-flex items-center gap-3 bg-white/5 border border-white/10 text-white font-black px-7 py-3.5 rounded-2xl text-[11px] uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                {t('nav_pc_builder') || "PC Builder"}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Right: Stats grid */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 shrink-0">
                    {[
                        { value: `${totalProducts}+`, label: t('promo_stat_products') || "Mahsulotlar" },
                        { value: "1 YIL", label: t('promo_stat_warranty') || "Kafolat" },
                        { value: "24/7", label: t('promo_stat_support') || "Qo'llab-quvvatlash" },
                        { value: "100%", label: t('promo_stat_quality') || "Sifat kafolati" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4 md:p-5 text-center hover:bg-white/[0.07] hover:border-primary/30 transition-all group"
                        >
                            <div className="text-xl md:text-2xl font-black text-primary group-hover:scale-110 transition-transform inline-block">
                                {stat.value}
                            </div>
                            <div className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
}
