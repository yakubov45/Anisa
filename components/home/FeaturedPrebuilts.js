"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import useStore from "@/store/useStore";

export default function FeaturedPrebuilts({ prebuilts }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedCardId, setExpandedCardId] = useState(null);
    if (!prebuilts || prebuilts.length === 0) return null;

    const visiblePrebuilts = prebuilts.slice(0, 3);
    const hiddenPrebuilts = prebuilts.slice(3);

    return (
        <section className="bg-surface dark:bg-[#0A0A0B] text-surface-900 dark:text-white rounded-[2.5rem] overflow-hidden my-12 shadow-2xl relative transition-all duration-500">
            {/* Hero / Header Part */}
            <div className="relative py-16 px-6 md:px-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-surface-50 to-surface-100 dark:from-[#0A0A0B] dark:to-[#111111] border-b border-black/5 dark:border-white/5">
                <div className="max-w-2xl z-10">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-surface-900 to-surface-500 dark:from-white dark:to-surface-400">
                        OnePC Extreme Prebuilts
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg md:text-xl font-medium mb-8">
                        Professionallar tomonidan yig'ilgan, maksimal unumdorlik va mukammal dizaynga ega tayyor kompyuterlar.
                    </p>
                    <Link href="/prebuilts" className="inline-block bg-primary hover:bg-primary-600 text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-xl shadow-primary/20">
                        Barcha kompyuterlarni ko'rish
                    </Link>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface-50/0 dark:from-primary/20 dark:via-[#0A0A0B]/0 to-transparent blur-3xl pointer-events-none"></div>
            </div>

            {/* Grid Part */}
            <div className="p-6 md:p-12 bg-surface dark:bg-[#0A0A0B]">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                        {visiblePrebuilts.map((pc) => (
                            <PrebuiltCard 
                                key={pc.id} 
                                pc={pc} 
                            />
                        ))}
                    </div>

                    <AnimatePresence>
                        {isExpanded && hiddenPrebuilts.length > 0 && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                                className="overflow-hidden"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 items-start">
                                    {hiddenPrebuilts.map((pc) => (
                                        <PrebuiltCard 
                                            key={pc.id} 
                                            pc={pc} 
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {hiddenPrebuilts.length > 0 && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex flex-col items-center gap-2 text-surface-400 hover:text-primary transition-all group"
                        >
                            <span className="text-xs font-black uppercase tracking-widest">{isExpanded ? 'Yashirish' : "Ko'proq ko'rish"}</span>
                            <svg className={`w-8 h-8 transition-transform duration-500 ${isExpanded ? 'rotate-180' : 'group-hover:translate-y-1'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function PrebuiltCard({ pc }) {
    const { addToCart, currency, exchangeRate } = useStore();
    const [activeImg, setActiveImg] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const images = pc.images?.length > 0 ? pc.images : ['https://via.placeholder.com/400x300?text=No+Image'];
    const hasSecondImage = images.length > 1;

    const handleAddToCart = () => {
        addToCart({
            id: pc.id,
            name: pc.name,
            price: pc.price,
            image: images[0],
            category: 'prebuilt',
        });
        toast.success(`${pc.name} savatchaga qo'shildi!`);
    };

    const price = formatPrice(pc.price, currency || 'UZS', exchangeRate);

    // Get specifications (fallback to quick_specs if specifications array not present)
    const specifications = pc.specifications || [];
    
    // Featured specs (rendered in the 4-grid SpecChips)
    const featuredSpecs = specifications.length > 0
        ? specifications.filter(s => s.isFeatured)
        : [
            { name: "CPU", value: pc.quick_specs?.cpu },
            { name: "GPU", value: pc.quick_specs?.gpu },
            { name: "RAM", value: pc.quick_specs?.ram },
            { name: "SSD", value: pc.quick_specs?.storage || pc.quick_specs?.ssd }
          ].filter(s => s.value);

    // Non-featured specs (rendered inside expandable section)
    const nonFeaturedSpecs = specifications.length > 0
        ? specifications.filter(s => !s.isFeatured)
        : [
            { name: "Anakart", value: pc.quick_specs?.motherboard },
            { name: "Quvvat bloki", value: pc.quick_specs?.psu },
            { name: "Sovutish", value: pc.quick_specs?.cooling },
            { name: "Korpus", value: pc.quick_specs?.case }
          ].filter(s => s.value);

    const hasExtraSpecs = nonFeaturedSpecs.length > 0;

    return (
        <div className="bg-white dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5 overflow-hidden group hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10 flex flex-col relative">
            {/* Image with hover swap animation */}
            <div
                className="relative aspect-[4/3] bg-surface-50 dark:bg-black/50 overflow-hidden cursor-pointer"
                onMouseEnter={() => hasSecondImage && setActiveImg(1)}
                onMouseLeave={() => setActiveImg(0)}
            >
                {/* Badges */}
                {pc.badges && (
                    <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                        {(Array.isArray(pc.badges) ? pc.badges : [pc.badges]).map((b, i) => (
                            <span key={i} className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                {b}
                            </span>
                        ))}
                    </div>
                )}

                {/* Animated image swap */}
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeImg}
                        src={images[activeImg]}
                        alt={pc.name}
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="w-full h-full object-contain p-4 drop-shadow-xl dark:drop-shadow-2xl"
                    />
                </AnimatePresence>

                {/* Image dots indicator */}
                {hasSecondImage && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {images.slice(0, 2).map((_, i) => (
                            <div
                                key={i}
                                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeImg ? 'bg-primary w-4' : 'bg-black/20 dark:bg-white/30'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-black uppercase tracking-wide text-surface-900 dark:text-white mb-2 line-clamp-1" title={pc.name}>{pc.name}</h3>

                {/* Featured Specs Chips */}
                {featuredSpecs.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-3 mb-3">
                        {featuredSpecs.slice(0, 4).map((spec, i) => {
                            // Match icons by spec name
                            let icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/></svg>;
                            const name = spec.name.toUpperCase();
                            if (name === "CPU" || name === "PROTSESSOR") {
                                icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>;
                            } else if (name === "GPU" || name === "VIDEOKARTA") {
                                icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM7 7h10M7 11h10M7 15h7"/></svg>;
                            } else if (name === "RAM" || name === "OPERATIV XOTIRA") {
                                icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7"/></svg>;
                            } else if (["SSD", "STORAGE", "XOTIRA"].includes(name)) {
                                icon = <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2zm8 4h5m-5 4h5"/></svg>;
                            }
                            return (
                                <SpecChip key={i} icon={icon} value={spec.value} label={spec.name} />
                            );
                        })}
                    </div>
                )}

                {/* Expand button (Only show if there are extra specs to display) */}
                {hasExtraSpecs && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="flex items-center justify-center gap-2 mt-2 text-surface-400 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest w-full py-1 border-t border-black/5 dark:border-white/5 pt-3 mb-2"
                    >
                        <span>{isExpanded ? "Yig'ish" : "Ko'proq ma'lumot"}</span>
                        <svg
                            className={`w-3.5 h-3.5 transition-transform duration-400 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                )}

                {/* Expandable Extra Details */}
                <AnimatePresence>
                    {isExpanded && hasExtraSpecs && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <div className="mt-2 pt-2 pb-4 border-t border-black/5 dark:border-white/5 space-y-2">
                                {nonFeaturedSpecs.map((spec, i) => (
                                    <div key={i} className="flex items-center gap-2 text-surface-500 dark:text-surface-400 text-xs font-bold">
                                        <span className="text-primary shrink-0">⚙️</span>
                                        <span>{spec.name}: {spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Price + Actions */}
                <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-black text-primary" suppressHydrationWarning>{price}</span>
                    </div>
                    <div className="flex gap-2">
                        <Link
                            href={`/prebuilts/${pc.id}`}
                            className="flex-1 text-center bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 text-foreground font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-colors"
                        >
                            Batafsil
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary hover:bg-primary-600 text-white font-black py-2.5 rounded-xl text-[10px] uppercase tracking-widest transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                        >
                            Savatga
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SpecChip({ icon, value, label }) {
    if (!value) return null;
    return (
        <div className="bg-surface-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-2.5 flex flex-col items-start gap-1 hover:border-primary/30 transition-all">
            <div className="flex items-center gap-1.5 w-full">
                <span className="text-primary shrink-0">{icon}</span>
                <span className="text-[11px] font-black text-surface-900 dark:text-white truncate leading-tight">{value}</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-surface-400">{label}</span>
        </div>
    );
}
