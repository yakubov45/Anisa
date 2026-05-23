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

    return (
        <section className="bg-surface-50 border border-white/5 rounded-3xl md:rounded-[3rem] p-8 md:p-20 overflow-hidden">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                className="text-xl md:text-4xl font-black text-center mb-10 md:mb-16 uppercase tracking-tight"
            >
                {t('features_title')}
            </motion.h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12">
                {features.map((f, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, scale: 0.92, y: 15 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true, margin: "-30px" }}
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.35, delay: idx * 0.05, ease: "easeOut" }}
                        className="flex flex-col items-center text-center gap-3 md:gap-4 group hover:bg-surface-100 dark:hover:bg-white/5 p-4 md:p-6 rounded-2xl md:rounded-[2rem] transition-all hover:shadow-2xl hover:shadow-primary/10 border border-transparent hover:border-black/5 dark:hover:border-white/5"
                    >
                        <div className="w-14 h-14 md:w-20 md:h-20 bg-surface-100 dark:bg-white/5 rounded-2xl md:rounded-3xl flex items-center justify-center text-primary shadow-inner group-hover:bg-primary group-hover:text-white group-hover:scale-110 transition-all duration-300">
                            {f.icon}
                        </div>
                        <h3 className="font-black text-foreground uppercase tracking-tight text-sm md:text-lg group-hover:text-primary transition-colors">{f.title}</h3>
                        <p className="text-surface-600 dark:text-surface-400 text-[10px] md:text-xs font-bold leading-relaxed max-w-[120px] md:max-w-[150px]">{f.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
