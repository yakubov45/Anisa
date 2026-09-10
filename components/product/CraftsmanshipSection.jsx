"use client";

import Image from "next/image";

export default function CraftsmanshipSection() {
  return (
    <section className="py-12 md:py-20 border-t border-[#EAE5DC]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left: Text & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2D5A27] uppercase block">
            CRAFTSMANSHIP &amp; DESIGN
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight leading-tight">
            Uncompromising Thermal Dynamics &amp; Aesthetic Grace
          </h2>

          <p className="text-xs md:text-sm text-[#52525B] leading-relaxed">
            Each Dutch oven is poured into an individual sand mold, ensuring a unique artisan pedigree. The heavy-weight, spike-lined lid continuously redirects moisture back onto food for tender, succulent results every single time.
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE5DC]">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#1C1C1E]">
                Oven Safe
              </h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Withstands temperatures up to 500&deg;F (260&deg;C) including stainless knob.
              </p>
            </div>

            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-[#1C1C1E]">
                Hob Compatibility
              </h4>
              <p className="text-xs text-[#71717A] leading-relaxed">
                Fully compatible with induction, gas, electric, and ceramic glass cooktops.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Large Chef Cooking Image */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-sm border border-[#EAE5DC] bg-[#F7F5F0]">
            <Image
              src="/images/editorial/pdp-chef-craftsmanship.png"
              alt="Chef cooking with Artisan Cast Iron Dutch Oven"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
