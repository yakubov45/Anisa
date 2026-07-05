"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function JoinOnePCBanner() {
    const { t, lang } = useTranslation();

    const content = {
        title: lang === 'uz' ? "MUKAMMALLIK CHO'QQISI" : 
               lang === 'ru' ? "ВЕРШИНА СОВЕРШЕНСТВА" : 
               "THE ZENITH OF PERFORMANCE",
        description: lang === 'uz' 
            ? "Asl kuch — tezlik va aniqlik uyg'unligidadir. Rivojlanish bir soniya ham to'xtamaydigan dunyoda sizning harakatingiz ham benuqson bo'lishi kerak. Biz texnologiya fidoiylari va geymerlar uchun chegaralarni buzib o'tuvchi, eng toza va kuchli uskunalarni taqdim etishga o'zimizni bag'ishlaganmiz."
            : lang === 'ru'
            ? "Истинное мастерство кроется в деталях. В мире, где скорость решает всё, настоящая мощь должна быть безупречной. Созданные для бескомпромиссного превосходства, мы предлагаем самые чистые и мощные технологии, которые выводят цифровой опыт на новый уровень для энтузиастов, не приемлющих ничего, кроме идеала."
            : "Brilliance lies in the details. In a world where speed is everything, true power must be seamless. Designed for uncompromising excellence, we curate pure, high-performance technology to elevate the digital experience for enthusiasts who accept nothing less than perfection."
    };

    return (
        <section className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 group my-12 md:my-20">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/shooter-game-background.jpg"
                    alt="OnePC Gaming Universe"
                    className="w-full h-full object-cover object-[center_30%] opacity-90 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 z-10" />
            </div>

            <div className="relative z-20 flex flex-col md:flex-row items-center min-h-[400px] md:min-h-[500px]">
                
                {/* Left Side: JOIN ONE PC Typography */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex items-center justify-center overflow-hidden">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="relative w-full max-w-lg flex flex-col items-center justify-center font-outfit"
                    >
                        {/* Container that groups text and line - ROTATED DIAGONALLY */}
                        <div className="relative z-10 flex flex-col w-full items-center transform -rotate-[15deg] md:-rotate-[18deg] scale-100 md:scale-105">
                            
                            {/* JOIN THE (Shifted left) */}
                            <div className="flex items-start justify-center w-full pr-12 md:pr-24 z-10 pb-1">
                                <span className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                                    JOIN
                                </span>
                                <span className="text-xl md:text-3xl font-black uppercase tracking-widest text-white leading-none ml-2 md:ml-3 mt-1.5 md:mt-2">
                                    THE
                                </span>
                            </div>

                            {/* The Red Laser Slash (Now horizontal relative to the rotated parent) */}
                            <div className="relative w-[130%] md:w-[150%] h-[3px] bg-red-500 shadow-[0_0_20px_5px_rgba(239,68,68,0.6)] z-20 pointer-events-none flex items-center justify-center">
                                <div className="absolute w-full h-[1px] bg-white opacity-90" />
                            </div>

                            {/* ONE PC (Shifted right) */}
                            <div className="flex items-center justify-center w-full pl-8 md:pl-16 z-10 pt-2 md:pt-3 text-left">
                                <div className="text-[4rem] md:text-[6.5rem] font-black uppercase tracking-tighter text-white leading-none">
                                    ONE PC
                                </div>
                            </div>
                            
                        </div>
                    </motion.div>
                </div>

                {/* Right Side: Text Content */}
                <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="max-w-xl"
                    >
                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight mb-4 md:mb-6 leading-tight">
                            {content.title}
                        </h3>
                        <p className="text-sm md:text-base text-white/70 leading-relaxed font-medium mb-8">
                            {content.description}
                        </p>
                        
                        <Link 
                            href="/products"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-colors group/btn rounded-xl"
                        >
                            <span>{lang === 'uz' ? 'XARID QILISH' : lang === 'ru' ? 'В КАТАЛОГ' : 'EXPLORE GEAR'}</span>
                            <svg className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </motion.div>
                </div>

            </div>
        </section>
    );
}
