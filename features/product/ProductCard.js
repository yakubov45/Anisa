"use client"

import ImageWithFallback from "@/components/common/ImageWithFallback"
import Link from "next/link"
import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import { useState, memo, useEffect } from "react"
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
    const [isCardHovered, setIsCardHovered] = useState(false);
    const [isInteracting, setIsInteracting] = useState(false);

    const activeVariant = hoverVariant || selectedVariant;
    const activeImages = activeVariant?.images || (product.image ? [product.image] : []);

    useEffect(() => {
        let timeout;
        if (isCardHovered && activeImages.length > 1 && !isInteracting) {
            timeout = setTimeout(() => {
                setHoverImageIndex(1); // 2 soniyadan so'ng 2-rasmga o'tish
            }, 2000);
        } else if (!isCardHovered) {
            setHoverImageIndex(0);
            setIsInteracting(false);
        }
        return () => clearTimeout(timeout);
    }, [isCardHovered, activeImages.length, isInteracting]);
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
            price: product.discount > 0 ? displayPrice * (1 - product.discount / 100) : displayPrice,
            image: displayImage,
            variant: selectedVariant
        };
        
        addToCart(cartItem);
        triggerCartAnimation();
        addToast(t('cart_added_msg').replace('{name}', product.name));
    };

    return (
        <div 
            className="product-card rounded-2xl p-2 md:p-5 flex flex-col h-full group relative overflow-hidden animate-slide-up bg-surface/50 border border-border-alpha hover:border-primary/50 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] will-change-transform"
            onMouseEnter={() => setIsCardHovered(true)}
            onMouseLeave={() => setIsCardHovered(false)}
        >
            {/* Precision Badge */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                {badge ? (
                    <div className="bg-primary text-white text-[7px] md:text-[9px] font-black px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-wider md:tracking-widest shadow-xl">
                        {badgeKeys[badge] || badge}
                    </div>
                ) : product.discount ? (
                    <div className="bg-primary/20 backdrop-blur-md border border-primary/30 text-primary text-[7px] md:text-[9px] font-black px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-md md:rounded-lg uppercase tracking-wider md:tracking-widest">
                        SALE {product.discount}%
                    </div>
                ) : null}
            </div>

            {/* IMAGE */}
            <div className="block relative overflow-hidden rounded-xl bg-surface-50 w-full aspect-[4/3] md:aspect-square group/image">
                <ImageWithFallback
                    src={displayImage}
                    fallbackSrc="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=500&auto=format&fit=crop&q=80"
                    alt={product.name}
                    className="w-full h-full object-cover group-hover/image:scale-105 transition-all duration-700"
                />

                {/* Thumbnail Gallery Preview on Hover (if multiple images exist for active variant) */}
                {activeImages.length > 1 && (
                    <div className="absolute bottom-2 left-0 w-full flex justify-center gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity z-20">
                        {activeImages.slice(0, 4).map((img, idx) => (
                            <div 
                                key={idx} 
                                onMouseEnter={() => {
                                    setIsInteracting(true);
                                    setHoverImageIndex(idx);
                                }}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsInteracting(true);
                                    setHoverImageIndex(idx);
                                }}
                                className={`w-8 h-8 rounded-md cursor-pointer overflow-hidden border-2 transition-all ${hoverImageIndex === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Actions (Wishlist & Quick View) */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 z-20 opacity-0 group-hover/image:opacity-100 transition-all translate-x-2 group-hover/image:translate-x-0">
                    <button
                        onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shadow-md border border-border-alpha ${isFavorite ? 'bg-primary text-white border-primary' : 'bg-surface text-foreground hover:bg-primary hover:text-white'}`}
                        title="Sevimlilarga qo'shish"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setIsQuickViewOpen(true)}
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-surface text-foreground flex items-center justify-center hover:bg-primary hover:text-white transition-all active:scale-95 shadow-md border border-border-alpha"
                        title={t('quick_view')}
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="mt-3 md:mt-5 flex flex-col gap-1.5 md:gap-2.5 flex-grow">
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
                    {validVariants.length > 0 ? (
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
                    ) : (
                        <div className="h-5" />
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
                    <h3 className="font-extrabold text-foreground text-[9px] md:text-sm tracking-normal md:tracking-wider group-hover:text-primary transition-colors line-clamp-2 uppercase leading-snug md:leading-relaxed">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto flex flex-col gap-2.5 md:gap-3">
                    {/* Price Section */}
                    <div className="flex flex-col gap-0.5">
                        {product.discount > 0 ? (
                            <PriceDisplay
                                price={displayPrice}
                                className="text-[8px] md:text-[10px] text-surface-400 line-through font-bold opacity-60 min-h-[12px] md:min-h-[15px]"
                            />
                        ) : (
                            <div className="min-h-[12px] md:min-h-[15px]" />
                        )}
                        <PriceDisplay
                            price={product.discount > 0 ? displayPrice * (1 - product.discount / 100) : displayPrice}
                            className="font-black text-[10px] md:text-base text-foreground tracking-tight"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-1.5 md:gap-2">
                        <Link href={`/products/${product.id}`} className="btn-premium btn-premium-dark flex-1 h-8 md:h-11 font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest rounded-md md:rounded-xl flex items-center justify-center">
                            {t('details')}
                        </Link>
                        <button
                            onClick={handleAddToCart}
                            disabled={displayStock <= 0}
                            className={`btn-premium flex-[2] h-8 md:h-11 font-black text-[7px] md:text-[10px] uppercase tracking-wider md:tracking-widest rounded-md md:rounded-xl shadow-lg transition-all
                                ${displayStock > 0 ? 'btn-premium-red' : 'bg-surface-300 text-surface-500 cursor-not-allowed border-none'}
                            `}
                        >
                            {displayStock > 0 ? t('buy_now') : t('out_of_stock')}
                        </button>
                    </div>
                </div>
            </div>
            <QuickView product={product} isOpen={isQuickViewOpen} onClose={() => setIsQuickViewOpen(false)} />
        </div>
    );
}

export default memo(ProductCard);
