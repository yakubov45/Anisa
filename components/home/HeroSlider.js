"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_SLIDES = [
    {
        id: 1,
        title: "Performance",
        subtitle: "Defined.",
        badge: "Ultimate Hardware 2026",
        description: "Architecting next-generation hardware ecosystems for high-performance computing and professional workflows.",
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1200&auto=format&fit=crop&q=90",
        link: "/products",
        linkText: "Shop Now"
    },
    {
        id: 2,
        title: "Gaming",
        subtitle: "Unleashed.",
        badge: "RTX 5090 Ready",
        description: "Experience virtual worlds in breathtaking detail with our custom-tuned high-end gaming rigs.",
        image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=90",
        link: "/pc-builder",
        linkText: "Build Yours"
    },
    {
        id: 3,
        title: "Workstation",
        subtitle: "Elite.",
        badge: "Threadripper Pro",
        description: "Empowering creators and engineers with the most powerful processing solutions available today.",
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=90",
        link: "/products?category=PC",
        linkText: "View Lineup"
    },
    {
        id: 4,
        title: "Innovation",
        subtitle: "Evolved.",
        badge: "Liquid Cooling Tech",
        description: "Advanced thermal management systems designed for maximum stability under extreme workloads.",
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&auto=format&fit=crop&q=90",
        link: "/products",
        linkText: "Explore More"
    },
    {
        id: 5,
        title: "Precision",
        subtitle: "Crafted.",
        badge: "Limited Edition Cases",
        description: "Every component is meticulously selected and integrated to achieve industrial-grade excellence.",
        image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1200&auto=format&fit=crop&q=90",
        link: "/products",
        linkText: "See Collection"
    }
];

export default function HeroSlider({ initialSlides = DEFAULT_SLIDES }) {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);

    // Minimum distance for a swipe to be recognized
    const minSwipeDistance = 50;

    const next = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev + 1) % initialSlides.length);
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating, initialSlides.length]);

    const prev = useCallback(() => {
        if (isAnimating) return;
        setIsAnimating(true);
        setDragOffset(0);
        setCurrent((prev) => (prev - 1 + initialSlides.length) % initialSlides.length);
        setTimeout(() => setIsAnimating(false), 600);
    }, [isAnimating, initialSlides.length]);

    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
        if (touchStart) {
            const currentOffset = e.targetTouches[0].clientX - touchStart;
            setDragOffset(currentOffset);
        }
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) next();
        else if (isRightSwipe) prev();
        else setDragOffset(0);

        setTouchStart(null);
        setTouchEnd(null);
        setTimeout(() => setDragOffset(0), 300);
    };

    useEffect(() => {
        const timer = setInterval(next, 10000); // Decelerated auto-play
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section 
            className="relative h-[600px] md:h-[750px] w-full overflow-hidden rounded-[3rem] bg-[#0A0A0B] border border-white/5 shadow-2xl group"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* The Moving Track */}
            <div 
                className={`absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]`}
                style={{ 
                    transform: `translateX(calc(-${current * 100}% + ${dragOffset}px))`,
                    width: `${initialSlides.length * 100}%`
                }}
            >
                {initialSlides.map((slide, idx) => (
                    <div key={slide.id} className="relative w-full h-full flex-shrink-0 flex items-center">
                        {/* Background Image with Parallax-like effect */}
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                priority={idx === 0}
                                className="object-cover opacity-40 transition-transform duration-1000"
                                style={{ transform: idx === current ? 'scale(1)' : 'scale(1.1)' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                        </div>

                        {/* Content */}
                        <div className={`relative z-20 px-8 md:px-24 max-w-5xl space-y-8 md:space-y-12 transition-all duration-1000 delay-300 ${idx === current ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                            <div className="space-y-6 md:space-y-10">
                                <div className="inline-flex items-center gap-3 bg-primary/20 border border-primary/30 px-5 py-2.5 rounded-xl text-primary font-black text-[10px] uppercase tracking-[0.5em] backdrop-blur-md">
                                    {slide.badge}
                                </div>
                                
                                <h1 className="text-5xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter uppercase italic">
                                    {slide.title} <br />
                                    <span className="text-primary not-italic">{slide.subtitle}</span>
                                </h1>

                                <p className="text-white/60 text-sm md:text-xl font-bold max-w-xl leading-relaxed uppercase tracking-wider">
                                    {slide.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                                    <Link href={slide.link} className="bg-primary text-white font-black px-12 py-5 rounded-2xl hover:bg-white hover:text-black transition-all shadow-2xl shadow-primary/20 active:scale-95 uppercase text-xs tracking-widest w-full sm:w-auto text-center">
                                        {slide.linkText || "Acquire Now"}
                                    </Link>
                                    <Link href="/pc-builder" className="text-white/40 font-black hover:text-white transition-colors flex items-center gap-4 group/btn text-xs uppercase tracking-[0.3em]">
                                        Build Protocol
                                        <svg className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 z-30 pointer-events-none hidden md:flex items-center justify-between px-10">
                <button 
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                    className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 shadow-2xl"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); next(); }}
                    className="pointer-events-auto w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 shadow-2xl"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/></svg>
                </button>
            </div>

            {/* Pagination / Progress */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                {initialSlides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrent(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${idx === current ? "w-10 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"}`}
                    />
                ))}
            </div>
        </section>
    );
}
