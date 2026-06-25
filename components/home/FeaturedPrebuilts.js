"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function FeaturedPrebuilts({ prebuilts }) {
    const { t, lang: language } = useTranslation();
    const [isExpanded, setIsExpanded] = useState(false);
    const [expandedCardId, setExpandedCardId] = useState(null);
    if (!prebuilts || prebuilts.length === 0) return null;

    const visiblePrebuilts = prebuilts.slice(0, 4);
    const hiddenPrebuilts = prebuilts.slice(4);

    return (
        <section className="my-12 relative transition-all duration-500 text-surface-900 dark:text-white">
            {/* Hero / Header Part */}
            <div className="relative pb-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl z-10">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-surface-900 to-surface-500 dark:from-white dark:to-surface-400">
                        OnePC Extreme Prebuilts
                    </h2>
                    <p className="text-surface-500 dark:text-surface-400 text-lg md:text-xl font-medium mb-8">
                        {language === 'ru' ? 'Готовые компьютеры премиум-класса, собранные профессионалами для максимальной производительности.' : language === 'en' ? 'Premium prebuilt computers assembled by professionals for maximum performance.' : "Professionallar tomonidan yig'ilgan, maksimal unumdorlik va mukammal dizaynga ega tayyor kompyuterlar."}
                    </p>
                    <Link href="/prebuilts" className="inline-block bg-primary hover:bg-primary-600 text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-xl shadow-primary/20">
                        {language === 'ru' ? 'Посмотреть все компьютеры' : language === 'en' ? 'View all computers' : "Barcha kompyuterlarni ko'rish"}
                    </Link>
                </div>
                <div className="absolute right-0 top-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-surface-50/0 dark:from-primary/20 dark:via-[#0A0A0B]/0 to-transparent blur-3xl pointer-events-none"></div>
            </div>

            {/* Grid Part */}
            <div>
                <div>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                        {visiblePrebuilts.map((pc, index) => (
                            <PrebuiltCard 
                                key={pc.id} 
                                pc={pc}
                                index={index}
                                t={t}
                                language={language}
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
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pt-6 items-start">
                                    {hiddenPrebuilts.map((pc, index) => (
                                        <PrebuiltCard 
                                            key={pc.id} 
                                            pc={pc}
                                            index={index + 3}
                                            t={t}
                                            language={language}
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
                            <span className="text-xs font-black uppercase tracking-widest">
                                {isExpanded ? (language === 'ru' ? 'Скрыть' : language === 'en' ? 'Hide' : 'Yashirish') : t("btn_view_more")}
                            </span>
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

function PrebuiltCard({ pc, index = 0, t, language }) {
    const { addToCart, currency, exchangeRate, compareList, toggleCompare } = useStore();
    const images = pc.images?.length > 0 ? pc.images : ['https://via.placeholder.com/400x300?text=No+Image'];
    const hasSecondImage = images.length > 1;
    const inCompare = compareList?.some(item => item.id === pc.id);

    const handleAddToCart = () => {
        addToCart({
            id: pc.id,
            name: pc.name,
            price: pc.price,
            image: images[0],
            category: 'prebuilt',
            quantity: 1
        });
        toast.success(language === 'ru' ? `${pc.name} добавлен в корзину!` : language === 'en' ? `${pc.name} added to cart!` : `${pc.name} savatchaga qo'shildi!`);
    };

    const price = formatPrice(pc.price, currency || 'UZS', exchangeRate);

    // Get specifications (fallback to quick_specs if specifications array not present)
    const specifications = pc.specifications || [];
    
    const getSpecValue = (nameUpper) => {
        const found = specifications.find(s => s.name.toUpperCase() === nameUpper);
        if (found) return found.value;
        if (nameUpper === "CPU") return pc.quick_specs?.cpu;
        if (nameUpper === "GPU") return pc.quick_specs?.gpu;
        if (nameUpper === "RAM") return pc.quick_specs?.ram;
        if (nameUpper === "SSD") return pc.quick_specs?.storage || pc.quick_specs?.ssd;
        return "";
    };

    const cpuVal = getSpecValue("CPU") || "N/A";
    const gpuVal = getSpecValue("GPU") || "N/A";
    const ramVal = getSpecValue("RAM") || "N/A";
    const ssdVal = getSpecValue("SSD") || "N/A";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
            className="bg-white dark:bg-[#0c0c0e] rounded-3xl border border-black/[0.06] dark:border-white/10 p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 group hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/20 w-full items-stretch relative overflow-hidden"
        >
            {/* Background glowing gradient blob on hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0"></div>
            {/* Left Side: PC Image */}
            <div className="relative w-full md:w-[45%] lg:w-[48%] bg-surface-50/50 dark:bg-black/30 rounded-2xl overflow-hidden flex items-center justify-center p-6 min-h-[200px] md:min-h-[260px] shrink-0">
                {pc.badges && (
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[70%]">
                        {(Array.isArray(pc.badges) ? pc.badges : [pc.badges]).map((b, i) => {
                            let transB = b;
                            if(b.toLowerCase() === 'best value') transB = t("badge_best_value") || 'Best Value';
                            if(b.toLowerCase() === 'hot') transB = t("badge_hot") || 'Hot';
                            if(b.toLowerCase() === 'new' || b.toLowerCase() === 'yangi') transB = t("filter_new") || 'New';
                            return (
                            <span key={i} className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-md border border-white/5 shrink-0">
                                {transB}
                            </span>
                        )})}
                    </div>
                )}
                
                {/* Compare Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleCompare(pc);
                        if (!inCompare) toast.success(language === 'ru' ? 'Добавлено к сравнению!' : language === 'en' ? 'Added to compare!' : "Taqqoslashga qo'shildi!");
                    }}
                    className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${inCompare ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-white dark:bg-zinc-800 text-foreground hover:bg-blue-500 hover:text-white'}`}
                    title="Taqqoslash"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                </button>
                
                <img
                    src={images[0]}
                    alt={pc.name}
                    className={`max-h-[85%] max-w-full object-contain transition-all duration-700 ease-out z-10 relative ${hasSecondImage ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'}`}
                />
                {hasSecondImage && (
                    <img
                        src={images[1]}
                        alt={`${pc.name} alternate view`}
                        className="absolute max-h-[85%] max-w-full object-contain transition-all duration-700 ease-out opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 z-0"
                    />
                )}
            </div>

            {/* Right Side: PC Details */}
            <div className="flex-1 flex flex-col justify-between py-2 min-w-0 gap-4">
                
                {/* Header & Title */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {pc.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-black text-foreground tracking-tight">{price}</span>
                    </div>
                </div>

                {/* Specs block (Chips) */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {gpuVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/gpu-removebg-preview.png" alt="GPU" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{gpuVal}</span>
                            </span>
                        )}
                        {cpuVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/cpu-removebg-preview.png" alt="CPU" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{cpuVal}</span>
                            </span>
                        )}
                        {ramVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/ram-removebg-preview.png" alt="RAM" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{ramVal}</span>
                            </span>
                        )}
                        {ssdVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/ssd-removebg-preview.png" alt="SSD" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{ssdVal}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Bottom Bar */}
                <div className="flex items-center gap-3 mt-auto pt-4">
                    <Link
                        href={`/prebuilts/${pc.id}`}
                        className="flex-1 bg-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-foreground text-center py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border border-surface-200 dark:border-white/10"
                    >
                        {language === 'ru' ? 'Подробнее' : language === 'en' ? 'Details' : 'Batafsil'}
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/10 hover:shadow-primary/25 text-center py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border border-transparent"
                    >
                        {language === 'ru' ? 'В корзину' : language === 'en' ? 'To Cart' : 'Savatga'}
                    </button>
                </div>

            </div>

        </motion.div>
    );
}
