"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";
import ProductCard from "@/features/product/ProductCard";
import { reviewService } from "@/lib/services/review.service";
import PriceDisplay from "@/components/common/PriceDisplay";
import { translateSpec } from "@/lib/utils/translateSpec";
import { getSpecExplanation } from "@/lib/utils/specExplanations";

export default function ProductDetailClient({ product, relatedProducts }) {
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const isFavorite = wishlist.some(item => item.id === product.id);
    const { t, lang } = useTranslation();
    const [isNotified, setIsNotified] = useState(false);
    const [activeModal, setActiveModal] = useState(null);
    
    // Variant Logic
    const hasVariants = product.variants && product.variants.length > 0;
    const validVariants = hasVariants ? product.variants : [];
    const [selectedVariant, setSelectedVariant] = useState(validVariants.length > 0 ? validVariants[0] : null);

    const displayImages = selectedVariant?.images?.length > 0 
        ? selectedVariant.images 
        : (product.image ? [product.image] : []);
    
    const [activeImage, setActiveImage] = useState(displayImages[0]);

    useEffect(() => {
        setActiveImage(displayImages[0]);
    }, [selectedVariant]);

    const displayPrice = selectedVariant?.price || product.basePrice || product.price || 0;
    const finalPrice = product.discount > 0 ? displayPrice * (1 - product.discount / 100) : displayPrice;
    const displayStock = selectedVariant?.stock ?? product.countInStock ?? product.stock ?? 0;
    const isOutOfStock = displayStock <= 0;

    // Image Zoom State
    const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
    const [isZooming, setIsZooming] = useState(false);



    // Review States
    const [reviews, setReviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newReview, setNewReview] = useState({ userName: "", rating: 5, comment: "" });

    useEffect(() => {
        const fetchReviews = async () => {
            const data = await reviewService.getProductReviews(product.id);
            setReviews(data);
        };
        fetchReviews();
    }, [product.id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await reviewService.addReview(product.id, newReview);
            const updatedReviews = await reviewService.getProductReviews(product.id);
            setReviews(updatedReviews);
            setNewReview({ userName: "", rating: 5, comment: "" });
        } catch (error) {
            console.error("Failed to submit review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        
        const cartItem = {
            ...product,
            id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
            baseProductId: product.id,
            name: selectedVariant && selectedVariant.colorName !== 'Standard' 
                ? `${product.name} (${selectedVariant.colorName})` 
                : product.name,
            price: finalPrice,
            image: displayImages[0],
            variant: selectedVariant
        };
        addToCart(cartItem);
    };

    const productName = lang === 'ru' ? (product.nameRu || product.name) : lang === 'en' ? (product.nameEn || product.name) : product.name;
    const productDesc = lang === 'ru' ? (product.descriptionRu || product.description) : lang === 'en' ? (product.descriptionEn || product.description) : (product.description || "Professional hardware specifications and technical parameters.");

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-32 pt-6 md:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 px-4 md:px-0">

                {/* IMAGE GALLERY WITH ZOOM */}
                <div className="space-y-4 md:space-y-6 max-w-[450px] mx-auto lg:mx-0 w-full">
                    {/* Show selected color name above the image */}
                    {validVariants.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-black text-surface-500 uppercase tracking-widest">{t('color') || 'Tanlangan rang'}:</span>
                            <span className="text-sm font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-md">{selectedVariant?.colorName}</span>
                        </div>
                    )}
                    
                    <div 
                        className="w-full aspect-square relative bg-surface-100 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden border border-surface-200 dark:border-white/10 group shadow-xl cursor-crosshair"
                        onMouseEnter={() => setIsZooming(true)}
                        onMouseLeave={() => setIsZooming(false)}
                        onMouseMove={handleImageMouseMove}
                    >
                        {/* Video Background behind Image */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-30"
                        >
                            <source src="/videos/ProductAnimation.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-tr from-surface/80 to-transparent backdrop-blur-[2px] z-0" />

                        <div className="absolute inset-0 z-10 p-8 md:p-12 overflow-hidden">
                            <Image
                                src={activeImage}
                                alt={productName}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-contain p-8 md:p-12 transition-transform duration-200 ease-out"
                                style={{
                                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                    transform: isZooming ? 'scale(2.5)' : 'scale(1)'
                                }}
                            />
                        </div>

                        {isOutOfStock && (
                            <div className="absolute inset-0 bg-surface-900/60 backdrop-blur-md flex items-center justify-center z-20">
                                <span className="bg-red-500 text-white font-black px-6 py-3 rounded-xl uppercase tracking-[0.3em] text-[10px] shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                    {t('out_of_stock') || "OUT OF STOCK"}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Thumbnail Gallery */}
                    {displayImages.length > 1 && (
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {displayImages.map((img, i) => (
                                <div
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={`w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-surface-100 rounded-xl cursor-pointer border transition-all overflow-hidden p-1.5 md:p-2 relative group ${activeImage === img ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'border-surface-200 dark:border-white/5 hover:border-primary/50'}`}
                                >
                                    <img src={img} className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-500" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DETAILS */}
                <div className="flex flex-col justify-center space-y-8 md:space-y-10">
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg uppercase tracking-[0.4em]">{product.brand || 'Brand'}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-[0.3em] font-mono ${displayStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                Status: {(displayStock > 0 ? (t('stock') || "In Stock") : (t('out_of_stock') || "Out of Stock"))}
                            </span>
                        </div>
                        
                        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight leading-[1.2] uppercase drop-shadow-sm">
                            {productName}
                        </h1>
                        
                        <div className="bg-surface-50 dark:bg-zinc-900/50 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-surface-200 dark:border-white/5 shadow-inner">
                            <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base font-medium leading-relaxed">
                                {productDesc}
                            </p>
                        </div>
                    </div>

                    {/* Color Swatches */}
                    {validVariants.length > 1 && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-surface-500 uppercase tracking-widest">
                                {t('color') || 'Color'}: <span className="text-foreground">{selectedVariant?.colorName}</span>
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {validVariants.map((v) => {
                                    const isVOutOfStock = v.stock <= 0;
                                    const isSelected = selectedVariant?.id === v.id;
                                    return (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariant(v)}
                                            className={`w-10 h-10 rounded-full border border-surface-300 relative transition-all duration-300 group/swatch
                                                ${isSelected ? 'ring-2 ring-primary ring-offset-4 ring-offset-background scale-110' : 'hover:scale-110'} 
                                                ${isVOutOfStock ? 'opacity-40' : 'cursor-pointer'}
                                            `}
                                            style={{ backgroundColor: v.colorHex || '#000000' }}
                                        >
                                            {/* Cross line for out of stock */}
                                            {isVOutOfStock && (
                                                <span className="absolute inset-0 m-auto w-[130%] h-[2px] bg-red-500 rotate-45 transform origin-center shadow-md" />
                                            )}
                                            {/* Tooltip */}
                                            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-black text-white text-[10px] font-bold whitespace-nowrap rounded-lg opacity-0 group-hover/swatch:opacity-100 pointer-events-none transition-opacity z-30 shadow-xl">
                                                {isVOutOfStock ? "Tez orada yangi mahsulotlar keladi" : v.colorName}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Price and Installments */}
                    <div className="space-y-6">
                        <div className="flex items-end gap-6 md:gap-8">
                            <div className="flex flex-col">
                                {product.discount > 0 && (
                                    <PriceDisplay price={displayPrice} className="text-surface-400 dark:text-surface-500 line-through font-bold text-base md:text-lg opacity-60 decoration-2" />
                                )}
                                <PriceDisplay price={finalPrice} className="text-4xl md:text-5xl font-black text-primary tracking-tight drop-shadow-sm" />
                            </div>
                            <div className="h-12 md:h-16 w-px bg-surface-200 dark:bg-white/10 hidden md:block" />
                            <div className="hidden md:block space-y-1.5 pb-2">
                                {product.discount > 0 ? (
                                    <p className="text-primary font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        SALE {product.discount}%
                                    </p>
                                ) : (
                                    <p className="text-green-500 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        IN STOCK
                                    </p>
                                )}
                                <p className="text-surface-500 text-[9px] font-bold uppercase tracking-widest">Global shipping included</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-4">
                        <button
                            onClick={handleAddToCart}
                            disabled={isOutOfStock}
                            className={`group relative flex-[2] font-black py-5 md:py-6 rounded-2xl shadow-xl transition-all active:scale-95 uppercase text-[11px] md:text-xs tracking-widest overflow-hidden 
                                ${!isOutOfStock ? 'bg-primary text-white hover:bg-foreground hover:text-background' : 'bg-surface-200 text-surface-400 cursor-not-allowed shadow-none border-none'}`}
                        >
                            {!isOutOfStock && <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {!isOutOfStock ? (t('buy_now') || 'Buy Now') : (t('out_of_stock') || 'Out of Stock')}
                                {!isOutOfStock && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                            </span>
                        </button>
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`flex-1 py-5 md:py-0 border border-surface-200 dark:border-white/10 rounded-2xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-white/5 transition-all backdrop-blur-md group ${isFavorite ? 'text-primary bg-primary/5 border-primary/20 shadow-inner' : 'text-foreground bg-white/10 dark:bg-black/10'}`}
                        >
                            <svg className={`w-6 h-6 transition-transform group-hover:scale-110 ${isFavorite ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE */}
            {product.specs && Object.keys(product.specs).length > 0 && (
                <section className="space-y-10 md:space-y-12 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0 max-w-5xl mx-auto">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">{t('technical_specs') || "Technical Specifications"}</h2>
                        <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.3em]">{t('detailed_specs') || "Detailed hardware specifications"}</p>
                        <div className="w-16 h-1 bg-primary rounded-full mt-4" />
                    </div>

                    <div className="bg-white dark:bg-zinc-900/80 border border-surface-200 dark:border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-xl">
                        <div className="divide-y divide-surface-100 dark:divide-white/5">
                            {Object.entries(product.specs).map(([key, val], idx) => (
                                <div
                                    key={idx}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-0 px-6 py-5 md:px-12 md:py-6 hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors group"
                                >
                                    <span className="text-surface-500 dark:text-surface-400 font-bold uppercase text-[11px] md:text-sm tracking-widest flex items-center gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors hidden md:block" />
                                        <div className="flex flex-col">
                                            <span>{translateSpec(key, lang)}</span>
                                            <button 
                                                onClick={() => setActiveModal({ name: key })}
                                                className="text-[9px] md:text-[10px] text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold uppercase tracking-wider mt-0.5 hover:underline transition-colors text-left flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {lang === 'uz' ? "Nima bu?" : lang === 'ru' ? "Что это?" : "What is this?"}
                                            </button>
                                        </div>
                                    </span>
                                    <span className="text-foreground font-black text-sm md:text-lg md:text-right uppercase tracking-tight">
                                        {translateSpec(val, lang)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* REVIEWS SECTION */}
            <section className="space-y-10 md:space-y-12 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0 max-w-6xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center space-y-4 mb-8">
                    <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase">{t('user_reviews') || "User Reviews"}</h2>
                    <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[11px] tracking-[0.3em]">{t('verified_customer') || "Verified customer experiences"}</p>
                    <div className="w-16 h-1 bg-primary rounded-full mt-4" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16">
                    {/* Review Form */}
                    <div id="review-form" className="lg:col-span-5 bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] h-fit sticky top-32 shadow-xl order-2 lg:order-1">
                        <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-widest mb-6 md:mb-8">{t('add_review') || "Add a Review"}</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-5 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_name') || "Your Name"}</label>
                                <input
                                    type="text"
                                    required
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                                    className="w-full bg-white dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-4 py-4 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm"
                                    placeholder={t('form_name_placeholder') || "Enter your name"}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_rating') || "Rating"}</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`text-2xl transition-all ${star <= newReview.rating ? 'text-yellow-500 scale-110 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'text-surface-300 dark:text-surface-700 hover:text-surface-400 hover:scale-105'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_comment') || "Your Comment"}</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full bg-white dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-4 py-4 text-xs text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-sm"
                                    placeholder={t('form_comment_placeholder') || "Describe your experience"}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="group relative w-full bg-foreground text-background dark:bg-white dark:text-black font-black py-5 rounded-xl hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50 shadow-lg overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                                <span className="relative z-10">{isSubmitting ? (t('form_processing') || 'Processing...') : (t('post_review') || 'Post Review')}</span>
                            </button>
                        </form>
                    </div>

                    {/* Review List */}
                    <div className="lg:col-span-7 space-y-6 md:space-y-8 order-1 lg:order-2">
                        {reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <div key={idx} className="bg-white dark:bg-zinc-900/50 border border-surface-200 dark:border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-4 shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-[11px] md:text-sm border border-primary/20">
                                                {review.userName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-foreground font-black text-xs md:text-sm uppercase tracking-tight">{review.userName}</p>
                                                <p className="text-[9px] md:text-[10px] text-surface-400 font-bold uppercase tracking-widest">Date: {review.createdAt?.toLocaleDateString() || 'Recently'}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500 text-xs md:text-sm drop-shadow-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="pl-14 md:pl-16">
                                        <p className="text-surface-600 dark:text-surface-300 text-sm md:text-base leading-relaxed font-medium italic">"{review.comment}"</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-surface-50 dark:bg-zinc-900/50 border border-surface-200 dark:border-white/5 p-16 md:p-24 rounded-[3rem] text-center space-y-6 opacity-60">
                                <div className="text-4xl md:text-5xl opacity-50">📂</div>
                                <p className="text-surface-500 font-black text-xs md:text-sm uppercase tracking-[0.4em]">{t('no_reviews') || "No Reviews Found"}</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* RELATED PRODUCTS */}
            <section className="space-y-10 md:space-y-16 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0 max-w-7xl mx-auto">
                <div className="flex items-end justify-between border-l-4 border-primary pl-6 md:pl-8">
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase">{t('related_products') || "Related Products"}</h2>
                        <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t('comparable_hardware') || "Comparable hardware options"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {relatedProducts?.slice(0, 4).map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>

            {/* Explanation Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
                    <div 
                        className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 transition-colors text-foreground"
                        >
                            ✕
                        </button>
                        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-3">
                            {translateSpec(activeModal.name, lang)}
                        </h3>
                        <p className="text-sm text-surface-600 dark:text-surface-300 font-medium leading-relaxed">
                            {getSpecExplanation(activeModal.name)[lang] || getSpecExplanation(activeModal.name)['en']}
                        </p>
                        <button 
                            onClick={() => setActiveModal(null)}
                            className="w-full mt-6 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-foreground font-black uppercase tracking-wider text-xs py-3 rounded-xl transition-colors"
                        >
                            {lang === 'uz' ? "Tushunarli" : lang === 'ru' ? "Понятно" : "Got it"}
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
