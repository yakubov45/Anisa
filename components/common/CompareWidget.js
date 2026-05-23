"use client";

import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ImageWithFallback from "@/components/common/ImageWithFallback";

export default function CompareWidget() {
    const { compareList, removeFromCompare, clearCompare } = useStore();
    const { t, lang } = useTranslation();

    if (!compareList || compareList.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none"
            >
                <div className="max-w-5xl mx-auto bg-surface-100/90 dark:bg-black/90 backdrop-blur-xl border border-surface-200 dark:border-white/10 rounded-2xl p-4 shadow-2xl pointer-events-auto flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 flex gap-2 md:gap-4 overflow-x-auto no-scrollbar w-full py-2 px-2 items-center">
                        {compareList.map((product) => (
                            <div key={product.id} className="relative bg-white dark:bg-zinc-900 rounded-lg p-1.5 flex items-center gap-2 w-[150px] shrink-0 border border-surface-200 dark:border-white/5 shadow-sm">
                                <button
                                    onClick={() => removeFromCompare(product.id)}
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-sm hover:bg-red-600 z-10 transition-transform hover:scale-110"
                                >
                                    ✕
                                </button>
                                <div className="w-6 h-6 rounded bg-surface-50 dark:bg-white/5 overflow-hidden shrink-0 flex items-center justify-center">
                                    <ImageWithFallback src={product.image || product.images?.[0]} fallbackSrc="/placeholder.png" alt={product.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal p-0.5" />
                                </div>
                                <div className="flex-1 min-w-0 pr-1">
                                    <h4 className="text-[9px] md:text-[10px] font-bold uppercase text-foreground truncate">{product.name}</h4>
                                </div>
                            </div>
                        ))}

                        {/* Empty slots placeholders */}
                        {[...Array(Math.max(0, 4 - compareList.length))].map((_, i) => (
                            <div key={`empty-${i}`} className="hidden md:flex border border-dashed border-surface-300 dark:border-white/10 rounded-lg p-1.5 items-center gap-2 w-[150px] shrink-0 opacity-40">
                                <div className="w-6 h-6 rounded bg-surface-200 dark:bg-white/5 shrink-0" />
                                <div className="h-1.5 w-16 bg-surface-200 dark:bg-white/5 rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto shrink-0 border-t md:border-t-0 md:border-l border-surface-200 dark:border-white/10 pt-3 md:pt-0 md:pl-4">
                        <button onClick={clearCompare} className="text-[10px] uppercase font-black text-surface-500 hover:text-red-500 transition-colors">
                            {lang === 'uz' ? 'Tozalash' : lang === 'ru' ? 'Очистить' : 'Clear'}
                        </button>
                        <Link href="/compare" className="btn-premium btn-premium-white px-6 py-3 rounded-xl text-[10px] uppercase font-black tracking-widest text-center flex-1 md:flex-none whitespace-nowrap">
                            {lang === 'uz' ? 'Taqqoslash' : lang === 'ru' ? 'Сравнить' : 'Compare'} ({compareList.length})
                        </Link>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
    );
}
