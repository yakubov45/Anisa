"use client";

import Link from "next/link";

export default function CulinaryJournal() {
  return (
    <section className="w-full bg-[#1B3B18] text-white py-16 md:py-24 px-6 my-12 md:my-16 rounded-3xl overflow-hidden relative shadow-lg">
      <div className="max-w-3xl mx-auto text-center space-y-6">
        {/* Eyebrow */}
        <span className="text-xs md:text-sm font-semibold tracking-[0.25em] text-[#8DBA86] uppercase block">
          CULINARY JOURNAL
        </span>

        {/* Quote */}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2rem] font-serif text-white font-normal leading-relaxed tracking-tight">
          &ldquo;The kitchen is the heart not merely of the home, but of human connection.&rdquo;
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-[#DCE8DA]/90 max-w-xl mx-auto leading-relaxed">
          Read our quarterly print edition featuring interviews with Michelin-starred chefs, artisan potters in Kyoto, and essays on domestic slowness.
        </p>

        {/* Button */}
        <div className="pt-2">
          <Link
            href="/about"
            className="inline-flex items-center justify-center px-7 py-2.5 rounded-lg bg-white text-[#1C1C1E] text-xs md:text-sm font-semibold shadow-sm hover:bg-[#FBF9F5] transition-all duration-200 active:scale-95"
          >
            Read The Journal
          </Link>
        </div>
      </div>
    </section>
  );
}
