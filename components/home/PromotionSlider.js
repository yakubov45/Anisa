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
            className="relative w-full overflow-hidden rounded-[3rem] bg-[#450A0A] min-h-[400px] md:min-h-[550px] shadow-2xl animate-fade-in border border-white/10 group"
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
                    <div key={idx} className="relative w-full h-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-2 items-center">
                        {/* Left Side: Branding & Info */}
                        <div className="p-12 md:p-20 space-y-12 transition-all duration-700">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4 text-white">
                                    <div className="flex flex-col gap-1">
                                        <div className="w-1 h-8 bg-white" />
                                        <div className="w-4 h-1 bg-white" />
                                    </div>
                                    <h2 className="text-4xl font-black tracking-[0.2em] uppercase">{slide.brand || "DARK PROJECT"}</h2>
                                </div>
                                
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white/90 uppercase tracking-[0.4em]">{slide.title}</h3>
                                    <div className="h-0.5 w-full bg-white/20 relative">
                                        <div className="absolute left-0 top-0 h-full bg-white transition-all duration-500" style={{ width: `${((current + 1) / slides.length) * 100}%` }} />
                                    </div>
                                </div>
                            </div>

                            <p className="text-white/70 text-xs md:text-sm font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                {slide.description}
                            </p>

                            <Link 
                                href={slide.link || "/products"} 
                                className="inline-block bg-white text-[#91005A] font-black px-10 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-black hover:text-white transition-all shadow-xl active:scale-95"
                            >
                                Acquire Now
                            </Link>
                        </div>

                        {/* Right Side: Product Image */}
                        <div className="relative h-full min-h-[300px] lg:min-h-[500px] overflow-hidden flex items-center justify-center p-8">
                            {/* Decorative Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-red-600/20 blur-[100px] rounded-full animate-pulse" />
                            
                            <div className={`relative w-full max-w-lg aspect-video lg:aspect-square transform transition-all duration-1000 z-10 ${idx === current ? 'translate-x-0 rotate-0 scale-100' : 'translate-x-20 rotate-12 scale-90 opacity-40 blur-sm'}`}>
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
                                            className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.8)]"
                                            onError={(e) => {
                                                e.target.src = "https://images.unsplash.com/photo-1587202377405-836165b1040a?q=80&w=1200&auto=format"
                                            }}
                                        />
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation controls (fixed) */}
            <div className="absolute bottom-10 right-10 z-20 flex gap-4">
                <button 
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="w-12 h-12 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-90"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="w-12 h-12 rounded-xl bg-red-600 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-lg active:scale-90 shadow-red-600/20"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>
            
            <div className="absolute bottom-10 left-12 z-20 flex gap-2">
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
