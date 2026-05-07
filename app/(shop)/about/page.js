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
            <section className="relative h-[60vh] md:h-[70vh] rounded-3xl md:rounded-[4rem] overflow-hidden group mx-4 md:mx-0">
                <Image
                    src="/images/banner_02.png"
                    alt="OnePC Banner"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none"
                    >
                        {t('about_title')} <br /> <span className="text-primary">OnePC</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-foreground/70 font-bold uppercase text-[10px] tracking-[0.5em] max-w-xl leading-loose"
                    >
                        {t('about_subtitle')}
                    </motion.p>
                </div>
            </section>

            {/* History and Story Section */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 px-6 items-center">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <span className="text-primary font-black uppercase text-xs tracking-widest block">EST. 2016</span>
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight">
                            {t('about_history_title')}
                        </h2>
                    </div>
                    <p className="text-foreground/70 text-lg font-medium leading-relaxed italic border-l-4 border-primary/20 pl-8">
                        {t('about_history_text')}
                    </p>
                </div>
                <div className="relative aspect-square rounded-[3rem] overflow-hidden shadow-premium">
                    <Image 
                        src="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80"
                        alt="Workspace"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>
            </section>

            {/* Quality and Why Choose Us Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
                <div className="bg-surface/40 p-12 md:p-16 rounded-[3rem] border border-white/5 space-y-8 hover:border-primary/20 transition-all group">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💎</div>
                    <h3 className="text-3xl font-black uppercase tracking-tight">{t('about_quality_title')}</h3>
                    <p className="text-foreground/60 text-lg font-medium leading-relaxed">{t('about_quality_text')}</p>
                </div>
                <div className="bg-zinc-900 text-white p-12 md:p-16 rounded-[3rem] border border-white/5 space-y-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 text-9xl font-black pointer-events-none group-hover:scale-125 transition-transform">PC</div>
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">🚀</div>
                    <h3 className="text-3xl font-black uppercase tracking-tight relative z-10">{t('about_why_title')}</h3>
                    <p className="text-white/60 text-sm font-medium leading-relaxed relative z-10">{t('about_why_text')}</p>
                </div>
            </section>

            {/* Store Locations */}
            <section className="space-y-16">
                <div className="text-center space-y-4 px-6">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">{t('about_hubs_title')}</h2>
                    <p className="text-foreground/50 font-black uppercase text-[10px] tracking-widest">{t('about_hubs_subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 px-6">
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
                                <div className="relative w-full md:w-1/2 h-80 md:h-auto">
                                    <Image 
                                        src={store.image} 
                                        alt={store.name} 
                                        fill 
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                                    />
                                </div>
                                <div className="p-12 md:w-1/2 space-y-6">
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
            <section className="bg-zinc-900 text-white rounded-3xl md:rounded-[4rem] p-8 md:p-24 space-y-8 md:space-y-12 relative overflow-hidden shadow-2xl mx-6">
                <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                
                <div className="max-w-2xl space-y-6 relative">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">{t('about_contact_core')}</h2>
                    <p className="text-zinc-400 font-medium leading-loose">{t('about_contact_desc')}</p>
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
