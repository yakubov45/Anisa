"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromotionSlider({ slides = [] }) {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);

    const minSwipeDistance = 50;

    if (!slides || slides.length === 0) return null;

    // Automated Sequence Protocol (5s interval)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 5000);
        
        // Pause sequence on manual interaction (optional enhancement)
        if (touchStart) clearInterval(timer);

        return () => clearInterval(timer);
    }, [slides.length, touchStart]);

    const next = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const prev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        if (touchStart) {
            setDragOffset(e.targetTouches[0].clientX - touchStart);
        }
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        if (distance > minSwipeDistance) next();
        else if (distance < -minSwipeDistance) prev();
        else setDragOffset(0);
        setTouchStart(null);
        setTouchEnd(null);
        setTimeout(() => setDragOffset(0), 300);
    };

    return (
        <section 
            className="relative w-full overflow-hidden rounded-2xl md:rounded-[3rem] bg-[#450A0A] shadow-2xl animate-fade-in border border-white/10 group min-h-[420px] md:min-h-[500px]"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* The Moving Track */}
            <div 
                className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ 
                    transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                    width: `${slides.length * 100}%`
                }}
            >
                {slides.map((slide, idx) => (
                    <div key={idx} className="relative w-full h-full flex-shrink-0 flex flex-col lg:grid lg:grid-cols-2 items-stretch min-h-[420px] md:min-h-[500px]">
                        {/* Mobile: Image on top */}
                        <div className="relative lg:order-last flex items-center justify-center p-6 md:p-8 min-h-[180px] md:min-h-[260px] lg:min-h-[500px] overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-red-600/20 blur-[80px] rounded-full animate-pulse" />
                            <div className={`relative w-full max-w-sm md:max-w-lg aspect-video md:aspect-square transform transition-all duration-1000 z-10 ${idx === current ? 'translate-x-0 rotate-0 scale-100' : 'translate-x-10 rotate-6 scale-90 opacity-40 blur-sm'}`}>
                                {(() => {
                                    let imgSrc = slide.image;
                                    if (imgSrc && imgSrc.includes('google.com/imgres')) {
                                        try {
                                            const urlParams = new URLSearchParams(imgSrc.split('?')[1]);
                                            const directUrl = urlParams.get('imgurl');
                                            if (directUrl) imgSrc = directUrl;
                                        } catch (e) {
                                            imgSrc = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format";
                                        }
                                    }
                                    return (
                                        <img 
                                            src={imgSrc || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format"} 
                                            alt={slide.title} 
                                            className="w-full h-full object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.8)]"
                                            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1587202377405-836165b1040a?q=80&w=1200&auto=format" }}
                                        />
                                    );
                                })()}
                            </div>
                        </div>

                        {/* Text Side */}
                        <div className="p-6 md:p-12 lg:p-20 space-y-5 md:space-y-8 lg:space-y-12 flex flex-col justify-center">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-white">
                                    <div className="flex flex-col gap-1">
                                        <div className="w-1 h-6 md:h-8 bg-white" />
                                        <div className="w-3 md:w-4 h-1 bg-white" />
                                    </div>
                                    <h2 className="text-2xl md:text-4xl font-black tracking-[0.15em] md:tracking-[0.2em] uppercase">{slide.brand || "DARK PROJECT"}</h2>
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="text-base md:text-xl font-bold text-white/90 uppercase tracking-[0.25em] md:tracking-[0.4em]">{slide.title}</h3>
                                    <div className="h-0.5 w-full bg-white/20 relative">
                                        <div className="absolute left-0 top-0 h-full bg-white transition-all duration-500" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/70 text-[11px] md:text-sm font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                {slide.description}
                            </p>

                            <div className="flex items-center gap-4">
                                <Link 
                                    href={slide.link || "/products"} 
                                    className="inline-block bg-white text-[#91005A] font-black px-6 md:px-10 py-3 md:py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
                                >
                                    Acquire Now
                                </Link>

                                {/* Inline dots for mobile */}
                                <div className="flex gap-2 lg:hidden">
                                    {slides.map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`h-1 rounded-full transition-all duration-500 ${i === current ? "w-8 bg-white" : "w-3 bg-white/20"}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation controls (desktop only) */}
            <div className="absolute bottom-8 right-8 md:bottom-10 md:right-10 z-20 hidden lg:flex gap-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-90"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-red-600 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-90 shadow-red-600/20"
                >
                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
            
            <div className="absolute bottom-8 left-8 md:bottom-10 md:left-12 z-20 hidden lg:flex gap-2">
                 {slides.map((_, idx) => (
                    <div 
                        key={idx} 
                        className={`h-1 rounded-full transition-all duration-500 ${idx === current ? "w-10 bg-white" : "w-4 bg-white/20"}`}
                    />
                 ))}
            </div>
        </section>
    );
}
