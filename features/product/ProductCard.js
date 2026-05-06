"use client"

import ImageWithFallback from "@/components/common/ImageWithFallback"
import Link from "next/link"
import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import { useState } from "react"
import QuickView from "./QuickView"
import PriceDisplay from "@/components/common/PriceDisplay"
import { useTranslation } from "@/lib/LanguageContext"

export default function ProductCard({ product, badge = null, rating = null }) {
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const { addToast, triggerCartAnimation } = useUIStore();
    const { t } = useTranslation();
    const isFavorite = wishlist.some(item => item.id === product.id);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

    return (
        <>
            <div className="product-card rounded-2xl p-2 md:p-5 flex flex-col h-full group relative overflow-hidden animate-slide-up bg-surface/50 border border-border-alpha hover:border-primary/50 transition-colors">

                {/* Precision Badge */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {badge ? (
                        <div className="bg-primary text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest shadow-xl">
                            {badge}
                        </div>
                    ) : product.discount ? (
                        <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest">
                            Sale {product.discount}%
                        </div>
                    ) : null}
                </div>

                {/* IMAGE - Balandligi oshirildi */}
                <div className="block relative overflow-hidden rounded-xl bg-surface-50 flex-1 min-h-[160px] md:min-h-[220px]">
                    <ImageWithFallback
                        src={product.image}
                        fallbackSrc="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop&q=80"
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0"
                    />

                    <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] gap-4">
                        <button
                            onClick={() => setIsQuickViewOpen(true)}
                            className="bg-surface text-foreground font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-4 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 border border-border-alpha"
                        >
                            {t('quick_view')}
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                            className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-2xl border border-border-alpha ${isFavorite ? 'bg-primary text-white border-primary' : 'bg-surface text-foreground hover:bg-primary hover:text-white'}`}
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="mt-3 md:mt-6 flex flex-col gap-2 md:gap-4">
                    {/* Qator 1: Brand va Reyting */}
                    <div className="flex items-center justify-between">
                        <span className="text-[7px] md:text-[9px] font-black text-surface-500 uppercase tracking-[0.3em] font-mono">{product.brand || 'Brand'}</span>
                        {(rating || product.rating) && (
                            <div className="flex text-yellow-500 text-[8px] gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < (rating || product.rating) ? '★' : '☆'}</span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Qator 2: Stock Status */}
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${product.stock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.stock > 0 ? `${product.stock} ${t('stock')}` : t('out_of_stock')}
                        </span>
                    </div>

                    {/* Qator 3: Product Name */}
                    <Link href={`/products/${product.id}`}>
                        <h3 className="font-extrabold text-foreground text-[10px] md:text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-2 uppercase leading-tight">{product.name}</h3>
                    </Link>
                    
                    {/* Qator 4: Price Section */}
                    <div className="flex flex-col gap-0.5">
                        {product.discount && (
                            <PriceDisplay 
                                price={product.price / (1 - product.discount / 100)} 
                                className="text-[9px] md:text-[10px] text-surface-400 line-through font-bold opacity-60" 
                            />
                        )}
                        <PriceDisplay 
                            price={product.price} 
                            className="font-black text-xs md:text-xl text-foreground tracking-tight" 
                        />
                    </div>

                    {/* Qator 5: Buttons */}
                    <div className="flex gap-2 pt-1 md:pt-2">
                        <Link href={`/products/${product.id}`} className="flex-1 h-9 md:h-14 border border-border-alpha hover:border-primary/50 text-surface-500 hover:text-primary font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-lg md:rounded-xl bg-surface-50 flex items-center justify-center transition-all active:scale-95">
                            {t('details')}
                        </Link>
                        <button
                            onClick={(e) => { 
                                e.preventDefault(); 
                                addToCart(product);
                                triggerCartAnimation();
                                addToast(`${product.name} SAVATCHAGA QO'SHILDI`);
                            }}
                            className="flex-[2] h-9 md:h-14 bg-foreground text-background font-black text-[8px] md:text-[10px] uppercase tracking-widest rounded-lg md:rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-lg"
                        >
                            {t('buy_now')}
                        </button>
                    </div>
                </div>
            </div>

            <QuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
        </>
    )
}
