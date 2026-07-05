"use client";

import { useTranslation } from "@/lib/LanguageContext";
import { motion } from "framer-motion";

export default function TrustSection() {
    const { t } = useTranslation();

    const features = [
        { 
            title: t('feature_1_title'), 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, 
            desc: t('feature_1_desc')
        },
        { 
            title: t('feature_secure_title'), 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, 
            desc: t('feature_secure_desc') 
        },
        { 
            title: t('feature_2_title'), 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>, 
            desc: t('feature_2_desc') 
        },
        { 
            title: t('feature_3_title'), 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4" /></svg>, 
            desc: t('feature_3_desc') 
        },
    ];

    const chamferPolygon = "polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)";

    return (
        <section className="relative overflow-hidden py-10 md:py-16">
            
            {/* Background Accent */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-16 gap-6">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-4 w-full justify-center md:justify-start"
                    >
                        {/* High-tech Title Accent */}
                        <div className="w-1.5 h-8 bg-primary shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
                            {t('features_title')}
                        </h2>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4 sm:px-0">
                    {features.map((f, idx) => (
                        <motion.div 
                            key={idx} 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                            viewport={{ once: true, margin: "-20px" }}
                            transition={{ duration: 0.4, delay: idx * 0.1, ease: "easeOut" }}
                            className="group relative h-full p-[1px]"
                            style={{ clipPath: chamferPolygon }}
                        >
                            {/* Glowing Gradient Border Container */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent group-hover:from-primary group-hover:via-red-500/50 group-hover:to-transparent transition-all duration-500"
                            />
                            
                            {/* Inner Dark Card */}
                            <div 
                                className="relative z-10 h-full w-full bg-[#0c0c0e] group-hover:bg-[#100a0a] transition-colors duration-500 p-6 md:p-8 flex flex-col justify-start gap-4 md:gap-6"
                                style={{ clipPath: chamferPolygon }}
                            >
                                {/* Grid scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ef44440a_1px,transparent_1px),linear-gradient(to_bottom,#ef44440a_1px,transparent_1px)] bg-[size:10px_10px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                
                                <div className="w-14 h-14 md:w-16 md:h-16 relative z-10 flex items-center justify-center">
                                    {/* Abstract background shape for icon */}
                                    <div className="absolute inset-0 bg-white/5 group-hover:bg-primary/20 rotate-45 group-hover:rotate-90 transition-all duration-500" />
                                    
                                    <div className="text-white/50 group-hover:text-primary group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] transition-all duration-300 relative z-20">
                                        {f.icon}
                                    </div>
                                </div>
                                
                                <div className="relative z-10 mt-auto">
                                    <h3 className="font-black text-white uppercase tracking-wider text-sm md:text-base group-hover:text-primary transition-colors mb-2">
                                        {f.title}
                                    </h3>
                                    <p className="text-white/40 group-hover:text-white/70 text-[10px] md:text-xs font-bold leading-relaxed transition-colors">
                                        {f.desc}
                                    </p>
                                </div>

                                {/* Cyberpunk decorative corner line */}
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-transparent group-hover:border-primary opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
