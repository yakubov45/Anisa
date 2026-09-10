"use client";

import Link from "next/link";
import Image from "next/image";

const SERIES_ITEMS = [
  {
    id: "homestead",
    badge: "Cast Iron & Fire",
    title: "The Homestead Edit",
    description:
      "Pre-seasoned carbon steel and heavy cast iron engineered for open flame and hearth cooking.",
    productCount: "6 Products",
    image: "/images/editorial/thumb-homestead.png",
    link: "/products?category=cast-iron",
  },
  {
    id: "knife-master",
    badge: "Precision Cutlery",
    title: "The Knife Master",
    description:
      "Hand-forged Damascus steel blades paired with traditional octagonal magnolia handles.",
    productCount: "9 Products",
    image: "/images/editorial/thumb-knife.png",
    link: "/products?category=knives",
  },
  {
    id: "cellar-glass",
    badge: "Sommelier Selects",
    title: "Cellar & Glass",
    description:
      "Mouth-blown crystal glassware and hand-turned corkscrews designed for discerning palates.",
    productCount: "4 Products",
    image: "/images/editorial/thumb-cellar.png",
    link: "/products?category=glassware",
  },
];

export default function EditorialIndex() {
  return (
    <section className="py-12 md:py-20 border-t border-[#EAE5DC]">
      {/* Section Header: Left Eyebrow & Title, Right Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 md:mb-14">
        <div>
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2D5A27] uppercase block mb-1">
            CURATED SERIES
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
            The Editorial Index
          </h2>
        </div>
        <p className="text-sm md:text-base text-[#52525B] max-w-md leading-relaxed">
          Browse specialized edits crafted around distinct culinary lifestyles, ingredients, and hosting traditions.
        </p>
      </div>

      {/* 3-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {SERIES_ITEMS.map((item) => (
          <Link
            key={item.id}
            href={item.link}
            className="group bg-white rounded-2xl overflow-hidden border border-[#E8E3D9] shadow-sm hover:shadow-card-hover transition-all duration-300 flex flex-col"
          >
            {/* Thumbnail Image with Top-Left Badge */}
            <div className="relative w-full aspect-[16/10] bg-[#EFECE6] overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
              />
              {/* Badge Tag */}
              <div className="absolute top-3 left-3">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium tracking-wide bg-black/50 backdrop-blur-md text-white border border-white/20">
                  {item.badge}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-serif font-medium text-[#1C1C1E] group-hover:text-[#2D5A27] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#F4F1EA] flex items-center justify-between text-xs md:text-sm">
                <span className="text-[#71717A] font-normal">
                  {item.productCount}
                </span>
                <span className="font-semibold text-[#2D5A27] inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Explore <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
