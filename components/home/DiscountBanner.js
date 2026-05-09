"use client"

import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/lib/LanguageContext';
import ProductCard from '@/features/product/ProductCard';

// Data is now passed as props from the server component (app/page.js)
export default function DiscountBanner({ flashDeals }) {
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

    if (!settings || isExpired || products.length === 0) return null;

    const flashDealsTitle = t('home_flash_deals').split(' ');

    return (
        <section className="relative overflow-hidden rounded-3xl md:rounded-[3rem] bg-[#0A0A0B] border border-white/5 shadow-2xl shadow-primary/10 mx-4 md:mx-8 animate-fade-in">
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
                            <ProductCard product={{ ...product, discount: settings?.discountPercentage || 15 }} badge="FLASH" />
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
