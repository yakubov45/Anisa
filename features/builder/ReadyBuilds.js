"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { getPreBuiltSystems } from "@/features/product/api"

export default function ReadyBuilds() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [builds, setBuilds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [dragOffset, setDragOffset] = useState(0);

    const minSwipeDistance = 50;

    useEffect(() => {
        const fetchBuilds = async () => {
            const data = await getPreBuiltSystems();
            setBuilds(data);
            setLoading(false);
        };
        fetchBuilds();
    }, []);

    const next = useCallback(() => {
        if (builds.length === 0) return;
        setDragOffset(0);
        setCurrentIndex((prev) => (prev + 1) % builds.length);
    }, [builds.length]);

    const prev = () => {
        if (builds.length === 0) return;
        setDragOffset(0);
        setCurrentIndex((prev) => (prev - 1 + builds.length) % builds.length);
    };

    useEffect(() => {
        if (builds.length === 0) return;
        const timer = setInterval(next, 7000);
        return () => clearInterval(timer);
    }, [next, builds.length]);

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

    if (loading) return (
        <div className="h-[500px] flex items-center justify-center bg-[#050A15] rounded-[2.5rem]">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    if (builds.length === 0) return null;

    return (
        <div
            className="relative group bg-[#0A0A0B] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Background Decorative Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 blur-[80px] rounded-full" />
            </div>

            <div
                className="relative flex w-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{
                    // Inline width ni olib tashladik, endi slider faqat translateX orqali boshqariladi
                    transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
                }}
            >
                {builds.map((activePC, idx) => (
                    // Xatolikni to'g'irlash uchun "min-w-full w-full" klassini qo'shdik, shunda rasmlar o'z o'rniga tushadi
                    <div key={activePC.id} className="min-w-full w-full flex-shrink-0 flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-20 min-h-[550px]">

                        {/* Left: Content */}
                        <div className="w-full lg:w-1/2 space-y-8 transition-all duration-700">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-1 bg-primary rounded-full" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Featured Build {idx + 1}</span>
                                </div>
                                <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter uppercase leading-none">{activePC.name}</h2>
                                <p className="text-white/60 font-bold text-xs lg:text-base max-w-lg leading-relaxed uppercase tracking-wider">
                                    {activePC.desc}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 border-y border-white/5 py-8">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Specifications</span>
                                    <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-wider">{activePC.specs}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Build Status</span>
                                    <p className="text-[10px] md:text-xs font-bold text-green-500 uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Certified Stable
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">One-time Investment</span>
                                    <span className="text-2xl md:text-4xl font-black text-white tracking-tighter">$ {activePC.price}</span>
                                </div>
                                <Link
                                    href={`/pc-builder/${activePC.id}`}
                                    className="flex-1 lg:flex-none bg-primary text-white font-black text-[10px] md:text-xs text-center uppercase tracking-[0.2em] px-8 md:px-12 py-5 rounded-2xl hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>

                        {/* Right: Product Image */}
                        <div className="w-full lg:w-1/2 flex justify-center relative">
                            {/* Decorative Neon Ring */}
                            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full scale-75 animate-pulse" />

                            <div className={`relative w-full max-w-md aspect-square bg-white/5 rounded-[2.5rem] border border-white/10 p-8 flex items-center justify-center transition-all duration-1000 z-10 ${idx === currentIndex ? 'scale-105 rotate-0 shadow-2xl shadow-primary/20' : 'scale-90 rotate-12 opacity-40 blur-sm'}`}>
                                <img
                                    src={activePC.image || "https://images.unsplash.com/photo-1587202377405-836165b1040a?q=80&w=1200&auto=format"}
                                    alt={activePC.name}
                                    className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)]"
                                    onError={(e) => {
                                        e.target.src = "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=1200&auto=format"
                                    }}
                                />
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 whitespace-nowrap border border-white/10">
                                    Strategic Build
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all backdrop-blur-xl group z-20 shadow-2xl opacity-0 group-hover:opacity-100 -translate-x-5 group-hover:translate-x-0"
            >
                <svg className="w-6 h-6 md:w-8 md:h-8 transform transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
            </button>

            <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-primary transition-all backdrop-blur-xl group z-20 shadow-2xl opacity-0 group-hover:opacity-100 translate-x-5 group-hover:translate-x-0"
            >
                <svg className="w-6 h-6 md:w-8 md:h-8 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Pagination Indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/5 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/5">
                {builds.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ${currentIndex === idx ? 'w-10 bg-primary' : 'w-3 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    )
}