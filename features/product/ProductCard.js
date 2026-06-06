"use client"

import ImageWithFallback from "@/components/common/ImageWithFallback"
import Link from "next/link"
import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import { useState, memo } from "react"
import QuickView from "./QuickView"
import PriceDisplay from "@/components/common/PriceDisplay"
import { useTranslation } from "@/lib/LanguageContext"

function ProductCard({ product, badge = null, rating = null }) {
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const { addToast, triggerCartAnimation } = useUIStore();
    const { t } = useTranslation();
    const isFavorite = wishlist.some(item => item.id === product.id);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false)

    // Variant Logic
    const hasVariants = product.variants && product.variants.length > 0;
    const validVariants = hasVariants ? product.variants : [];
    
    // Auto-select first variant if available
    const [selectedVariant, setSelectedVariant] = useState(validVariants.length > 0 ? validVariants[0] : null);
    const [hoverVariant, setHoverVariant] = useState(null);
    const [hoverImageIndex, setHoverImageIndex] = useState(0);

    const activeVariant = hoverVariant || selectedVariant;
    
    // Determine displays
    const activeImages = activeVariant?.images || (product.image ? [product.image] : []);
    const displayImage = activeImages[hoverImageIndex] || activeImages[0];
    const displayPrice = activeVariant?.price || product.basePrice || product.price || 0;
    const displayStock = activeVariant?.stock ?? product.countInStock ?? product.stock ?? 0;

    const badgeKeys = {
        'Bestseller': t('home_bestsellers'),
        'FLASH': t('home_flash_deals'),
        'Hot': t('new_arrivals')
    }

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (displayStock <= 0) return;
        
        const cartItem = {
            ...product,
            id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
            baseProductId: product.id,
            name: selectedVariant && selectedVariant.colorName !== 'Standard' 
                ? `${product.name} (${selectedVariant.colorName})` 
                : product.name,
            price: displayPrice,
            image: displayImage,
            variant: selectedVariant
        };
        
        addToCart(cartItem);
        triggerCartAnimation();
        addToast(t('cart_added_msg').replace('{name}', product.name));
    };

    return (
        <div className="product-card rounded-2xl p-2 md:p-5 flex flex-col h-full group relative overflow-hidden animate-slide-up bg-surface/50 border border-border-alpha hover:border-primary/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] will-change-transform">
            {/* Precision Badge */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {badge ? (
                    <div className="bg-primary text-white text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest shadow-xl">
                        {badgeKeys[badge] || badge}
                    </div>
                ) : product.discount ? (
                    <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[8px] md:text-[9px] font-black px-2 py-0.5 md:px-2.5 md:py-1 rounded-lg uppercase tracking-widest">
                        SALE {product.discount}%
                    </div>
                ) : null}
            </div>

            {/* IMAGE */}
            <div className="block relative overflow-hidden rounded-xl bg-surface-50 flex-1 min-h-[160px] md:min-h-[220px]">
                <ImageWithFallback
                    src={displayImage}
                    fallbackSrc="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop&q=80"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700 grayscale-[0.2] group-hover:grayscale-0"
                />

                {/* Thumbnail Gallery Preview on Hover (if multiple images exist for active variant) */}
                {activeImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        {activeImages.slice(0, 4).map((img, idx) => (
                            <div 
                                key={idx} 
                                onMouseEnter={() => setHoverImageIndex(idx)}
                                onMouseLeave={() => setHoverImageIndex(0)}
                                className={`w-8 h-8 rounded-md overflow-hidden border-2 transition-all ${hoverImageIndex === idx ? 'border-primary' : 'border-transparent opacity-70'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                )}

                <div className="absolute inset-0 bg-surface/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px] gap-4 z-10">
                    <button
                        onClick={() => setIsQuickViewOpen(true)}
                        className="btn-premium btn-premium-white text-foreground font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-4 md:px-8 py-3 md:py-4 rounded-xl shadow-2xl border border-border-alpha"
                    >
                        {t('quick_view')}
                    </button>
                    <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-2xl border border-border-alpha ${isFavorite ? 'bg-primary text-white border-primary' : 'bg-surface text-foreground hover:bg-primary hover:text-white'}`}
                        title="Sevimlilarga qo'shish"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-3 md:mt-6 flex flex-col gap-2 md:gap-4">
                {/* Brand & Rating & Swatches */}
                <div className="flex flex-col gap-2">
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
                    
                    {/* Color Swatches */}
                    {validVariants.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 h-5 items-center">
                            {validVariants.map((v) => {
                                const isOutOfStock = v.stock <= 0;
                                const isSelected = selectedVariant?.id === v.id;
                                return (
                                    <button
                                        key={v.id}
                                        onMouseEnter={() => setHoverVariant(v)}
                                        onMouseLeave={() => setHoverVariant(null)}
                                        onClick={(e) => { e.preventDefault(); setSelectedVariant(v); }}
                                        className={`w-4 h-4 rounded-full border border-surface-300 relative transition-all duration-300 group/swatch
                                            ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:scale-110'} 
                                            ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                        `}
                                        style={{ backgroundColor: v.colorHex || '#000000' }}
                                    >
                                        {/* Cross line for out of stock */}
                                        {isOutOfStock && (
                                            <span className="absolute inset-0 m-auto w-[120%] h-[1.5px] bg-red-500 rotate-45 transform origin-center shadow-sm" />
                                        )}
                                        {/* Tooltip */}
                                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[8px] whitespace-nowrap rounded opacity-0 group-hover/swatch:opacity-100 pointer-events-none transition-opacity z-30">
                                            {isOutOfStock ? "Tez orada yangi mahsulotlar keladi" : v.colorName}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-1.5">
                    <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${displayStock > 0 ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                    <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${displayStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {displayStock > 0 ? `${displayStock} ${t('stock')}` : t('out_of_stock')}
                    </span>
                </div>

                <Link href={`/products/${product.id}`} className="py-1">
                    <h3 className="font-extrabold text-foreground text-[11px] md:text-lg tracking-wider md:tracking-widest group-hover:text-primary transition-colors line-clamp-2 uppercase leading-relaxed md:leading-relaxed">
                        {product.name}
                    </h3>
                </Link>

                {/* Price Section */}
                <div className="flex flex-col gap-0.5">
                    {product.discount > 0 && (
                        <PriceDisplay
                            price={displayPrice}
                            className="text-[9px] md:text-[10px] text-surface-400 line-through font-bold opacity-60"
                        />
                    )}
                    <PriceDisplay
                        price={product.discount > 0 ? displayPrice * (1 - product.discount / 100) : displayPrice}
                        className="font-black text-xs md:text-xl text-foreground tracking-tight"
                    />
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1 md:pt-2">
                    <Link href={`/products/${product.id}`} className="btn-premium btn-premium-dark flex-1 h-9 md:h-11 font-black text-[9px] md:text-[10px] uppercase tracking-widest rounded-lg md:rounded-xl flex items-center justify-center">
                        {t('details')}
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={displayStock <= 0}
                        className={`btn-premium flex-[2] h-9 md:h-11 font-black text-[8px] md:text-[10px] uppercase tracking-widest rounded-lg md:rounded-xl shadow-lg transition-all
                            ${displayStock > 0 ? 'btn-premium-red' : 'bg-surface-300 text-surface-500 cursor-not-allowed border-none'}
                        `}
                    >
                        {displayStock > 0 ? t('buy_now') : t('out_of_stock')}
                    </button>
                </div>
            </div>
            <QuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
        </div>
    );
}

export default memo(ProductCard);
