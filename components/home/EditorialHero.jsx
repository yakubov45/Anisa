"use client";

import Link from "next/link";
import Image from "next/image";

export default function EditorialHero() {
  return (
    <section className="relative w-full overflow-hidden pt-20 md:pt-28 pb-20 md:pb-32 bg-[#FBF9F5]">
      {/* Background Image Container with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/editorial/hero-crop.png"
          alt="Rustic kitchen culinary experience"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />
        {/* Soft atmospheric overlay for text contrast while preserving the rustic photography */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-white/20 to-[#FBF9F5]" />
        
        {/* Bottom smooth fade to match body background #FBF9F5 */}
        <div className="absolute bottom-0 inset-x-0 h-36 md:h-48 bg-gradient-to-t from-[#FBF9F5] via-[#FBF9F5]/80 to-transparent" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pt-8 md:pt-16">
        {/* Pill Badge */}
        <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#D9D3C7]/60 shadow-sm mb-6 transition-all duration-300 hover:bg-white">
          <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#3B5B30] uppercase">
            EDITORIAL CURATIONS
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[4rem] font-serif font-normal text-[#1A1A1A] tracking-tight leading-[1.15] mb-5 drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
          The Art of the Gathered Table
        </h1>

        {/* Hero Description */}
        <p className="text-sm sm:text-base md:text-lg text-[#333333] max-w-2xl mx-auto leading-relaxed mb-8 font-normal drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
          Explore thoughtfully curated collections designed to bridge professional gastronomy with domestic tranquility. Each series tells a story of materiality, heritage, and intentional design.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="#collections"
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-[#2D5A27] text-white text-sm md:text-base font-medium shadow-sm hover:bg-[#23471F] hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Explore Collections
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-7 py-3 rounded-lg bg-white/90 hover:bg-white text-[#1C1C1E] text-sm md:text-base font-medium border border-[#E0DBD2] shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
          >
            Shop The Look
          </Link>
        </div>
      </div>
    </section>
  );
}
