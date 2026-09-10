"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

const COLLECTIONS_DATA = [
  {
    id: "tuscan-hearth-suite",
    name: "The Tuscan Kitchen Suite",
    category: "cast-iron",
    badge: "SIGNATURE SUITE",
    pieces: "24 Pieces",
    price: 640.0,
    originalPrice: 750.0,
    image: "/images/editorial/collection-01-full.png",
    subtitle: "Cast Iron • Terracotta • Olivewood",
    description:
      "Hand-enameled Dutch ovens and rustic clay pieces designed for slow-cooked Mediterranean dinners and long gatherings under the pergola.",
    items: [
      "5.5L Enameled Dutch Oven",
      "28cm Cast Iron Skillet",
      "Terracotta Serving Bowl",
      "Carved Olivewood Spoons",
    ],
  },
  {
    id: "japanese-knife-mastercraft",
    name: "Japanese Knife Mastercraft Suite",
    category: "knives",
    badge: "CHEF'S MASTERWORK",
    pieces: "14 Pieces",
    price: 580.0,
    originalPrice: 680.0,
    image: "/images/editorial/cat-card-knives.png",
    subtitle: "67-Layer Damascus • Walnut • Honing Steel",
    description:
      "Forged with high-carbon VG-10 steel by master bladesmiths. Perfectly balanced for effortless paper-thin precision slicing.",
    items: [
      "180mm Tsuchime Santoku",
      "210mm Gyuto Chef Knife",
      "End-Grain Walnut Butcher Block",
      "Ceramic Honing Rod",
    ],
  },
  {
    id: "kyoto-serenity-suite",
    name: "Kyoto Serenity & Zen Dining",
    category: "ceramics",
    badge: "WABI-SABI ARTISAN",
    pieces: "18 Pieces",
    price: 320.0,
    originalPrice: 365.0,
    image: "/images/editorial/collection-03-full.png",
    subtitle: "High-Fired Stoneware • Reactive Glaze • Matcha",
    description:
      "Earthy, tactile dinnerware celebrating natural imperfections, paired with a ceremonial bamboo tea ceremony set.",
    items: [
      "12-Piece Reactive Glaze Stoneware",
      "Ceremonial Matcha Chawan Bowl",
      "Bamboo Whisk (Chasen)",
      "Ceramic Spoon Rests",
    ],
  },
  {
    id: "modern-baker-suite",
    name: "The Modern Baker Suite",
    category: "cast-iron",
    badge: "HERITAGE ESSENTIAL",
    pieces: "12 Pieces",
    price: 380.0,
    originalPrice: 445.0,
    image: "/images/editorial/collection-02-full.png",
    subtitle: "Bread Ovens • Proofing Banneton • French Pins",
    description:
      "Engineered for sourdough artisans craving blistered, crackling crusts and open airy crumb structures.",
    items: [
      "Cast Iron Bread Cloche Oven",
      "Rattan Oval Proofing Basket",
      "Tapered French Rolling Pin",
      "Brass Sourdough Lame",
    ],
  },
  {
    id: "linen-hearth-textiles",
    name: "Linen & Hearth Textiles Suite",
    category: "linen",
    badge: "ORGANIC LIVING",
    pieces: "8 Pieces",
    price: 185.0,
    originalPrice: 210.0,
    image: "/images/editorial/paired-linen-apron.png",
    subtitle: "100% Washed French Linen • Earthy Dyes",
    description:
      "Pre-washed European flax linens that grow softer with every wash, bringing quiet tactile warmth to your dining room.",
    items: [
      "Washed Linen Kitchen Apron",
      "4x Milled Hearth Napkins",
      "Woven Flax Table Runner",
      "Cast Iron Artisan Trivet",
    ],
  },
  {
    id: "french-provencal-copper",
    name: "French Provençal Copper Suite",
    category: "cast-iron",
    badge: "HEIRLOOM QUALITY",
    pieces: "10 Pieces",
    price: 620.0,
    originalPrice: 730.0,
    image: "/images/editorial/cat-prod-copper.png",
    subtitle: "99.9% Pure Copper • Stainless Lining • Cast Bronze",
    description:
      "Unmatched instantaneous thermal control for delicate reductions, velvety sauces, and exquisite culinary presentation.",
    items: [
      "2.0L Hand-Hammered Saucier",
      "24cm Heavy Copper Skillet",
      "Natural Copper Polish Kit",
      "Cherrywood Tasting Paddle",
    ],
  },
];

export default function CollectionsHero() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { t } = useTranslation();
  const { addToCart } = useStore();
  const { addToast, triggerCartAnimation, setCartDrawerOpen } = useUIStore();

  const filterTabs = [
    { id: "all", label: t("filter_all_collections") || "All Collections" },
    { id: "cast-iron", label: t("filter_heritage_cast_iron") || "Heritage Cast Iron" },
    { id: "knives", label: t("filter_knife_mastercraft") || "Japanese Knife Mastercraft" },
    { id: "ceramics", label: t("filter_kyoto_ceramics") || "Kyoto Ceramics" },
    { id: "linen", label: t("filter_linen_hearth") || "Linen & Hearth" },
  ];

  const filteredCollections = COLLECTIONS_DATA.filter((col) => {
    if (activeFilter === "all") return true;
    return col.category === activeFilter;
  });

  const handleAddSuite = (col) => {
    if (addToCart) {
      addToCart({
        id: col.id,
        name: col.name,
        price: col.price,
        image: col.image,
        quantity: 1,
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast(`${col.name} added to cart!`);
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  return (
    <section className="pt-20 md:pt-28 pb-16 space-y-12">
      {/* 1. EDITORIAL HEADER & PHILOSOPHY BANNER */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <span className="text-[11px] font-bold tracking-[0.25em] text-[#C88A58] uppercase block">
          {t("collections_tag") || "CURATED LIVING & CULINARY SUITES"}
        </span>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1C1E] font-normal tracking-tight leading-tight">
          {t("collections_title") || "Curated Living & Culinary Suites"}
        </h1>

        {/* Philosophy Block with Decorative Serif Quote */}
        <div className="pt-3 pb-2 max-w-2xl mx-auto">
          <div className="relative px-6 sm:px-10 py-4 rounded-2xl bg-[#F5F2EA] border border-[#EAE5DC] shadow-2xs">
            <span className="absolute top-2 left-3 font-serif text-3xl text-[#8C5930]/30 leading-none">
              &ldquo;
            </span>
            <p className="text-xs sm:text-sm text-[#52525B] font-serif italic leading-relaxed text-center">
              {t("collections_philosophy") ||
                "Har bir to'plam shunchaki idishlar emas, balki mehmondo'stlik, oilaviy jamlanish va taom tayyorlash madaniyatini ifodalaydi."}
            </p>
            <span className="absolute bottom-1 right-3 font-serif text-3xl text-[#8C5930]/30 leading-none">
              &rdquo;
            </span>
          </div>
        </div>
      </div>

      {/* 2. QUICK FILTER PILLS */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-2">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all shadow-2xs ${
                isActive
                  ? "bg-[#1B3B18] text-white shadow-xs"
                  : "bg-white text-[#52525B] hover:text-[#1C1C1E] border border-[#EAE5DC] hover:border-[#D9D3C7]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 3. COLLECTIONS SHOWCASE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCollections.map((col) => {
          return (
            <div
              key={col.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#EAE5DC] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Visual Image Header */}
                <div className="relative aspect-[16/10] bg-[#F7F5F0] overflow-hidden">
                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#1B3B18] text-white shadow-xs">
                      {col.badge}
                    </span>
                  </div>

                  {/* Piece Count Pill */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[#1C1C1E] border border-[#EAE5DC] shadow-xs">
                      {col.pieces}
                    </span>
                  </div>

                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                {/* Content Details */}
                <div className="p-6 space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold tracking-wider uppercase text-[#8C5930] block">
                      {col.subtitle}
                    </span>
                    <h3 className="text-xl font-serif text-[#1C1C1E] font-medium leading-snug group-hover:text-[#2D5A27] transition-colors">
                      {col.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed line-clamp-2">
                    {col.description}
                  </p>

                  {/* Included Items Tag List */}
                  <div className="pt-2 border-t border-[#F4F1EA] space-y-1.5">
                    <span className="text-[10px] font-bold tracking-wider text-[#71717A] uppercase block">
                      Suite Includes:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {col.items.map((it, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-[#FBF9F5] border border-[#EAE5DC] text-[10px] text-[#52525B]"
                        >
                          {it}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer: Pricing & Actions */}
              <div className="p-6 pt-0 border-t border-[#F4F1EA] mt-4 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg sm:text-xl font-serif font-bold text-[#1C1C1E]">
                      ${col.price.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#A1A1AA] line-through">
                      ${col.originalPrice.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#2D5A27] font-semibold block">
                    Complete Suite Bundle
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddSuite(col)}
                    className="py-2.5 px-4 rounded-xl bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>{t("pdp_add_to_cart") || "Add Suite"}</span>
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
