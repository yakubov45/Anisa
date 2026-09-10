"use client";

import { useRef } from "react";
import Image from "next/image";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

const PAIRED_PRODUCTS = [
  {
    id: "paired-walnut-cutting-board",
    name: "End-Grain Walnut Cutting Board",
    transKey: "paired_prod_board",
    category: "ACCESSORIES",
    price: 95.0,
    badge: "Bestseller",
    badgeType: "terracotta",
    image: "/images/editorial/paired-cutting-board.png",
  },
  {
    id: "paired-washed-linen-apron",
    name: "Washed Linen Kitchen Apron",
    transKey: "paired_prod_apron",
    category: "TEXTILES",
    price: 65.0,
    badge: null,
    image: "/images/editorial/paired-linen-apron.png",
  },
  {
    id: "paired-copper-saucier-2l",
    name: "Hand-Hammered Copper Saucier",
    transKey: "paired_prod_saucier",
    category: "COOKWARE",
    price: 210.0,
    badge: "New",
    badgeType: "terracotta",
    image: "/images/editorial/paired-copper-saucier.png",
  },
];

export default function FrequentlyPaired() {
  const scrollRef = useRef(null);
  const { t } = useTranslation();
  const { addToCart } = useStore();
  const { addToast, triggerCartAnimation, setCartDrawerOpen } = useUIStore();

  const handleAdd = (product) => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast(`${product.name} added to cart!`);
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 320;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-8 pb-20 border-t border-[#EAE5DC]">
      {/* Header with Title and Nav Arrows */}
      <div className="flex items-end justify-between mb-8">
        <div className="space-y-1.5">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C88A58] uppercase block">
            {t("paired_tag") || "COMPLETE YOUR KITCHEN"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1C1E] font-normal tracking-tight">
            {t("paired_title") || "Frequently Paired Together"}
          </h2>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Previous items"
            className="w-9 h-9 rounded-full border border-[#D9D3C7] bg-white hover:bg-[#F4F1EA] text-[#1C1C1E] flex items-center justify-center transition-colors shadow-2xs active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Next items"
            className="w-9 h-9 rounded-full border border-[#D9D3C7] bg-white hover:bg-[#F4F1EA] text-[#1C1C1E] flex items-center justify-center transition-colors shadow-2xs active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3 Product Cards Grid */}
      <div
        ref={scrollRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-none"
      >
        {PAIRED_PRODUCTS.map((prod) => {
          const prodTitle = (prod.transKey && t(prod.transKey)) || prod.name;
          const badgeText =
            prod.badge === "Bestseller"
              ? t("paired_badge_bestseller") || "Bestseller"
              : prod.badge === "New"
              ? t("paired_badge_new") || "New"
              : prod.badge;

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-5 border border-[#EAE5DC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Badge */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#F7F5F0] mb-4 border border-[#EAE5DC]/60">
                  {prod.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#8C5930] text-white shadow-xs">
                        {badgeText}
                      </span>
                    </div>
                  )}

                  <Image
                    src={prod.image}
                    alt={prodTitle}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] text-[#8C5930] uppercase font-bold tracking-wider block">
                    {prod.category}
                  </span>
                  <h3 className="text-base font-serif font-medium text-[#1C1C1E] leading-snug group-hover:text-[#2D5A27] transition-colors">
                    {prodTitle}
                  </h3>
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1C1C1E] block pt-1">
                    ${prod.price.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => handleAdd(prod)}
                className="w-full bg-[#F4F1EA] hover:bg-[#EAE5DC] text-[#1C1C1E] border border-[#EAE5DC] hover:border-[#D9D3C7] rounded-xl py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-98 shadow-2xs"
              >
                <span>{t("paired_add_to_cart") || "+ Add to Cart"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
