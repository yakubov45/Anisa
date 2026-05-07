"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/LanguageContext";

export default function LegalPage() {
    const { t } = useTranslation();
    const [active, setActive] = useState("privacy");

    const LEGAL_DATA = [
        {
            id: "privacy",
            title: t('legal_privacy_title'),
            content: t('legal_privacy_content')
        },
        {
            id: "terms",
            title: t('legal_terms_title'),
            content: t('legal_terms_content')
        },
        {
            id: "registry",
            title: t('legal_registry_title'),
            content: t('legal_registry_content')
        },
        {
            id: "security",
            title: t('legal_security_title'),
            content: t('legal_security_content')
        }
    ];

    const activeItem = LEGAL_DATA.find(i => i.id === active) || LEGAL_DATA[0];

    return (
        <div className="py-20 max-w-4xl mx-auto px-6 space-y-16">
            <div className="space-y-4">
                <h1 className="text-5xl font-black uppercase tracking-tighter">
                    {t('legal_title').split(' ')[0]} <span className="text-primary">{t('legal_title').split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-surface-500 dark:text-surface-400 font-black uppercase text-[10px] tracking-widest">{t('legal_subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {LEGAL_DATA.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`p-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-left border transition-all ${active === item.id 
                            ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" 
                            : "bg-white dark:bg-white/5 border-black/5 dark:border-white/5 text-foreground/40 hover:border-black/10 dark:hover:border-white/10"
                            }`}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            <div className="bg-white dark:bg-white/5 p-12 md:p-20 rounded-[3rem] border border-black/5 dark:border-white/5 min-h-[400px] animate-fade-in shadow-sm dark:shadow-none">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{activeItem.title}</h2>
                <div className="space-y-6">
                    {activeItem.content.split('\n').map((line, idx) => (
                        <p key={idx} className="text-foreground/70 font-medium leading-loose">
                            {line.trim()}
                        </p>
                    ))}
                </div>
            </div>

            <div className="pt-10 border-t border-black/5 dark:border-white/5 text-center">
                <p className="text-[10px] font-black text-foreground/30 uppercase tracking-widest">{t('legal_last_updated')}</p>
            </div>
        </div>
    );
}
