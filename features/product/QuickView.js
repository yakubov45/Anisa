"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function QuickView({ product, isOpen, onClose }) {
    const { t } = useTranslation();
    const addToCart = useStore(state => state.addToCart);
    const { addToast, triggerCartAnimation } = useUIStore();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 md:p-12 animate-fade-in">
            <div className="absolute inset-0 bg-surface-900/60 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-5xl max-h-[95vh] md:max-h-[85vh] overflow-y-auto md:overflow-hidden bg-white dark:bg-surface-800 border border-surface-200 dark:border-white/5 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row animate-slide-up group custom-scrollbar">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] dark:opacity-10 pointer-events-none" />

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 z-[110] w-10 h-10 md:w-12 md:h-12 bg-surface-100 dark:bg-surface-700/80 backdrop-blur-md rounded-xl flex items-center justify-center text-foreground dark:text-white hover:bg-primary hover:text-white transition-all shadow-xl group/btn border border-surface-200 dark:border-white/10">
                    <svg className="w-5 h-5 group-hover/btn:rotate-90 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-1/2 min-h-[280px] md:min-h-0 relative bg-surface-50 dark:bg-surface-100/10">
                    <Image
                        src={product.image || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80"}
                        alt={product.name}
                        fill
                        className="object-contain p-6 md:p-12 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                    />
                </div>

                {/* Right: Info */}
                <div className="w-full md:w-1/2 p-6 md:p-16 flex flex-col justify-center space-y-6 md:space-y-10 relative z-10">
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] md:text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1 md:px-4 md:py-1.5 rounded-lg uppercase tracking-[0.3em]">
                                {t('quick_view')}
                            </span>
                            <span className="text-[9px] md:text-[10px] text-surface-500 font-bold uppercase tracking-[0.2em] font-mono">ID: {product.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-black text-foreground tracking-tighter leading-none uppercase">{product.name}</h2>
                        <p className="text-surface-600 dark:text-surface-400 text-sm md:text-lg leading-relaxed font-sans">{product.specs || "Professional hardware specifications and technical parameters."}</p>
                    </div>

                    <div className="flex items-center gap-6 md:gap-10">
                        <div className="flex flex-col">
                            <span className="text-surface-400 dark:text-surface-500 line-through font-bold text-[10px] md:text-sm opacity-50">$ {(product.price * 1.15).toFixed(0)}</span>
                            <span className="text-3xl md:text-5xl font-black text-foreground tracking-tighter">${product.price}</span>
                        </div>
                        <div className="flex-1 hidden sm:block">
                            <div className="text-[8px] md:text-[10px] font-black text-green-500 uppercase tracking-widest mb-2">
                                {product.stock > 0 ? t('stock') : t('out_of_stock')}
                            </div>
                            <div className="w-full h-1 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden">
                                <div className={`h-full ${product.stock > 0 ? 'w-4/5 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'w-0 bg-red-500'}`} />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-2 md:pt-4">
                        <button
                            onClick={() => { 
                                addToCart(product); 
                                triggerCartAnimation();
                                addToast(`${product.name} SAVATCHAGA QO'SHILDI`);
                                onClose(); 
                            }}
                            className="flex-1 bg-foreground dark:bg-white text-background dark:text-black font-black py-4 md:py-6 rounded-xl shadow-2xl hover:bg-primary dark:hover:bg-primary hover:text-white transition-all uppercase text-[10px] md:text-xs tracking-widest active:scale-95"
                        >
                            {t('buy_now')}
                        </button>
                        <button className="hidden sm:flex px-8 md:px-10 py-4 md:py-0 border border-surface-200 dark:border-white/10 rounded-xl items-center justify-center hover:bg-surface-50 dark:hover:bg-white/5 transition-all text-foreground dark:text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
