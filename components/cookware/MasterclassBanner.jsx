"use client";

import Link from "next/link";
import Image from "next/image";

export default function MasterclassBanner() {
  return (
    <section className="my-14 md:my-20">
      <div className="relative rounded-3xl overflow-hidden border border-[#EAE5DC] shadow-sm bg-[#F4F1EA]">
        {/* Background Image with Warm Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/editorial/masterclass-banner.png"
            alt="Michelin chef culinary masterclass"
            fill
            sizes="100vw"
            className="object-cover object-center opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4F1EA] via-[#F4F1EA]/85 to-transparent" />
        </div>

        {/* Banner Content Grid */}
        <div className="relative z-10 p-8 sm:p-10 md:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-5">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#EAF0E7] border border-[#D5E2D1] shadow-xs">
              <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-[#2D5A27] uppercase">
                MASTERCLASS EDITION
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
              The Essential Chef&apos;s Set
            </h2>

            {/* Narrative Description */}
            <p className="text-xs sm:text-sm md:text-base text-[#52525B] leading-relaxed max-w-lg">
              A curated ensemble of our most celebrated instruments. Crafted for those who approach cooking not merely as a task, but as a daily ritual of creativity and mindfulness.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products?collection=masterclass"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs md:text-sm font-semibold shadow-xs active:scale-95 transition-all"
              >
                <span>Discover the Set</span>
                <span>&rarr;</span>
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white hover:bg-[#FBF9F5] text-[#1C1C1E] text-xs md:text-sm font-semibold border border-[#E0DBD2] shadow-xs active:scale-95 transition-all"
              >
                Read Editorial Note
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Photo Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-[420px] aspect-[16/10] rounded-2xl overflow-hidden shadow-card border border-[#EAE5DC] bg-white group">
              <Image
                src="/images/editorial/masterclass-card.png"
                alt="Essential Chef Set"
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
