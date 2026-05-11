"use client";

import Link from 'next/link';
import { useTranslation } from "@/lib/LanguageContext";

export default function SetupIdeas() {
    const { t } = useTranslation();

    const setups = [
        { 
            name: t('setup_gaming_name'), 
            price: 1250, 
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
            items: t('setup_gaming_items'), 
            badge: "ESPORTS READY"
        },
        { 
            name: t('setup_studio_name'), 
            price: 950, 
            image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
            items: t('setup_studio_items'), 
            badge: "CREATIVE PRO"
        },
        { 
            name: t('setup_streamer_name'), 
            price: 1800, 
            image: "https://images.unsplash.com/photo-1614018424563-29f1bb346b94?w=800&q=80",
            items: t('setup_streamer_items'), 
            badge: "CREATOR ELITE"
        },
    ];

    return (
        <section className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">{t('setup_ideas_title')}</h2>
                </div>
                <Link href="/pc-builder" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">{t('setup_custom_build')}</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {setups.map((setup) => (
                    <div key={setup.name} className="group bg-surface border border-border-alpha rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 flex flex-col h-full">
                        <div className="h-64 relative overflow-hidden flex-shrink-0">
                            <img 
                                src={setup.image} 
                                alt={setup.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                            <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl">
                                $ {setup.price}
                            </div>
                            <div className="absolute bottom-6 left-8 bg-foreground/5 backdrop-blur-md border border-border-alpha text-foreground text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.3em]">
                                {setup.badge}
                            </div>
                        </div>
                        <div className="p-10 flex flex-col flex-grow space-y-8">
                            <div className="space-y-3 flex-grow">
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight leading-tight">{setup.name}</h3>
                                <p className="text-surface-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">{setup.items}</p>
                            </div>
                            <div className="flex mt-auto">
                                <Link href="/pc-builder" className="flex-1 bg-primary text-white text-center py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-xl shadow-primary/20">
                                    {t('acquire_setup')}
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
