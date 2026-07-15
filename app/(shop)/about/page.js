"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { getStoresAction } from "@/lib/actions/store.actions";

export default function AboutPage() {
    const { t } = useTranslation();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStores = async () => {
            const res = await getStoresAction();
            if (res.success) {
                setStores(res.stores);
            }
            setLoading(false);
        };
        fetchStores();
    }, []);

    return (
        <div className="space-y-16 md:space-y-32 py-10 px-4 sm:px-0">
            {/* Hero Section */}
            <section className="relative h-[60vh] md:h-[70vh] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group mx-2 md:mx-0 bg-zinc-950 dark:bg-black">
                {/* Decorative background instead of video */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.15)_0%,transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] drop-shadow-2xl px-2"
                    >
                        {t('about_title')} <br /> <span className="text-primary drop-shadow-lg">OnePC</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-white/80 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.5em] max-w-xl leading-loose drop-shadow px-6"
                    >
                        {t('about_subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* History and Story Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-2 sm:px-6 items-center">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <span className="text-primary font-black uppercase text-xs tracking-widest block">EST. 2016</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                            {t('about_history_title')}
                        </h2>
                    </div>
                    <p className="text-foreground/70 text-base md:text-lg font-medium leading-relaxed italic border-l-4 border-primary/20 pl-6 md:pl-8">
                        {t('about_history_text')}
                    </p>
                </div>
                <div className="relative aspect-[4/3] rounded-[3rem] overflow-hidden shadow-premium">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        disablePictureInPicture
                        disableRemotePlayback
                        className="object-cover w-full h-full scale-105"
                    >
                        <source src="/videos/Youtube retroo.mp4" type="video/mp4" />
                    </video>
                    {/* Darkening overlay */}
                    <div className="absolute inset-0 bg-black/40 pointer-events-none transform-gpu" />
                    {/* Primary tint overlay */}
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
                </div>
            </section>

            {/* Quality and Why Choose Us Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 px-2 sm:px-6">

                {/* Card 1: Quality and Innovation */}
                <div className="relative group rounded-[3rem] overflow-hidden">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Base Glass Layer */}
                    <div className="absolute inset-0 bg-zinc-900/90 dark:bg-black/60 backdrop-blur-3xl rounded-[2.5rem]" />

                    {/* Content Container with Border */}
                    <div className="relative h-full flex flex-col justify-start bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 group-hover:border-primary/50 p-6 sm:p-10 md:p-16 rounded-[2.5rem] transition-all duration-500 overflow-hidden shadow-2xl">

                        {/* Glow effect behind icon */}
                        <div className="absolute -top-10 -left-10 w-64 h-64 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.4)_0%,transparent_70%)] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Icon */}
                        <div className="relative mb-10 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[1.5rem] border border-primary/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 shadow-lg shadow-primary/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-primary">
                                <path d="M6 3h12l4 6-10 13L2 9Z" />
                                <path d="M11 3 8 9l4 13 4-13-3-6" />
                                <path d="M2 9h20" />
                            </svg>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-primary/80 transition-colors duration-500">
                                {t('about_quality_title')}
                            </h3>
                            <p className="text-zinc-400 text-base md:text-lg font-medium leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                                {t('about_quality_text')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Why Choose Us */}
                <div className="relative group rounded-[3rem] overflow-hidden">
                    {/* Hover Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-bl from-indigo-500/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Base Glass Layer */}
                    <div className="absolute inset-0 bg-zinc-900/90 dark:bg-black/60 backdrop-blur-3xl rounded-[2.5rem]" />

                    {/* Content Container with Border */}
                    <div className="relative h-full flex flex-col justify-start bg-gradient-to-b from-white/[0.08] to-transparent border border-white/10 group-hover:border-indigo-500/50 p-6 sm:p-10 md:p-16 rounded-[2.5rem] transition-all duration-500 overflow-hidden shadow-2xl">

                        {/* Massive Animated Watermark */}
                        <div className="absolute -bottom-10 -right-10 text-[15rem] font-black leading-none text-white/[0.02] group-hover:text-indigo-500/[0.05] group-hover:scale-110 group-hover:-rotate-12 transition-all duration-1000 pointer-events-none select-none">
                            PC
                        </div>

                        {/* Glow effect behind icon */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.3)_0%,transparent_70%)] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                        {/* Icon */}
                        <div className="relative mb-10 w-20 h-20 bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 rounded-[1.5rem] border border-indigo-500/20 flex items-center justify-center group-hover:-translate-y-3 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-indigo-500/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-indigo-400 group-hover:rotate-12 transition-transform duration-500">
                                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                                <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                                <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                            </svg>
                        </div>

                        {/* Text Content */}
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 group-hover:to-indigo-400 transition-colors duration-500">
                                {t('about_why_title')}
                            </h3>
                            <p className="text-zinc-400 text-sm md:text-base font-medium leading-relaxed group-hover:text-zinc-200 transition-colors duration-500">
                                {t('about_why_text')}
                            </p>
                        </div>
                    </div>
                </div>

            </section>

            {/* Store Locations */}
            <section className="space-y-16">
                <div className="text-center space-y-4 px-6">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{t('about_hubs_title')}</h2>
                    <p className="text-foreground/50 font-black uppercase text-[10px] tracking-widest">{t('about_hubs_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 px-2 sm:px-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center animate-pulse">
                            <p className="text-foreground/20 font-black uppercase text-xs tracking-widest">Loading physical hubs...</p>
                        </div>
                    ) : stores.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-surface/40 rounded-[3rem] border border-dashed border-white/5 mx-6">
                            <p className="text-foreground/40 font-bold">No operational hubs detected in the network.</p>
                        </div>
                    ) : (
                        stores.map((store, idx) => (
                            <div key={idx} className="group relative bg-surface rounded-3xl md:rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row">
                                <div className="relative w-full md:w-1/2 h-64 sm:h-80 md:h-auto">
                                    <Image
                                        src={store.image}
                                        alt={store.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                    />
                                </div>
                                <div className="p-8 sm:p-12 md:w-1/2 space-y-6">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{store.city}</span>
                                        <h3 className="text-2xl font-black uppercase tracking-tight">{store.name}</h3>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex gap-4">
                                            <span className="text-lg opacity-40">📍</span>
                                            <p className="text-xs font-bold text-foreground/70 leading-relaxed">{store.address}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-lg opacity-40">📞</span>
                                            <p className="text-xs font-black text-surface-900 leading-relaxed">{store.phone}</p>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-lg opacity-40">🕒</span>
                                            <p className="text-xs font-bold text-foreground/70 leading-relaxed">{store.hours}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={store.yandexMapUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center mt-6 bg-surface-100 text-surface-900 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                                    >
                                        {t('about_view_map')}
                                    </a>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-zinc-900 text-white rounded-[2.5rem] md:rounded-[4rem] p-6 sm:p-12 md:p-24 space-y-8 md:space-y-12 relative overflow-hidden shadow-2xl mx-0.1 md:mx-6">
                <div className="absolute right-0 top-0 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.3)_0%,transparent_70%)] rounded-full -mr-48 -mt-48 pointer-events-none" />

                <div className="max-w-2xl space-y-6 relative">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">{t('about_contact_core')}</h2>
                    <p className="text-zinc-400 font-medium text-sm sm:text-base leading-loose">{t('about_contact_desc')}</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <input type="text" placeholder={t('about_form_name')} className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <input type="email" placeholder={t('about_form_email')} className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <textarea placeholder={t('about_form_details')} rows="4" className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <button className="md:col-span-1 bg-primary text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        {t('about_form_send')}
                    </button>
                </form>
            </section>
        </div>
    );
}
