"use client";

import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import PriceDisplay from "@/components/common/PriceDisplay";
import { motion } from "framer-motion";
import { useState } from "react";
import { translateSpec } from "@/lib/utils/translateSpec";
import { getSpecExplanation } from "@/lib/utils/specExplanations";

export default function ComparePage() {
    const { compareList, removeFromCompare } = useStore();
    const { t, lang } = useTranslation();
    const [activeModal, setActiveModal] = useState(null); // trigger recompile

    if (!compareList || compareList.length === 0) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center animate-fade-in text-center px-4">
                <div className="w-20 h-20 bg-surface-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 text-surface-400">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <h1 className="text-2xl font-black uppercase tracking-widest text-foreground mb-4">
                    {lang === 'uz' ? "Taqqoslanadigan kompyuterlar yo'q" : lang === 'ru' ? "Нет ПК для сравнения" : "No PCs to compare"}
                </h1>
                <Link href="/prebuilts" className="btn-premium btn-premium-white px-8 py-4 rounded-xl text-[10px] uppercase font-black tracking-widest">
                    {lang === 'uz' ? "Do'konga qaytish" : lang === 'ru' ? "Вернуться в магазин" : "Back to shop"}
                </Link>
            </div>
        );
    }

    // Recommendation Logic based on price (simple heuristic: more expensive = more powerful)
    // Find min, max, and middle prices
    const sortedByPrice = [...compareList].sort((a, b) => a.price - b.price);
    const budgetPcId = sortedByPrice[0].id; // Cheapest
    const premiumPcId = sortedByPrice[sortedByPrice.length - 1].id; // Most Expensive

    // If there are 3 or more PCs, the middle one(s) are best value
    const isMiddlePc = (id) => {
        if (compareList.length < 3) return false;
        if (id === budgetPcId || id === premiumPcId) return false;
        return true;
    };

    const getRecommendationBadge = (id) => {
        if (compareList.length === 1) return null;
        if (id === premiumPcId) return { text: lang === 'uz' ? '👑 Eng Kuchli' : lang === 'ru' ? '👑 Самый мощный' : '👑 Most Powerful', color: 'bg-purple-500 text-white' };
        if (id === budgetPcId) return { text: lang === 'uz' ? '💰 Hamyonbop' : lang === 'ru' ? '💰 Бюджетный' : '💰 Budget Choice', color: 'bg-green-500 text-white' };
        if (isMiddlePc(id)) return { text: lang === 'uz' ? "⚖️ Oltin O'rtalik" : lang === 'ru' ? '⚖️ Золотая середина' : '⚖️ Best Value', color: 'bg-blue-500 text-white' };
        return null;
    };

    // Admin nima kiritgan bo'lsa barchasini dinamik ravishda yig'ish
    const allSpecsMap = new Map();

    compareList.forEach(product => {
        if (product.specifications && product.specifications.length > 0) {
            product.specifications.forEach((spec, idx) => {
                if (!spec.name || !spec.value) return;
                // Bir xil nomlarni birlashtirish (katta-kichik harf farq qilmasligi uchun)
                const key = spec.name.trim().toUpperCase();
                if (!allSpecsMap.has(key)) {
                    allSpecsMap.set(key, {
                        key: key,
                        originalName: spec.name,
                        index: idx // Asl ketma-ketlikni saqlash uchun
                    });
                }
            });
        }
    });

    const dynamicSpecKeys = Array.from(allSpecsMap.values()).sort((a, b) => a.index - b.index);

    // Agar eski tizimdagi ma'lumotlar bo'lsa (faqat quick_specs bor bo'lsa)
    if (dynamicSpecKeys.length === 0) {
        dynamicSpecKeys.push(
            { key: 'CPU', originalName: lang === 'uz' ? 'Protsessor' : 'CPU' },
            { key: 'GPU', originalName: lang === 'uz' ? 'Videokarta' : 'GPU' },
            { key: 'RAM', originalName: lang === 'uz' ? 'Tezkor xotira' : 'RAM' },
            { key: 'STORAGE', originalName: lang === 'uz' ? 'Xotira' : 'Storage' }
        );
    }

    const openModal = (spec) => setActiveModal(spec);
    const closeModal = () => setActiveModal(null);

    const getSpecValue = (product, specKeyObj) => {
        // 1. Asosiy: specifications array dan izlash
        if (product.specifications) {
            const found = product.specifications.find(s => s.name?.trim().toUpperCase() === specKeyObj.key);
            if (found) return found.value;
        }

        // 2. Fallback: quick_specs dan izlash
        if (product.quick_specs) {
            const qk = specKeyObj.key.toLowerCase();
            if (product.quick_specs[qk]) return product.quick_specs[qk];
            if (qk === 'storage' && product.quick_specs.ssd) return product.quick_specs.ssd;
            if (qk === 'storage' && product.quick_specs.storage) return product.quick_specs.storage;
        }

        // 3. Fallback: to'g'ridan to'g'ri izlash
        const qk2 = specKeyObj.key.toLowerCase();
        if (product[qk2]) return product[qk2];

        return null;
    };

    return (
        <div className="animate-fade-in max-w-[1400px] mx-auto pb-20">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-foreground mb-4 text-center">
                {lang === 'uz' ? "Taqqoslash" : lang === 'ru' ? "Сравнение" : "Compare"}
            </h1>
            <p className="text-center text-surface-500 mb-10 font-medium">
                {lang === 'uz' ? "Qaysi tizim sizga mosligini tanlashda yordam beramiz" : "Поможем выбрать подходящую вам систему"}
            </p>

            <div className="pb-8 w-full">
                <div className="w-full">
                    {/* Header Row (Images & Basic Info) */}
                    <div className="flex w-full">
                        {/* Empty Top-Left Cell */}
                        <div className="w-24 md:w-32 lg:w-48 shrink-0 bg-transparent p-2 md:p-3" />
                        
                        {/* Products */}
                        {compareList.map((product) => {
                            const badge = getRecommendationBadge(product.id);
                            return (
                                <div key={product.id} className="flex-1 min-w-0 p-2 md:p-3 lg:p-4 border-l border-surface-200 dark:border-white/10 flex flex-col relative group">
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute top-6 right-6 w-8 h-8 bg-surface-100 dark:bg-zinc-800 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition-colors z-20"
                                    >
                                        ✕
                                    </button>

                                    {/* Recommendation Badge */}
                                    <div className="h-8 mb-2 flex items-end justify-center w-full">
                                        {badge && (
                                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-xl ${badge.color}`}>
                                                {badge.text}
                                            </span>
                                        )}
                                    </div>

                                    <div className="aspect-square w-full max-w-[160px] md:max-w-[200px] mx-auto rounded-2xl overflow-hidden bg-surface-50 mb-4 border border-surface-200 dark:border-white/5 relative">
                                        <ImageWithFallback src={product.image || product.images?.[0]} fallbackSrc="/placeholder.png" alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-4" />
                                    </div>
                                    <h3 className="font-extrabold text-sm md:text-base uppercase tracking-tight text-foreground line-clamp-2 mb-2">{product.name}</h3>
                                    <PriceDisplay price={product.price} className="font-black text-primary text-xl" />
                                </div>
                            )
                        })}
                    </div>

                    {/* Specs Rows */}
                    <div className="mt-6 border border-surface-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50 backdrop-blur-xl w-full">
                        {dynamicSpecKeys.map((spec, index) => (
                            <div key={spec.key} className={`flex w-full ${index !== dynamicSpecKeys.length - 1 ? 'border-b border-surface-200 dark:border-white/5' : ''}`}>
                                {/* Spec Label */}
                                <div className="w-24 md:w-32 lg:w-48 shrink-0 p-3 md:p-4 bg-surface-50 dark:bg-black/20 flex flex-col justify-center items-start">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-surface-500 break-words w-full">
                                        {translateSpec(spec.originalName, lang)}
                                    </span>
                                    <button 
                                        onClick={() => openModal(spec)}
                                        className="text-[9px] md:text-[10px] text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold uppercase tracking-wider mt-1 hover:underline transition-colors text-left flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {lang === 'uz' ? "Nega kerak?" : lang === 'ru' ? "Зачем это?" : "Why needed?"}
                                    </button>
                                </div>

                                {/* Spec Values */}
                                {compareList.map((product) => {
                                    const value = getSpecValue(product, spec);
                                    return (
                                        <div key={product.id} className="flex-1 min-w-0 p-3 md:p-4 border-l border-surface-200 dark:border-white/5 flex items-center">
                                            <span className={`text-[10px] md:text-xs font-bold break-words w-full ${value ? 'text-foreground' : 'text-surface-400 italic'}`}>
                                                {value ? translateSpec(value, lang) : '-'}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Explanation Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
                    <div 
                        className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={closeModal}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 transition-colors text-foreground"
                        >
                            ✕
                        </button>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-3">
                            {translateSpec(activeModal.originalName, lang)}
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-300 font-medium leading-relaxed">
                            {getSpecExplanation(activeModal.originalName)[lang] || getSpecExplanation(activeModal.originalName)['en']}
                        </p>
                        <button 
                            onClick={closeModal}
                            className="w-full mt-6 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-foreground font-black uppercase tracking-wider text-xs py-3 rounded-xl transition-colors"
                        >
                            {lang === 'uz' ? "Tushunarli" : lang === 'ru' ? "Понятно" : "Got it"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
