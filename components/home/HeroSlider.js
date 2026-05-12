"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

// Static slide data
const SLIDE_DATA = [
    {
        id: 1,
        titleKey: 'hero_1_title',
        subtitleKey: 'hero_1_subtitle',
        badgeKey: 'hero_1_badge',
        descKey: 'hero_1_desc',
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&q=90",
        link: "/products",
        linkKey: 'hero_cta_shop'
    },
    {
        id: 2,
        titleKey: 'hero_2_title',
        subtitleKey: 'hero_2_subtitle',
        badgeKey: 'hero_2_badge',
        descKey: 'hero_2_desc',
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&q=90",
        link: "/pc-builder",
        linkKey: 'hero_cta_builder'
    }
];

export default function HeroSlider({ initialSlides }) {
    const { t } = useTranslation();

    const slides = initialSlides?.length > 0
        ? initialSlides
        : SLIDE_DATA.map(s => ({
            ...s,
            title: t(s.titleKey),
            subtitle: t(s.subtitleKey),
            badge: t(s.badgeKey),
            description: t(s.descKey),
            linkText: t(s.linkKey),
        }));

    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const sliderRef = useRef(null);

    const next = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 800);
    }, [isAnimating, slides.length]);

    const prev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 800);
    }, [isAnimating, slides.length]);

    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const minSwipeDistance = 50;

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

    const handleMouseMove = (e) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    useEffect(() => {
        const timer = setInterval(next, 10000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section
            ref={sliderRef}
            className="relative h-[500px] sm:h-[650px] md:h-[800px] w-full overflow-hidden rounded-[2rem] md:rounded-[4rem] bg-[#050505] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Custom Styles for Subtle Particles & Motion Blur */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes float-particles {
                    0% { transform: translateY(0) rotate(0deg); opacity: 0; }
                    50% { opacity: 0.5; }
                    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
                }
                .particle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(var(--primary), 0.8) 0%, transparent 70%);
                    border-radius: 50%;
                    pointer-events: none;
                    animation: float-particles linear infinite;
                }
                .motion-blur-active {
                    filter: blur(8px) brightness(1.2);
                }
            `}} />

            {/* Subtle Particles Background */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
                {Array.from({ length: 15 }).map((_, i) => (
                    <div 
                        key={i}
                        className="particle"
                        style={{
                            width: `${Math.random() * 4 + 1}px`,
                            height: `${Math.random() * 4 + 1}px`,
                            left: `${Math.random() * 100}%`,
                            top: '100%',
                            animationDuration: `${Math.random() * 10 + 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            {/* Glowing Orb following mouse */}
            <div 
                className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-10 transition-transform duration-700 ease-out mix-blend-screen hidden md:block"
                style={{
                    transform: `translate(calc(${mousePos.x * 400}px - 50%), calc(${mousePos.y * 400}px - 50%))`,
                    left: '50%',
                    top: '50%'
                }}
            />

            <div
                className="absolute inset-0 flex h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                style={{
                    transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                    width: `${slides.length * 100}%`
                }}
            >
                {slides.map((slide, idx) => (
                    <div key={slide.id} className="relative min-w-full h-full flex-shrink-0 flex items-center">
                        <div className={`absolute inset-0 z-0 transition-all duration-500 ${isAnimating ? 'motion-blur-active' : ''}`}>
                            {(() => {
                                let imgSrc = slide.image;
                                if (imgSrc && imgSrc.includes('google.com/imgres')) {
                                    try {
                                        const urlParams = new URLSearchParams(imgSrc.split('?')[1]);
                                        const directUrl = urlParams.get('imgurl');
                                        if (directUrl) imgSrc = directUrl;
                                    } catch (e) { }
                                }
                                return (
                                    <Image
                                        src={imgSrc || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&auto=format&fit=crop&q=90"}
                                        alt={slide.title}
                                        fill
                                        priority={idx < 2}
                                        className="object-cover opacity-50 transition-transform duration-[10000ms] ease-out"
                                        style={{ 
                                            transform: idx === current 
                                                ? `scale(1.05) translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` 
                                                : 'scale(1.15)' 
                                        }}
                                    />
                                );
                            })()}
                            
                            {/* Stronger, Premium Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-80" />
                        </div>

                        <div className={`relative z-20 px-6 sm:px-10 md:px-24 max-w-[1400px] w-full space-y-6 md:space-y-12 transition-all duration-[800ms] delay-200 ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16 md:-translate-x-32'}`}>
                            <div className="space-y-6 md:space-y-8 max-w-2xl text-left">
                                
                                <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-white font-bold text-[10px] md:text-xs uppercase tracking-[0.3em] md:tracking-[0.4em] backdrop-blur-xl shadow-2xl">
                                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                    {slide.badge}
                                </div>

                                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-white leading-[1.05] tracking-tight">
                                    {slide.title.split(' ').map((word, i) => (
                                        <span key={i} className="block">{word}</span>
                                    ))}
                                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-500 pb-2">
                                        {slide.subtitle}
                                    </span>
                                </h1>

                                <p className="text-surface-300 text-sm sm:text-base md:text-xl font-medium max-w-[280px] sm:max-w-md md:max-w-xl leading-relaxed">
                                    {slide.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 pt-6">
                                    <Link 
                                        href={slide.link} 
                                        className="group relative bg-white text-black font-extrabold px-10 sm:px-14 py-4 md:py-5 rounded-full hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 text-[11px] md:text-sm uppercase tracking-widest w-auto flex items-center justify-center overflow-hidden"
                                    >
                                        <span className="relative z-10 flex items-center gap-3">
                                            {slide.linkText || t('hero_cta_shop')}
                                            <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                        <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                    </Link>
                                    
                                    <Link 
                                        href="/products?sort=popular" 
                                        className="text-white/60 font-bold hover:text-white transition-all duration-300 flex items-center gap-3 group/link text-[11px] md:text-sm uppercase tracking-[0.2em] relative"
                                    >
                                        <span>TOP PRODUCTS</span>
                                        <div className="h-[2px] w-0 bg-primary absolute -bottom-1 left-0 group-hover/link:w-full transition-all duration-300" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Premium Navigation Controls */}
            <div className="absolute inset-0 z-30 pointer-events-none hidden md:flex items-center justify-between px-8 lg:px-12">
                <button onClick={prev} className="pointer-events-auto w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={next} className="pointer-events-auto w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Premium Pagination Indicators */}
            <div className="absolute bottom-8 md:bottom-12 left-6 md:left-24 flex items-center gap-3 z-40">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isAnimating) return;
                            setIsAnimating(true);
                            setCurrent(idx);
                            setTimeout(() => setIsAnimating(false), 800);
                        }}
                        className="group relative h-2 flex items-center justify-center"
                    >
                        <div className={`h-[2px] md:h-1 rounded-full transition-all duration-700 ease-out ${current === idx ? 'w-12 md:w-20 bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]' : 'w-4 md:w-8 bg-white/20 group-hover:bg-white/50'}`} />
                    </button>
                ))}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-8 right-6 md:right-24 z-40 hidden md:flex flex-col items-center gap-2 opacity-50">
                <span className="text-[9px] font-bold text-white uppercase tracking-[0.4em] rotate-90 origin-right translate-x-3 mb-8">SCROLL</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    );
}