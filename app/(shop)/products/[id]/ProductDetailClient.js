"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";
import ProductCard from "@/features/product/ProductCard";
import { reviewService } from "@/lib/services/review.service";

export default function ProductDetailClient({ product, relatedProducts }) {
    const { addToCart, wishlist, toggleWishlist } = useStore();
    const isFavorite = wishlist.some(item => item.id === product.id);
    const { t, lang } = useTranslation();
    const [isNotified, setIsNotified] = useState(false);
    const [activeImage, setActiveImage] = useState(product.image);
    const images = product.images || [product.image];

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

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 pt-6 md:pt-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 px-4 md:px-0">

                {/* IMAGE GALLERY */}
                <div className="space-y-6 md:space-y-8 max-w-[600px] mx-auto lg:mx-0 w-full">
                    <div className="aspect-[4/3] md:aspect-square relative bg-surface-100 rounded-[2rem] md:rounded-[3rem] overflow-hidden border-2 border-primary/20 dark:border-white/10 group shadow-2xl dark:shadow-premium ring-4 ring-primary/5">

                        {/* Video Background behind Image */}
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                        >
                            <source src="/videos/ProductAnimation.mp4" type="video/mp4" />
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-tr from-surface/40 to-transparent backdrop-blur-[1px]" />

                        <Image
                            src={activeImage || product.image}
                            alt={lang === 'ru' ? (product.nameRu || product.name) : lang === 'en' ? (product.nameEn || product.name) : product.name}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8 md:p-12 border-2 border-primary/20 dark:border-white/10 grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105 relative z-10 rounded-[2rem] md:rounded-[3rem]"
                        />
                        {product.countInStock <= 0 && (
                            <div className="absolute inset-0 bg-surface-900/40 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-20">
                                <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 font-black px-6 py-3 rounded-xl uppercase tracking-[0.3em] text-[10px]">{t('out_of_stock') || "OUT OF STOCK"}</span>
                            </div>
                        )}
                    </div>
                    {/* Max 3 images support */}
                    <div className="grid grid-cols-3 gap-4 md:gap-6">
                        {images.slice(0, 3).map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(img)}
                                className={`aspect-square bg-surface-100 rounded-xl md:rounded-2xl cursor-pointer border transition-all overflow-hidden p-2 md:p-4 ${activeImage === img ? 'border-primary ring-2 ring-primary/20 opacity-100' : 'border-surface-200 dark:border-white/5 opacity-50 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-contain" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DETAILS */}
                <div className="flex flex-col justify-center space-y-8 md:space-y-12">
                    <div className="space-y-4 md:space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-[9px] md:text-[10px] font-black text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 md:px-4 md:py-2 rounded-lg uppercase tracking-[0.4em]">{product.brand || 'Brand'}</span>
                            <span className="text-[9px] md:text-[10px] text-surface-500 font-bold uppercase tracking-[0.3em] font-mono">Status: {(product.countInStock > 0 ? (t('stock') || "In Stock") : (t('out_of_stock') || "On Request"))}</span>
                        </div>
                        <h1 className="text-3xl md:text-7xl font-black text-foreground tracking-tighter leading-[1] uppercase">{lang === 'ru' ? (product.nameRu || product.name) : lang === 'en' ? (product.nameEn || product.name) : product.name}</h1>
                        <div className="bg-surface-50/50 dark:bg-surface-800/30 backdrop-blur-md p-5 md:p-8 rounded-2xl border border-surface-200 dark:border-white/5 shadow-sm">
                            <p className="text-surface-600 dark:text-surface-400 text-sm md:text-lg font-medium leading-relaxed font-sans">{lang === 'ru' ? (product.descriptionRu || product.specs || product.description) : lang === 'en' ? (product.descriptionEn || product.specs || product.description) : (product.description || product.specs || "Professional hardware specifications and technical parameters.")}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8 md:gap-12">
                        <div className="flex flex-col">
                            <span className="text-surface-400 dark:text-surface-500 line-through font-bold text-base md:text-xl opacity-60">$ {(product.price * 1.15).toFixed(0)}</span>
                            <span className="text-4xl md:text-6xl font-black text-foreground tracking-tighter">${product.price}</span>
                        </div>
                        <div className="h-12 md:h-16 w-px bg-surface-200 dark:bg-white/10 hidden md:block" />
                        <div className="hidden md:block space-y-1">
                            <p className="text-green-600 dark:text-green-500 font-black text-[10px] uppercase tracking-[0.3em]">SAVE 15%</p>
                            <p className="text-surface-500 text-[9px] font-bold uppercase tracking-widest">Global shipping included</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                        <button
                            onClick={() => addToCart(product)}
                            className={`flex-[2] font-black py-5 md:py-7 rounded-xl shadow-lg md:shadow-2xl transition-all active:scale-95 uppercase text-[10px] md:text-xs tracking-widest ${product.countInStock > 0 ? 'bg-foreground text-background dark:bg-white dark:text-black hover:bg-primary hover:text-white' : 'bg-primary text-white hover:bg-foreground hover:text-background'}`}
                        >
                            {product.countInStock > 0 ? (t('buy_now') || 'Buy Now') : (t('pre_order') || 'Pre-order')}
                        </button>
                        <button
                            onClick={() => toggleWishlist(product)}
                            className={`flex-1 py-5 md:py-0 border border-surface-200 dark:border-white/10 rounded-xl flex items-center justify-center hover:bg-surface-100 dark:hover:bg-white/5 transition-all backdrop-blur-md ${isFavorite ? 'text-primary bg-primary/5 border-primary/20' : 'text-foreground bg-white/10 dark:bg-black/10'}`}
                        >
                            <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE */}
            <section className="space-y-10 md:space-y-16 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0">
                <div className="flex items-end justify-between border-l-4 border-primary pl-6 md:pl-8">
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase">{t('technical_specs') || "Техническая информация"}</h2>
                        <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t('detailed_specs') || "Detailed hardware specifications"}</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-xl">
                    <div className="divide-y divide-surface-100 dark:divide-white/5">
                        {[
                            { label: "Оперативная память", value: product.ram || "16 ГБ" },
                            { label: "Накопитель", value: product.storage || "512 ГБ" },
                            { label: "Процессор", value: product.cpu || "Intel Core i7-12700K" },
                            { label: "Видеокарта", value: product.gpu || "NVIDIA RTX 3080" },
                            { label: "Частота обновления", value: product.refreshRate || "165 Гц" },
                            { label: "Дисплей", value: product.display || "27\" QHD IPS" }
                        ].map((spec, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-2 px-8 py-6 md:px-12 md:py-8 hover:bg-surface-50 dark:hover:bg-white/[0.02] transition-colors group"
                            >
                                <span className="text-surface-500 dark:text-surface-400 font-bold uppercase text-[10px] md:text-xs tracking-widest group-hover:text-primary transition-colors">
                                    {spec.label}
                                </span>
                                <span className="text-foreground font-black text-xs md:text-lg text-right uppercase tracking-tight">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* REVIEWS SECTION */}
            <section className="space-y-10 md:space-y-16 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 border-l-4 border-primary pl-6 md:pl-8">
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase">{t('user_reviews') || "User Reviews"}</h2>
                        <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t('verified_customer') || "Verified customer experiences"}</p>
                    </div>
                    <button
                        onClick={() => document.getElementById('review-form')?.scrollIntoView({ behavior: 'smooth' })}
                        className="bg-primary/10 border border-primary/20 text-primary font-black px-6 py-3 md:px-8 md:py-4 rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all w-full md:w-auto backdrop-blur-sm"
                    >
                        {t('add_review') || "Add Review"}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16">
                    {/* Review List */}
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {reviews.length > 0 ? (
                            reviews.map((review, idx) => (
                                <div key={idx} className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/5 p-6 md:p-8 rounded-2xl md:rounded-[2rem] space-y-4 animate-slide-up shadow-sm" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-black text-[10px] md:text-xs">
                                                {review.userName?.[0] || 'U'}
                                            </div>
                                            <div>
                                                <p className="text-foreground font-black text-[10px] md:text-xs uppercase tracking-tight">{review.userName}</p>
                                                <p className="text-[8px] md:text-[9px] text-surface-500 font-bold uppercase tracking-widest">Date: {review.createdAt?.toLocaleDateString() || 'Recently'}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-500 text-[10px] md:text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-surface-600 dark:text-surface-400 text-xs md:text-sm leading-relaxed font-medium">"{review.comment}"</p>
                                </div>
                            ))
                        ) : (
                            <div className="bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-white/5 p-12 md:p-16 rounded-[2rem] text-center space-y-4 opacity-50">
                                <div className="text-3xl md:text-4xl">📂</div>
                                <p className="text-surface-500 font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">{t('no_reviews') || "No Reviews Found"}</p>
                            </div>
                        )}
                    </div>

                    {/* Review Form */}
                    <div id="review-form" className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/5 p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] h-fit sticky top-32 shadow-lg">
                        <h3 className="text-lg md:text-xl font-black text-foreground uppercase tracking-widest mb-6 md:mb-8">{t('add_review') || "Add a Review"}</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-5 md:space-y-6">
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_name') || "Your Name"}</label>
                                <input
                                    type="text"
                                    required
                                    value={newReview.userName}
                                    onChange={(e) => setNewReview({ ...newReview, userName: e.target.value })}
                                    className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-xs text-foreground focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder={t('form_name_placeholder') || "Enter your name"}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_rating') || "Rating"}</label>
                                <div className="flex gap-2 md:gap-3">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setNewReview({ ...newReview, rating: star })}
                                            className={`text-xl md:text-2xl transition-all ${star <= newReview.rating ? 'text-yellow-500 scale-110' : 'text-surface-300 dark:text-surface-700 hover:text-surface-500'}`}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] md:text-[10px] font-black text-surface-500 uppercase tracking-widest">{t('form_comment') || "Your Comment"}</label>
                                <textarea
                                    required
                                    rows="4"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-4 py-3 md:px-5 md:py-4 text-[11px] md:text-xs text-foreground focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                    placeholder={t('form_comment_placeholder') || "Describe your experience"}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-foreground text-background dark:bg-white dark:text-black font-black py-4 md:py-5 rounded-xl hover:bg-primary hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {isSubmitting ? (t('form_processing') || 'Processing...') : (t('post_review') || 'Post Review')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* RELATED PRODUCTS */}
            <section className="space-y-10 md:space-y-16 pt-12 md:pt-20 border-t border-surface-200 dark:border-white/5 px-4 md:px-0">
                <div className="flex items-end justify-between border-l-4 border-primary pl-6 md:pl-8">
                    <div className="space-y-2 md:space-y-3">
                        <h2 className="text-2xl md:text-4xl font-black text-foreground tracking-tighter uppercase">{t('related_products') || "Related Products"}</h2>
                        <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em]">{t('comparable_hardware') || "Comparable hardware options"}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                    {relatedProducts?.slice(0, 4).map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            </section>
        </div>
    );
}
