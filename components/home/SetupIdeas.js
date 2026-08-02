"use client";

import Link from 'next/link';
import { useTranslation } from "@/lib/LanguageContext";
import { FEATURES } from "@/lib/features";


export default function SetupIdeas() {
    const { t } = useTranslation();

    const setups = [
        { 
            name: t('setup_gaming_name'), 
            price: 1250, 
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
            items: t('setup_gaming_items'), 
            badge: "ESPORTS READY"
        },
        { 
            name: t('setup_studio_name'), 
            price: 950, 
            image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80",
            items: t('setup_studio_items'), 
            badge: "CREATIVE PRO"
        },
        { 
            name: t('setup_streamer_name'), 
            price: 1800, 
            image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80",
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
                {setups.map((setup, idx) => {
                    const outerClip = "polygon(30px 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%, 0 30px)";
                    const innerClip = "polygon(29px 0, 100% 0, 100% calc(100% - 29px), calc(100% - 29px) 100%, 0 100%, 0 29px)";
                    
                    return (
                        <div 
                            key={setup.name} 
                            className="group relative flex flex-col h-full bg-white/5 transition-transform duration-700 hover:-translate-y-2 p-[1px]"
                            style={{ clipPath: outerClip }}
                        >
                            {/* Animated glowing gradient border */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 group-hover:from-primary group-hover:via-primary/50 group-hover:to-red-700 transition-all duration-700 opacity-50 group-hover:opacity-100 z-0" />
                            
                            {/* Inner dark container */}
                            <div 
                                className="relative z-10 bg-[#08080a] flex flex-col flex-grow h-full"
                                style={{ clipPath: innerClip }}
                            >
                                {/* Top Image Section */}
                                <div className="h-56 relative overflow-hidden flex-shrink-0">
                                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                    <img 
                                        src={setup.image} 
                                        alt={setup.name} 
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 opacity-60 group-hover:opacity-100" 
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent z-10" />
                                    
                                    {/* Price Tag */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div 
                                            className="bg-primary/90 backdrop-blur-sm text-white text-[11px] font-black px-4 py-2 uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                            style={{ clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)" }}
                                        >
                                            $ {setup.price}
                                        </div>
                                    </div>

                                    {/* Badge */}
                                    <div className="absolute bottom-4 left-6 z-20 bg-black/60 backdrop-blur-md border border-white/10 text-primary group-hover:text-white group-hover:bg-primary/20 text-[9px] font-black px-3 py-1.5 uppercase tracking-[0.3em] transition-colors duration-500">
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 bg-primary group-hover:bg-white rounded-full animate-pulse transition-colors" />
                                            {setup.badge}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-8 flex flex-col flex-grow relative z-20">
                                    {/* Cyber grid bg on hover */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                    
                                    <div className="space-y-4 flex-grow relative z-10">
                                        <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight leading-none group-hover:text-primary transition-colors duration-300">
                                            {setup.name}
                                        </h3>
                                        <p className="text-zinc-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                                            {setup.items}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    <div className="mt-8 relative z-10">
                                        <Link 
                                            href={FEATURES.PC_BUILDER ? "/pc-builder" : "/prebuilts"} 
                                            className="block w-full bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 text-white text-center py-4 font-black text-[10px] md:text-[11px] uppercase tracking-[0.3em] transition-all duration-300 relative overflow-hidden"
                                            style={{ clipPath: "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)" }}
                                        >
                                            <span className="relative z-10 group-hover:text-primary transition-colors duration-300">{t('acquire_setup')}</span>
                                            {/* Hover glare effect */}
                                            <div className="absolute top-0 -left-[100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-45 group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
