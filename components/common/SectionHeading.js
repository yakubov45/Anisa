"use client";

import { useTranslation } from "@/lib/LanguageContext";

export default function SectionHeading({ titleKey, badgeText }) {
    const { t } = useTranslation();
    
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-1 bg-primary rounded-full" />
            <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">
                {t(titleKey)}
            </h2>
        </div>
    );
}
