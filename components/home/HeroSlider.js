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
        image: "/images (1).jpg",
        link: "/products",
        linkKey: 'hero_cta_shop'
    },
    {
        id: 2,
        titleKey: 'hero_2_title',
        subtitleKey: 'hero_2_subtitle',
        badgeKey: 'hero_2_badge',
        descKey: 'hero_2_desc',
        // Ichki detallari ko'rinib turgan, RGB va to'q fonli Case
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=1920&h=1080&q=80",
        link: "/pc-builder",
        linkKey: 'hero_cta_builder'
    },
    {
        id: 3,
        titleKey: 'hero_3_title',
        subtitleKey: 'hero_3_subtitle',
        badgeKey: 'hero_3_badge',
        descKey: 'hero_3_desc',
        // Kiber-sport muhitidagi qizg'ish PC setup
        image: "/19ed9846ffda2a5a9763a7d9be6d112c.jpg",
        link: "/prebuilts",
        linkKey: 'hero_cta_prebuilts'
    },
    {
        id: 4,
        titleKey: 'hero_4_title',
        subtitleKey: 'hero_4_subtitle',
        badgeKey: 'hero_4_badge',
        descKey: 'hero_4_desc',
        // Qorong'i fonda yonib turgan kuchli e-sport kompyuteri
        image: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&w=1920&h=1080&q=80",
        link: "/products",
        linkKey: 'hero_cta_deals'
    },

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
        setTimeout(() => setIsAnimating(false), 700);
    }, [isAnimating, slides.length]);

    const prev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 700);
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

    const slide = slides[current];

    return (
        <section
            ref={sliderRef}
            className="relative w-full max-w-[1400px] mx-auto overflow-hidden rounded-[1.5rem] md:rounded-[3rem] bg-[#050505] border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* ─── MOBILE LAYOUT (< md) ─────────────────────────────── */}
            <div className="flex flex-col md:hidden">
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                    <div
                        className="absolute inset-0 flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{
                            transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                        }}
                    >
                        {slides.map((s, idx) => {
                            let src = s.image || "";
                            if (src.includes('google.com/imgres')) {
                                try {
                                    const p = new URLSearchParams(src.split('?')[1]);
                                    src = p.get('imgurl') || src;
                                } catch (e) { }
                            }
                            return (
                                // XATO TUG'IRLANDI: min-w-full o'rniga w-full flex-shrink-0 qo'yildi
                                <div key={s.id} className="relative w-full h-full flex-shrink-0">
                                    <Image
                                        src={src || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80"}
                                        alt={s.title || "Slide"}
                                        fill
                                        priority={idx < 2}
                                        className="object-cover object-[center_30%]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/90" />
                                </div>
                            );
                        })}
                    </div>

                    <div className="absolute top-4 left-4 z-20">
                        <div className="inline-flex items-center gap-1.5 bg-black/50 border border-white/10 px-3 py-1.5 rounded-full text-white font-bold text-[9px] uppercase tracking-[0.25em] backdrop-blur-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            {slide?.badge}
                        </div>
                    </div>
                </div>

                <div className="bg-[#080a0d] px-5 py-6 space-y-4">
                    <h2 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
                        {slide?.title?.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-400 mt-0.5">
                            {slide?.subtitle}
                        </span>
                    </h2>

                    <p className="text-white/55 text-xs leading-relaxed line-clamp-2">
                        {slide?.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1">
                        <Link
                            href={slide?.link || "/products"}
                            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-extrabold py-3 rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-primary/30 active:scale-95 transition-all"
                        >
                            {slide?.linkText || t('hero_cta_shop')}
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    if (isAnimating) return;
                                    setIsAnimating(true);
                                    setCurrent(idx);
                                    setTimeout(() => setIsAnimating(false), 700);
                                }}
                                className="group relative h-2 flex items-center justify-center"
                            >
                                <div className={`h-[3px] rounded-full transition-all duration-500 ${current === idx ? 'w-8 bg-primary shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'w-4 bg-white/20'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── DESKTOP LAYOUT (≥ md) ───────────────────────────── */}
            <div className="hidden md:block relative h-[400px] lg:h-[460px]">
                <div
                    className="absolute w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none z-10 transition-transform duration-700 ease-out mix-blend-screen"
                    style={{
                        transform: `translate(calc(${mousePos.x * 400}px - 50%), calc(${mousePos.y * 400}px - 50%))`,
                        left: '50%',
                        top: '50%',
                    }}
                />

                <div
                    className="absolute inset-0 flex h-full transition-transform duration-[800ms] ease-[cubic-bezier(0.25,1,0.5,1)]"
                    style={{
                        transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {slides.map((s, idx) => {
                        let src = s.image || "";
                        if (src.includes('google.com/imgres')) {
                            try {
                                const p = new URLSearchParams(src.split('?')[1]);
                                src = p.get('imgurl') || src;
                            } catch (e) { }
                        }
                        return (
                            // XATO TUG'IRLANDI: min-w-full o'rniga w-full flex-shrink-0 qo'yildi
                            <div key={s.id} className="relative w-full h-full flex-shrink-0 flex items-center">
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={src || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&q=90"}
                                        alt={s.title || "Slide"}
                                        fill
                                        priority={idx < 2}
                                        className="object-cover object-[80%_center] opacity-100"
                                        style={{
                                            transform: idx === current
                                                ? `scale(1.02) translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
                                                : 'scale(1.08)'
                                        }}
                                    />
                                    <div className="absolute inset-0 w-full md:w-[75%] bg-gradient-to-r from-[#050505] via-[#050505]/90 to-transparent z-10" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10 opacity-60" />
                                </div>

                                <div className={`relative z-20 px-10 md:px-24 max-w-[1400px] w-full space-y-6 transition-all duration-[800ms] delay-200 ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32'}`}>
                                    <div className="space-y-5 max-w-2xl text-left">
                                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-white font-bold text-[10px] uppercase tracking-[0.4em] backdrop-blur-xl shadow-2xl">
                                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                            {s.badge}
                                        </div>

                                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] tracking-tight">
                                            {s.title?.split(' ').map((word, i) => (
                                                <span key={i} className="block">{word}</span>
                                            ))}
                                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-red-400 to-orange-500 pb-2">
                                                {s.subtitle}
                                            </span>
                                        </h1>

                                        <p className="text-surface-300 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                                            {s.description}
                                        </p>

                                        <div className="flex items-center gap-5 pt-3">
                                            <Link
                                                href={s.link}
                                                className="group relative bg-white text-black font-extrabold px-10 py-3.5 rounded-full hover:bg-transparent hover:text-white border-2 border-white transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] active:scale-95 text-xs uppercase tracking-widest flex items-center justify-center overflow-hidden"
                                            >
                                                <span className="relative z-10 flex items-center gap-3">
                                                    {s.linkText || t('hero_cta_shop')}
                                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </span>
                                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                            </Link>

                                            <Link
                                                href="/products?sort=popular"
                                                className="text-white/60 font-bold hover:text-white transition-all duration-300 flex items-center gap-3 group/link text-xs uppercase tracking-[0.2em] relative"
                                            >
                                                <span>{t('top_products')}</span>
                                                <div className="h-[2px] w-0 bg-primary absolute -bottom-1 left-0 group-hover/link:w-full transition-all duration-300" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-between px-8 lg:px-12">
                    <button onClick={prev} className="pointer-events-auto w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <button onClick={next} className="pointer-events-auto w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-90">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                if (isAnimating) return;
                                setIsAnimating(true);
                                setCurrent(idx);
                                setTimeout(() => setIsAnimating(false), 700);
                            }}
                            className="group relative h-2 flex items-center justify-center"
                        >
                            <div className={`h-1 rounded-full transition-all duration-700 ease-out ${current === idx ? 'w-20 bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'w-8 bg-white/20 group-hover:bg-white/50'}`} />
                        </button>
                    ))}
                </div>

                <div className="absolute bottom-8 right-24 z-40 flex flex-col items-center gap-2 opacity-50">
                    <span className="text-[9px] font-bold text-white uppercase tracking-[0.4em] rotate-90 origin-right translate-x-3 mb-8">SCROLL</span>
                    <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
                </div>
            </div>
        </section>
    );
}