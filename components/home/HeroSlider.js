"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function HeroSlider({ initialSlides }) {
    const { t } = useTranslation();

    const DEFAULT_SLIDES = [
        {
            id: 1,
            title: t('hero_1_title'),
            subtitle: t('hero_1_subtitle'),
            badge: t('hero_1_badge'),
            description: t('hero_1_desc'),
            image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&q=80",
            link: "/products",
            linkText: t('hero_cta_shop')
        },
        {
            id: 2,
            title: t('hero_2_title'),
            subtitle: t('hero_2_subtitle'),
            badge: t('hero_2_badge'),
            description: t('hero_2_desc'),
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80",
            link: "/pc-builder",
            linkText: t('hero_cta_builder')
        }
    ];

    const slides = initialSlides || DEFAULT_SLIDES;
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const next = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev + 1) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating, slides.length]);

    const prev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
        setTimeout(() => setIsAnimating(false), 600);
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

    useEffect(() => {
        const timer = setInterval(next, 10000);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section
            className="relative h-[450px] sm:h-[600px] md:h-[700px] w-full overflow-hidden rounded-3xl md:rounded-[3rem] bg-[#0A0A0B] border border-white/5 shadow-2xl group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div
                className="absolute inset-0 flex h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                    width: `${slides.length * 100}%`
                }}
            >
                {slides.map((slide, idx) => (
                    // w-full o'rniga min-w-full ishlatildi. Bu har bir slayd aniq 100% ekran kengligini olishini ta'minlaydi.
                    <div key={slide.id} className="relative min-w-full h-full flex-shrink-0 flex items-center">
                        <div className="absolute inset-0 z-0">
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
                                        src={imgSrc || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&auto=format&fit=crop&q=90"}
                                        alt={slide.title}
                                        fill
                                        priority={idx === 0}
                                        className="object-cover opacity-40 transition-transform duration-1000"
                                        style={{ transform: idx === current ? 'scale(1)' : 'scale(1.1)' }}
                                    />
                                );
                            })()}
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 md:via-black/40 to-transparent z-10" />
                        </div>

                        {/* paddinglar px-6 qilib qisqartirildi (mobil uchun) */}
                        <div className={`relative z-20 px-6 sm:px-10 md:px-24 max-w-5xl space-y-6 md:space-y-12 transition-all duration-1000 delay-300 w-full ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 md:-translate-x-20'}`}>
                            <div className="space-y-4 md:space-y-10">
                                <div className="inline-flex items-center gap-3 bg-primary/20 border border-primary/30 px-4 py-2 rounded-xl text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.5em] backdrop-blur-md">
                                    {slide.badge}
                                </div>

                                {/* Mobil shrift o'lchami text-2xl ga o'zgartirildi (juda katta bo'lmasligi uchun) */}
                                <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-[1.1] md:leading-[1.1] tracking-tighter uppercase italic break-words">
                                    {slide.title} <br />
                                    <span className="text-primary not-italic">{slide.subtitle}</span>
                                </h1>

                                {/* Ta'rif matni o'lchami mobil uchun moslandi - juda keng bo'lib ketmasligi uchun max-w qo'shildi */}
                                <p className="text-white/70 text-[10px] sm:text-sm md:text-lg font-bold max-w-[250px] sm:max-w-md md:max-w-xl leading-relaxed uppercase tracking-wider line-clamp-3 md:line-clamp-none">
                                    {slide.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-4">
                                    <Link href={slide.link} className="bg-primary text-white font-black px-10 sm:px-12 py-3.5 md:py-5 rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20 active:scale-95 uppercase text-[10px] md:text-xs tracking-widest w-auto text-center flex items-center justify-center">
                                        {slide.linkText || t('hero_cta_shop')}
                                    </Link>
                                    <Link href="/pc-builder" className="text-white/50 font-black hover:text-white transition-colors flex items-center gap-4 group/btn text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] w-auto justify-center sm:justify-start py-2">
                                        {t('hero_cta_builder')}
                                        <svg className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-0 z-30 pointer-events-none hidden md:flex items-center justify-between px-10">
                <button onClick={prev} className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button onClick={next} className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 shadow-2xl">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>

            {/* Pagination Indicators */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 md:gap-3 bg-black/20 backdrop-blur-xl px-4 py-2 md:px-6 md:py-3 rounded-full md:rounded-2xl border border-white/5 z-40">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => {
                            if (isAnimating) return;
                            setIsAnimating(true);
                            setCurrent(idx);
                            setTimeout(() => setIsAnimating(false), 600);
                        }}
                        className={`h-1 md:h-1.5 rounded-full transition-all duration-500 ${current === idx ? 'w-6 md:w-10 bg-primary' : 'w-1.5 md:w-3 bg-white/30'}`}
                    />
                ))}
            </div>
        </section>
    );
}