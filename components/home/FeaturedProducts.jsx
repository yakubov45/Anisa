"use client";

import { useState } from "react";
import Image from "next/image";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";

export default function FeaturedProducts({ initialProducts = [] }) {
  const [activeTab, setActiveTab] = useState("all");
  const { addToCart } = useStore();
  const { setCartDrawerOpen, addToast, triggerCartAnimation } = useUIStore();

  // State to track selected variant per product
  const [selectedVariants, setSelectedVariants] = useState({});

  // Filter products by tab
  const filteredProducts = initialProducts.filter((p) => {
    if (activeTab === "all") return true;
    const cat = (p.category || "").toLowerCase();
    if (activeTab === "cookware") return cat.includes("cookware");
    if (activeTab === "knives") return cat.includes("knive") || cat.includes("knife");
    return true;
  });

  const handleSelectVariant = (productId, variant) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [productId]: variant,
    }));
  };

  const handleQuickAdd = (product) => {
    const selectedVariant = selectedVariants[product.id] || (product.variants?.[0] || null);
    const finalPrice = selectedVariant?.price || product.price || product.basePrice || 240;

    if (addToCart) {
      addToCart({
        id: selectedVariant ? `${product.id}-${selectedVariant.id || selectedVariant.label}` : product.id,
        name: selectedVariant ? `${product.name || product.title} (${selectedVariant.label})` : (product.name || product.title),
        price: finalPrice,
        image: product.image || product.primaryImage || "/images/editorial/prod-stockpot.png",
        quantity: 1,
      });
    }

    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) {
      addToast(`${product.name || product.title} added to cart`);
    }
    if (setCartDrawerOpen) {
      setCartDrawerOpen(true);
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "cookware", label: "Cookware" },
    { id: "knives", label: "Knives" },
  ];

  return (
    <section className="py-12 md:py-20 border-t border-[#EAE5DC]">
      {/* Top Header Row with Title and Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 md:mb-12">
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2D5A27] uppercase block mb-1">
            HANDPICKED QUALITY
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
            Featured Products
          </h2>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1 bg-[#F4F1EA] rounded-full border border-[#E8E3D9]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-[#1C1C1E] font-semibold shadow-xs"
                  : "text-[#71717A] hover:text-[#1C1C1E]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {filteredProducts.map((product) => {
          const variants = product.variants || [];
          const activeVariant = selectedVariants[product.id] || variants[0] || null;
          const currentPrice = activeVariant?.price || product.price || product.basePrice || 240;
          const badgeText = product.badge || (product.category === "knives" ? "HANDCRAFTED" : "18/10 STAINLESS STEEL");

          return (
            <div
              key={product.id}
              className="bg-white rounded-3xl border border-[#EAE5DC] p-5 flex flex-col justify-between shadow-xs hover:shadow-card-hover transition-all duration-300 group"
            >
              {/* Image Box with Top-Left Badge */}
              <div className="relative w-full aspect-[4/3] bg-[#F7F5F0] rounded-2xl overflow-hidden flex items-center justify-center p-6 mb-5">
                {/* Badge */}
                <div className="absolute top-3.5 left-3.5 z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#8C5930] text-white shadow-xs">
                    {badgeText}
                  </span>
                </div>

                {/* Centered Product Image from Backend */}
                <div className="relative w-full h-full">
                  <Image
                    src={product.image || product.primaryImage || "/images/editorial/prod-stockpot.png"}
                    alt={product.name || product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-contain transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-[#D48B38] text-sm tracking-tighter">
                      {"★".repeat(Math.round(product.rating || 5))}
                    </span>
                    <span className="text-xs text-[#71717A] font-normal ml-1">
                      ({product.reviewCount || 48})
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-serif text-[#1C1C1E] font-medium leading-snug group-hover:text-[#2D5A27] transition-colors mb-1.5">
                    {product.name || product.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs md:text-sm text-[#52525B] leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                {/* Variant / Size Selectors */}
                {variants.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {variants.map((v, i) => {
                      const isSelected = activeVariant?.label === v.label || (!activeVariant && i === 0);
                      return (
                        <button
                          key={v.label || i}
                          type="button"
                          onClick={() => handleSelectVariant(product.id, v)}
                          className={`px-3 py-1 rounded-lg text-xs transition-all ${
                            isSelected
                              ? "bg-[#F4F1EA] text-[#1C1C1E] font-semibold border border-[#D9D3C7]"
                              : "text-[#71717A] border border-transparent hover:border-[#EAE5DC]"
                          }`}
                        >
                          {v.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Card Footer: Price & Quick Add */}
                <div className="pt-4 border-t border-[#F4F1EA] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider block font-sans">
                      Price
                    </span>
                    <span className="text-base md:text-lg font-serif font-semibold text-[#1C1C1E]">
                      ${Number(currentPrice).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleQuickAdd(product)}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
                  >
                    <svg
                      className="w-3.5 h-3.5"
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
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
