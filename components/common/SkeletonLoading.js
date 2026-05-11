"use client";

import { useTranslation } from "@/lib/LanguageContext";

export default function SkeletonLoading({ text }) {
    const { t } = useTranslation();

    return (
        <div className="w-full flex flex-col gap-6 animate-pulse p-4">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between mb-4">
                <div className="w-1/3 h-8 bg-surface-100 dark:bg-white/5 rounded-2xl" />
                <div className="w-24 h-8 bg-surface-100 dark:bg-white/5 rounded-2xl" />
            </div>

            {/* List Items Skeleton */}
            {[1, 2, 3].map((item) => (
                <div key={item} className="w-full bg-surface-50 dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-surface-200 dark:border-white/5 flex flex-col md:flex-row gap-6">
                    <div className="w-24 h-24 bg-surface-200 dark:bg-white/10 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-4">
                        <div className="w-3/4 h-6 bg-surface-200 dark:bg-white/10 rounded-xl" />
                        <div className="w-1/2 h-4 bg-surface-200 dark:bg-white/10 rounded-xl" />
                        <div className="flex gap-2 pt-2">
                            <div className="w-16 h-6 bg-surface-200 dark:bg-white/10 rounded-xl" />
                            <div className="w-16 h-6 bg-surface-200 dark:bg-white/10 rounded-xl" />
                        </div>
                    </div>
                </div>
            ))}
            
            <div className="text-center pt-4">
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">
                    {text || "Loading Database Core..."}
                </p>
            </div>
        </div>
    );
}
