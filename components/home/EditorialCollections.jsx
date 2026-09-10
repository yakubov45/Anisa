"use client";

import Link from "next/link";
import Image from "next/image";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";

const COLLECTIONS = [
  {
    id: "tuscan-kitchen",
    collectionNumber: "COLLECTION 01",
    theme: "SEASONAL RELEASE",
    title: "The Tuscan Kitchen",
    description:
      "Inspired by sun-drenched farmhouses in Val d'Orcia, this collection brings earthy terracotta, heavy-gauge copper, and hand-glazed ceramics to your culinary space. Designed for slow-simmered ragùs, rustic bread baking, and gatherings that stretch long past twilight.",
    stats: [
      { value: "12", label: "Handcrafted Pieces" },
      { value: "100%", label: "Recycled Copper" },
      { value: "Arezzo", label: "Forged Origin" },
    ],
    ctaText: "Discover The Tuscan Kitchen",
    ctaLink: "/products?collection=tuscan",
    product: {
      name: "Signature Copper Set",
      priceDisplay: "From $480",
      price: 480,
      image: "/images/editorial/card-copper.png",
    },
    imageLeft: false, // Right side
  },
  {
    id: "modern-baker",
    collectionNumber: "COLLECTION 02",
    theme: "PRECISION & CRAFT",
    title: "Modern Baker Essentials",
    description:
      "Purity of form meets structural precision. Crafted for the rigorous demands of sourdough artisans and pastry chefs alike. Featuring unglazed French porcelain mixing bowls, weighted French rolling pins, and precise Danish dough whisks.",
    stats: [
      { value: "5 pcs", label: "Essential Suite" },
      { value: "Grade A", label: "French Oak" },
      { value: "Lifetime", label: "Craft Warranty" },
    ],
    ctaText: "Explore Modern Baker",
    ctaLink: "/products?collection=baker",
    product: {
      name: "Artisan Baking Kit",
      priceDisplay: "From $220",
      price: 220,
      image: "/images/editorial/card-baker.png",
    },
    imageLeft: true, // Left side
  },
  {
    id: "zen-dining",
    collectionNumber: "COLLECTION 03",
    theme: "MINDFUL RITUALS",
    title: "Zen Dining & Tea",
    description:
      "Rooted in wabi-sabi philosophy, this collection honors imperfection and quiet elegance. Hand-thrown stoneware teapots with bamboo handles, reactive glazed dinner plates, and organic linen runners designed to quiet the mind before the first bite.",
    stats: [
      { value: "Kyoto", label: "Design Influence" },
      { value: "Matte", label: "Reactive Glaze" },
      { value: "Lead-Free", label: "Non-Toxic Mineral" },
    ],
    ctaText: "Discover Zen Dining",
    ctaLink: "/products?collection=zen",
    product: {
      name: "Ceremonial Tea Set",
      priceDisplay: "From $310",
      price: 310,
      image: "/images/editorial/card-tea.png",
    },
    imageLeft: false, // Right side
  },
];

export default function EditorialCollections() {
  const { addToCart } = useStore();
  const { setCartDrawerOpen, addToast } = useUIStore();

  const handleQuickView = (product) => {
    if (addToCart) {
      addToCart({
        id: product.name.toLowerCase().replace(/\s+/g, "-"),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      });
      if (addToast) addToast(`${product.name} added to cart`);
      if (setCartDrawerOpen) setCartDrawerOpen(true);
    }
  };

  return (
    <section id="collections" className="py-12 md:py-20 space-y-24 md:space-y-36">
      {COLLECTIONS.map((col, idx) => (
        <div
          key={col.id}
          className={`flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 ${
            col.imageLeft ? "lg:flex-row-reverse" : ""
          }`}
        >
          {/* Text & Stats Content */}
          <div className="w-full lg:w-1/2 space-y-6">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-xs md:text-sm font-medium tracking-[0.2em] text-[#C88A58] uppercase">
                {col.collectionNumber} — {col.theme}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
              {col.title}
            </h2>

            {/* Narrative Description */}
            <p className="text-sm md:text-base text-[#52525B] leading-relaxed max-w-xl">
              {col.description}
            </p>

            {/* 3 Stat Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              {col.stats.map((stat, i) => (
                <div
                  key={i}
                  className="bg-[#F4F1EA]/90 border border-[#E8E3D9] rounded-xl p-3 md:p-4 flex flex-col justify-center transition-all hover:bg-[#EFEBE2]"
                >
                  <span className="text-base md:text-lg font-bold text-[#1C1C1E] leading-snug">
                    {stat.value}
                  </span>
                  <span className="text-[11px] md:text-xs text-[#71717A] mt-0.5 leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Link */}
            <div className="pt-2">
              <Link
                href={col.ctaLink}
                className="group inline-flex items-center gap-2 text-sm md:text-base font-medium text-[#2D5A27] hover:text-[#23471F] transition-all"
              >
                <span>{col.ctaText}</span>
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </div>
          </div>

          {/* Product Image Card with Floating Info Badge */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] group bg-[#EFECE6]">
              {/* Product Image */}
              <Image
                src={col.product.image}
                alt={col.product.name}
                fill
                sizes="(max-width: 768px) 100vw, 420px"
                className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 inset-x-4 p-3.5 bg-[#F4F1EA]/95 backdrop-blur-md rounded-xl border border-white/60 shadow-lg flex items-center justify-between transition-all duration-300 group-hover:bg-white/95">
                <div>
                  <h4 className="text-sm font-semibold text-[#1C1C1E]">
                    {col.product.name}
                  </h4>
                  <p className="text-xs text-[#71717A]">
                    {col.product.priceDisplay}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleQuickView(col.product)}
                  className="px-4 py-1.5 rounded-lg bg-[#2D5A27] text-white text-xs font-medium hover:bg-[#23471F] transition-colors shadow-sm active:scale-95"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
