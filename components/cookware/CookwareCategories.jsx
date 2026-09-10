"use client";

import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    id: "cookware",
    tag: "ESSENTIAL",
    title: "Cookware",
    description: "Multi-ply stainless steel & copper tri-ply pans.",
    linkText: "Shop Cookware",
    href: "/products?category=cookware",
    image: "/images/editorial/cat-card-cookware.png",
  },
  {
    id: "knives",
    tag: "PRECISION",
    title: "Artisan Knives",
    description: "Hand-forged Damascus steel & santoku blades.",
    linkText: "Shop Knives",
    href: "/products?category=knives",
    image: "/images/editorial/cat-card-knives.png",
  },
  {
    id: "tableware",
    tag: "TABLETOP",
    title: "Ceramic Plates",
    description: "Glazed stoneware crafted by master artisans.",
    linkText: "Shop Tableware",
    href: "/products?category=tableware",
    image: "/images/editorial/cat-card-tableware.png",
  },
  {
    id: "rituals",
    tag: "RITUAL",
    title: "Coffee & Tea",
    description: "Pour-over sets, kettles & ceremonial teaware.",
    linkText: "Shop Rituals",
    href: "/products?category=tea",
    image: "/images/editorial/cat-card-tea.png",
  },
];

export default function CookwareCategories() {
  return (
    <section id="categories" className="py-12 md:py-20 border-t border-[#EAE5DC]">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2D5A27] uppercase block mb-1">
            CURATED COLLECTIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#1C1C1E] font-normal tracking-tight">
            Explore by Category
          </h2>
        </div>

        <Link
          href="/products"
          className="text-xs font-semibold text-[#1C1C1E] hover:text-[#2D5A27] transition-colors flex items-center gap-1 group shrink-0"
        >
          <span>View All Categories</span>
          <span className="transform transition-transform duration-200 group-hover:translate-x-0.5">&gt;</span>
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group bg-[#F7F5F0] border border-[#EAE5DC] flex flex-col justify-end p-5"
          >
            {/* Background Image */}
            <Image
              src={cat.image}
              alt={cat.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            />

            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />

            {/* Foreground Content */}
            <div className="relative z-20 space-y-2">
              {/* Badge */}
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#2D5A27]/90 text-white backdrop-blur-xs">
                  {cat.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base md:text-lg font-serif font-medium text-white tracking-tight">
                {cat.title}
              </h3>

              {/* Subtitle */}
              <p className="text-xs text-white/80 leading-relaxed line-clamp-2">
                {cat.description}
              </p>

              {/* Link */}
              <div className="pt-1 flex items-center gap-1.5 text-xs font-semibold text-white group-hover:text-[#8DBA86] transition-colors">
                <span>{cat.linkText}</span>
                <span className="transform transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
