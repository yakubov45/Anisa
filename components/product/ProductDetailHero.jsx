"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

const GALLERY_IMAGES = [
  { id: "main", src: "/images/editorial/pdp-main-dutch-oven.png", alt: "Artisan Cast Iron Dutch Oven in Olive Green" },
  { id: "knob", src: "/images/editorial/pdp-thumb-1.png", alt: "Signature stainless steel knob detail" },
  { id: "interior", src: "/images/editorial/pdp-thumb-2.png", alt: "Smooth cream vitreous enamel interior" },
  { id: "oven", src: "/images/editorial/pdp-thumb-3.png", alt: "Dutch oven baking sourdough in professional oven" },
  { id: "bread", src: "/images/editorial/pdp-thumb-4.png", alt: "Freshly baked crusty sourdough loaf in dutch oven" },
];

const COLORS = [
  { id: "olive", name: "Olive Green", hex: "#264821" },
  { id: "terracotta", name: "Terracotta", hex: "#C88A58" },
  { id: "cream", name: "Cream", hex: "#F4F1EA", border: "#D9D3C7" },
];

const SIZES = [
  { id: "2.5l", capacity: "2.5L", servings: "1–2 People", price: 195 },
  { id: "4.0l", capacity: "4.0L", servings: "3–4 People", price: 225 },
  { id: "6.0l", capacity: "6.0L", servings: "6+ People", price: 245 },
];

export default function ProductDetailHero({ product = null }) {
  const images = product?.images?.length
    ? product.images.map((src, idx) => ({
        id: `img-${idx}`,
        src,
        alt: `${product.name || "Product"} image ${idx + 1}`,
      }))
    : GALLERY_IMAGES;

  const [activeImage, setActiveImage] = useState(images[0] || GALLERY_IMAGES[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedSize, setSelectedSize] = useState(SIZES[2]); // Default 6.0L ($245)
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  const { addToCart, wishlist, toggleWishlist } = useStore();
  const { setCartDrawerOpen, addToast, triggerCartAnimation } = useUIStore();
  const { t } = useTranslation();

  const productName = product?.name || "Artisan Cast Iron Dutch Oven";
  const currentPrice = product?.price ? product.price : selectedSize.price;

  const productObj = {
    id: product?.id || `dutch-oven-${selectedSize.id}-${selectedColor.id}`,
    name: `${productName} (${selectedSize.capacity}, ${selectedColor.name})`,
    price: currentPrice,
    image: activeImage.src,
  };

  const isFavorite = wishlist.some(
    (item) => item.id === product?.id || item.id?.startsWith("dutch-oven")
  );

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart({
        ...productObj,
        quantity: 1,
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast(`${productObj.name} added to cart!`);
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  const categoryName = product?.category
    ? product.category.charAt(0).toUpperCase() + product.category.slice(1)
    : "Cookware";
  const categoryHref = product?.category
    ? `/products?category=${product.category}`
    : "/cookware";

  return (
    <section className="pt-20 md:pt-28 pb-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-[#71717A] mb-6">
        <Link href="/" className="hover:text-[#1C1C1E] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={categoryHref} className="hover:text-[#1C1C1E] transition-colors">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#1C1C1E] font-medium">{productName}</span>
      </nav>

      {/* Main Grid: Left Gallery, Right Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        {/* LEFT: GALLERY & THUMBNAILS */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image Container */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#F7F5F0] border border-[#EAE5DC] shadow-xs group">
            {/* Top-Left Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-block px-3.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#712B38] text-white shadow-xs">
                {t("pdp_best_seller") || "BEST SELLER"}
              </span>
            </div>

            {/* Main Product Image */}
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover object-center cursor-pointer transition-transform duration-500 group-hover:scale-105"
              onClick={() => setIsZoomModalOpen(true)}
            />

            {/* Bottom-Right Zoom Badge */}
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute bottom-4 right-4 z-10 px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-[#EAE5DC] text-[11px] font-semibold text-[#1C1C1E] flex items-center gap-1.5 shadow-sm hover:bg-white transition-all active:scale-95"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
              </svg>
              <span>Zoom</span>
            </button>
          </div>

          {/* 4 Thumbnails Below */}
          <div className="grid grid-cols-4 gap-3">
            {GALLERY_IMAGES.slice(1).map((thumb) => {
              const isActive = activeImage.id === thumb.id;
              return (
                <button
                  key={thumb.id}
                  type="button"
                  onClick={() => setActiveImage(thumb)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden bg-[#F7F5F0] border transition-all ${
                    isActive
                      ? "border-[#2D5A27] ring-2 ring-[#2D5A27]/20 shadow-xs"
                      : "border-[#EAE5DC] hover:border-gray-400 opacity-80 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={thumb.src}
                    alt={thumb.alt}
                    fill
                    sizes="120px"
                    className="object-cover object-center"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: DETAILS & SELECTION */}
        <div className="lg:col-span-5 space-y-5">
          {/* Top Subheader Tag */}
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-[0.2em] text-[#C88A58] uppercase">
            <span>{product?.subcategory || "HANDCRAFTED ENAMELED CAST IRON"}</span>
            <span>&bull;</span>
            <span className="text-[#2D5A27]">{t("pdp_lifetime_warranty") || "LIFETIME WARRANTY"}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#D48B38] font-medium tracking-tighter">
              ★★★★★
            </span>
            <span className="font-semibold text-[#1C1C1E]">{product?.rating || 4.9}</span>
            <span className="text-[#71717A]">({product?.reviewCount || 128} reviews)</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#1C1C1E] tracking-tight leading-tight">
            {productName}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-2 pb-1">
            <span className="text-2xl md:text-3xl font-serif font-semibold text-[#1C1C1E]">
              ${currentPrice.toFixed(2)}
            </span>
            <span className="text-xs text-[#71717A]">
              / {t("pdp_free_shipping") || "Free Shipping & Returns"}
            </span>
          </div>

          {/* Narrative Description */}
          <p className="text-xs md:text-sm text-[#52525B] leading-relaxed">
            {product?.description ||
              "Masterfully engineered for exceptional heat retention and self-basting circulation. Hand-enameled with three layers of vitreous porcelain for supreme durability and effortless release."}
          </p>

          {/* Color Selector */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-[#1C1C1E] block">
              {t("pdp_color") || "Color"}: <strong className="font-semibold">{selectedColor.name}</strong>
            </span>
            <div className="flex items-center gap-3">
              {COLORS.map((col) => {
                const isSelected = selectedColor.id === col.id;
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => setSelectedColor(col)}
                    aria-label={col.name}
                    className={`w-7 h-7 rounded-full transition-all flex items-center justify-center ${
                      isSelected
                        ? "ring-2 ring-offset-2 ring-[#2D5A27] scale-110"
                        : "hover:scale-105"
                    }`}
                    style={{
                      backgroundColor: col.hex,
                      border: col.border ? `1px solid ${col.border}` : "none",
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Capacity / Size Selector */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-[#1C1C1E]">{t("pdp_capacity") || "Capacity / Size"}</span>
              <button
                type="button"
                className="text-xs text-[#71717A] hover:text-[#1C1C1E] underline underline-offset-2"
              >
                Size Guide
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((sz) => {
                const isSelected = selectedSize.id === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? "border-[#2D5A27] bg-[#F4F1EA] shadow-xs"
                        : "border-[#EAE5DC] bg-white hover:border-[#D9D3C7]"
                    }`}
                  >
                    <span className="block text-xs font-bold text-[#1C1C1E]">
                      {sz.capacity}
                    </span>
                    <span className="block text-[10px] text-[#71717A] mt-0.5">
                      {sz.servings}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Add to Cart & Wishlist */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 py-3.5 px-6 rounded-xl bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-all"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <span>
                {t("pdp_add_to_cart") || "Add to Cart"} &bull; ${currentPrice.toFixed(2)}
              </span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={() => toggleWishlist(productObj)}
              aria-label="Wishlist"
              className="w-12 h-12 rounded-xl border border-[#EAE5DC] bg-white hover:bg-[#FBF9F5] flex items-center justify-center transition-all active:scale-95 shadow-xs"
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  isFavorite ? "fill-red-500 text-red-500" : "text-[#1C1C1E]"
                }`}
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#EAE5DC]">
            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#2D5A27] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
              </svg>
              <div>
                <span className="block text-xs font-semibold text-[#1C1C1E]">
                  Carbon Neutral
                </span>
                <span className="block text-[10px] text-[#71717A]">
                  Offset shipping on all orders
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <svg className="w-5 h-5 text-[#2D5A27] shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <div>
                <span className="block text-xs font-semibold text-[#1C1C1E]">
                  Lifetime Guarantee
                </span>
                <span className="block text-[10px] text-[#71717A]">
                  Built to last generations
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-4xl w-full aspect-[4/3] bg-[#F7F5F0] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              className="object-contain p-4"
            />
            <button
              type="button"
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white text-black flex items-center justify-center font-bold text-sm shadow-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
