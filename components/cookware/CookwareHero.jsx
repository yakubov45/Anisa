"use client";

import Link from "next/link";
import Image from "next/image";

export default function CookwareHero() {
  return (
    <section className="pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Text & Stats */}
        <div className="lg:col-span-7 space-y-6">
          {/* Eyebrow Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF0E7] border border-[#D5E2D1] shadow-xs">
            {/* Compass / Star Icon */}
            <svg
              className="w-3.5 h-3.5 text-[#2D5A27]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <span className="text-[11px] md:text-xs font-semibold tracking-[0.2em] text-[#2D5A27] uppercase">
              ARTISANAL GASTRONOMY
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#1C1C1E] tracking-tight leading-[1.18]">
            Elevate Your Culinary Experience
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-[#52525B] leading-relaxed max-w-xl font-normal">
            Bridging professional gastronomy and domestic tranquility through exceptional artisanal kitchenware designed to last a lifetime.
          </p>

          {/* Dual Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <Link
              href="#catalog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs md:text-sm font-semibold shadow-xs active:scale-95 transition-all"
            >
              <span>Explore Catalog</span>
              <span>&rarr;</span>
            </Link>

            <Link
              href="#categories"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white hover:bg-[#FBF9F5] text-[#1C1C1E] text-xs md:text-sm font-semibold border border-[#E0DBD2] shadow-xs active:scale-95 transition-all"
            >
              View Curated Sets
            </Link>
          </div>

          {/* 3 Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-md border-t border-[#EAE5DC]/80">
            <div>
              <span className="block text-base md:text-lg font-serif font-semibold text-[#1C1C1E]">
                100%
              </span>
              <span className="text-xs text-[#71717A] mt-0.5 block">
                Handcrafted
              </span>
            </div>
            <div>
              <span className="block text-base md:text-lg font-serif font-semibold text-[#1C1C1E]">
                Lifetime
              </span>
              <span className="text-xs text-[#71717A] mt-0.5 block">
                Warranty
              </span>
            </div>
            <div>
              <span className="block text-base md:text-lg font-serif font-semibold text-[#1C1C1E]">
                4.9 / 5.0
              </span>
              <span className="text-xs text-[#71717A] mt-0.5 block">
                Chef Reviews
              </span>
            </div>
          </div>
        </div>

        {/* Right: Large Image Card with Floating Info Tag */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-[#EAE5DC] bg-[#F7F5F0] group">
            <Image
              src="/images/editorial/cookware-hero-card.png"
              alt="The Milan Series Casserole"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 500px"
              className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
            />

            {/* Bottom Floating Info Pill */}
            <div className="absolute bottom-4 inset-x-4 p-3.5 bg-[#F4F1EA]/95 backdrop-blur-md rounded-2xl border border-white/80 shadow-md flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2D5A27]/15 flex items-center justify-center shrink-0">
                <svg
                  className="w-4 h-4 text-[#2D5A27]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-semibold text-[#1C1C1E] truncate">
                  The Milan Series Casserole
                </h4>
                <p className="text-[11px] text-[#71717A] truncate">
                  Featured in Michelin-starred test kitchens
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
