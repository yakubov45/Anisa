"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Link from 'next/link';
import { getCategoryDisplayName } from "@/lib/constants";

const categories = [
    { name: "Laptops", slug: "laptops", id: "laptops", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, href: "/products?category=laptops", color: "from-blue-500/20 to-blue-600/5" },
    { name: "Workstations", slug: "workstations", id: "Workstations", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>, href: "/prebuilts", color: "from-primary/20 to-primary/5" },
    { name: "Displays", slug: "displays", id: "monitors", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, href: "/products?category=monitors", color: "from-purple-500/20 to-purple-600/5" },
    { name: "Mice", slug: "mice", id: "mice", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>, href: "/products?category=mice", color: "from-pink-500/20 to-pink-600/5" },
    { name: "Keyboards", slug: "keyboards", id: "keyboards", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16M8 6v12m8-12v12" /></svg>, href: "/products?category=keyboards", color: "from-indigo-500/20 to-indigo-600/5" },
    { name: "Headsets", slug: "headsets", id: "headsets", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12a9 9 0 1 1 18 0v4.5A2.5 2.5 0 0 1 18.5 19H17v-6h3v-1a8 8 0 1 0-16 0v1h3v6H5.5A2.5 2.5 0 0 1 3 16.5V12z"/></svg>, href: "/products?category=headsets", color: "from-green-500/20 to-green-600/5" },
    { name: "Processors", slug: "processors", id: "Processors", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>, href: "/products?category=Processors", color: "from-orange-500/20 to-orange-600/5" },
    { name: "Graphics", slug: "graphics", id: "Graphics", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM7 7h10M7 11h10M7 15h10"/></svg>, href: "/products?category=Graphics", color: "from-red-500/20 to-red-600/5" },
    { name: "Memory", slug: "memory", id: "Memory", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>, href: "/products?category=Memory", color: "from-cyan-500/20 to-cyan-600/5" },
    { name: "Storage", slug: "storage", id: "Storage", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2zm8 4h5m-5 4h5"/></svg>, href: "/products?category=Storage", color: "from-amber-500/20 to-amber-600/5" },
    { name: "Power Units", slug: "psus", id: "PSUs", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, href: "/products?category=PSUs", color: "from-yellow-500/20 to-yellow-600/5" },
    { name: "Cases", slug: "cases", id: "Cases", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7m18 0l-9 4-9-4"/></svg>, href: "/products?category=Cases", color: "from-zinc-500/20 to-zinc-600/5" },
    { name: "Cooling", slug: "cooling", id: "Cooling", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, href: "/products?category=Cooling", color: "from-teal-500/20 to-teal-600/5" },
];

export default function CategoryGrid() {
    const { t, lang } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);

    // Show 6 initially (2 rows of 3 on mobile)
    const visibleCategories = categories.slice(0, 6);
    const hiddenCategories = categories.slice(6);

    return (
        <section className="space-y-8 md:space-y-12">
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full transition-transform group-hover:scale-x-110" />
                    <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter flex items-center gap-4">
                        {t('nav_categories')}
                    </h2>
                </div>
                <div className={`text-surface-400 group-hover:text-primary transition-all duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                    <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
            </div>
            
            <div>
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
                    {visibleCategories.map((cat, index) => (
                        <CategoryCard key={cat.id} cat={cat} index={index} lang={lang} />
                    ))}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 pt-3 md:pt-6">
                                {hiddenCategories.map((cat, index) => (
                                    <CategoryCard key={cat.id} cat={cat} index={index} lang={lang} />
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

const MotionLink = motion.create(Link);

function CategoryCard({ cat, index, lang }) {
    const chamferPolygon = "polygon(15% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 15%)";

    return (
        <MotionLink 
            href={cat.href}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="group relative block w-full aspect-square md:aspect-auto md:h-32 hover:-translate-y-2 transition-transform duration-500"
            // The outer wrapper has the clip path and the gradient border
            style={{ clipPath: chamferPolygon }}
        >
            {/* Animated glowing gradient border */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 group-hover:from-primary group-hover:via-red-500 group-hover:to-orange-600 transition-all duration-500" />
            
            {/* Inner dark container (leaves 1px for the gradient border to show) */}
            <div 
                className="absolute inset-[1px] md:inset-[2px] bg-[#0c0c0e] group-hover:bg-[#120a0a] flex flex-col items-center justify-center gap-3 transition-colors duration-500"
                style={{ clipPath: chamferPolygon }}
            >
                {/* Cyberpunk Grid Background on Hover */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef444415_1px,transparent_1px),linear-gradient(to_bottom,#ef444415_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Icon */}
                <div className="text-white/30 group-hover:text-primary group-hover:scale-125 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-500 relative z-10 [&>svg]:w-8 [&>svg]:h-8 md:[&>svg]:w-10 md:[&>svg]:h-10">
                    {cat.icon}
                </div>

                {/* Text */}
                <span className="font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-colors text-center relative z-10 px-2 leading-tight">
                    {getCategoryDisplayName(cat, lang)}
                </span>

                {/* Decorative neon accent lines */}
                <div className="absolute top-2 left-2 w-2 h-[2px] bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                <div className="absolute bottom-2 right-2 w-2 h-[2px] bg-primary/0 group-hover:bg-primary transition-all duration-300" />
            </div>
        </MotionLink>
    );
}
