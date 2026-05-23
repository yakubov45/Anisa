"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";
import { faqData } from "@/lib/faqDataNew";

export default function FAQPage() {
    const { lang, t } = useTranslation();
    const currentFaqData = faqData[lang] || faqData["en"];
    
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [openItems, setOpenItems] = useState({});

    useEffect(() => {
        if (currentFaqData.length > 0) {
            setActiveCategory(currentFaqData[0].category);
        }
    }, [lang]);

    const toggleItem = (category, index) => {
        const key = `${category}-${index}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredData = currentFaqData.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    const getIcon = (category) => {
        const cat = category.toLowerCase();
        if (cat.includes("technical") || cat.includes("texnik")) return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
        if (cat.includes("compatibility") || cat.includes("moslik")) return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
        if (cat.includes("build") || cat.includes("yig'ish") || cat.includes("сборка")) return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
        if (cat.includes("logistics") || cat.includes("yetkazib") || cat.includes("доставка")) return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4" /></svg>;
        return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 pt-4 pb-12 md:pt-6 md:pb-20 space-y-8 md:space-y-16 animate-fade-in">
            {/* HERO */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic">
                    {lang === 'uz' ? 'Qanday yordam bera' : lang === 'ru' ? 'Как мы можем' : 'How can we'} <span className="text-primary">{lang === 'uz' ? 'olamiz?' : lang === 'ru' ? 'помочь?' : 'help?'}</span>
                </h1>
                <p className="text-surface-500 font-bold uppercase text-xs tracking-[0.3em]">{t('faq_subtitle') || 'Knowledge Base & Technical Protocol'}</p>
            </div>

            {/* SEARCH */}
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all" />
                <div className="relative bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 rounded-2xl p-2 flex items-center">
                    <span className="pl-6 text-surface-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </span>
                    <input
                        type="text"
                        placeholder={t('faq_search_placeholder') || "Search for protocols..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none px-4 py-4 text-sm font-bold text-foreground placeholder:text-surface-400 placeholder:uppercase"
                    />
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
                {/* SIDEBAR: CATEGORIES */}
                <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-32">
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-4">{t('faq_categories') || 'Categories'}</p>
                    <div className="space-y-1">
                        {currentFaqData.map((cat) => (
                            <button
                                key={cat.category}
                                onClick={() => {
                                    setActiveCategory(cat.category);
                                    setSearchQuery("");
                                }}
                                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center gap-4 ${activeCategory === cat.category ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-white/5'}`}
                            >
                                <span className={activeCategory === cat.category ? "text-white" : "text-primary"}>
                                    {getIcon(cat.category)}
                                </span>
                                {cat.category}
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 bg-zinc-900 text-white p-8 rounded-[2rem] space-y-4 border border-white/5">
                        <h4 className="text-sm font-black uppercase tracking-widest">{t('faq_still_curious') || 'Still curious?'}</h4>
                        <p className="text-xs text-white/60 font-medium">{t('faq_still_curious_desc') || "If you can't find your answer, our tech command center is standing by."}</p>
                        <Link href="https://t.me/onepc_support" target="_blank" className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block hover:bg-primary-600 transition-all">
                            {t('faq_talk_support') || 'Talk to Tech Support'}
                        </Link>
                    </div>
                </div>

                {/* ACCORDIONS */}
                <div className="lg:col-span-8 space-y-8">
                    {filteredData.map((cat) => (
                        (searchQuery || activeCategory === cat.category) && (
                            <div key={cat.category} className="space-y-4 animate-slide-up">
                                <div className="flex items-center gap-4 border-l-4 border-primary pl-6 mb-6">
                                    <span className="text-primary">{getIcon(cat.category)}</span>
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">{cat.category}</h2>
                                </div>

                                <div className="space-y-3">
                                    {cat.items.map((item, idx) => {
                                        const isOpen = openItems[`${cat.category}-${idx}`];
                                        return (
                                            <div
                                                key={idx}
                                                className={`bg-white dark:bg-zinc-900 border transition-all rounded-3xl overflow-hidden ${isOpen ? 'border-primary shadow-lg' : 'border-surface-200 dark:border-white/5 hover:border-surface-300'}`}
                                            >
                                                <button
                                                    onClick={() => toggleItem(cat.category, idx)}
                                                    className="w-full text-left p-6 md:p-8 flex justify-between items-center gap-6 group"
                                                >
                                                    <span className="text-sm md:text-base font-black text-foreground uppercase tracking-tight leading-snug transition-all group-hover:text-primary group-hover:translate-x-1">
                                                        {item.q}
                                                    </span>
                                                    <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-primary text-white rotate-180' : 'bg-surface-50 dark:bg-white/5 text-surface-400 group-hover:bg-primary group-hover:text-white'}`}>
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                                    </span>
                                                </button>
                                                <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100 pb-8' : 'grid-rows-[0fr] opacity-0'}`}>
                                                    <div className="overflow-hidden">
                                                        <div className="px-8">
                                                            <div className="h-px bg-surface-100 dark:bg-white/5 mb-6" />
                                                            <p className="text-surface-600 dark:text-surface-400 font-medium leading-relaxed">
                                                                {item.a}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-20 space-y-4 opacity-50">
                            <div className="flex justify-center text-primary">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest">{t('faq_no_results') || 'No matching protocols found'}</h3>
                            <p className="text-xs font-bold uppercase text-surface-500">{t('faq_no_results_desc') || 'Try adjusting your search criteria'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
