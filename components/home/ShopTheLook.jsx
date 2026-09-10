"use client";

import { useState } from "react";
import Image from "next/image";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";

const VIGNETTE_ITEMS = [
  {
    id: "solid-brass-faucet",
    name: "Solid Brass Faucet",
    price: 640,
    priceDisplay: "$640",
    image: "/images/editorial/thumb-faucet.png",
    // Position percentage on the kitchen image
    top: "58%",
    left: "53%",
  },
  {
    id: "enamelled-dutch-oven",
    name: "Enamelled Dutch Oven",
    price: 320,
    priceDisplay: "$320",
    image: "/images/editorial/thumb-dutch-oven.png",
    top: "57%",
    left: "23.5%",
  },
  {
    id: "walnut-knife-block",
    name: "Walnut Knife Block",
    price: 280,
    priceDisplay: "$280",
    image: "/images/editorial/thumb-knife-block.png",
    top: "68%",
    left: "41.5%",
  },
];

export default function ShopTheLook() {
  const [activeItem, setActiveItem] = useState(null);
  const { addToCart } = useStore();
  const { setCartDrawerOpen, addToast, triggerCartAnimation } = useUIStore();

  const handleAddItem = (item) => {
    if (addToCart) {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast(`${item.name} added to cart`);
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  const handleAddAll = () => {
    if (addToCart) {
      VIGNETTE_ITEMS.forEach((item) => {
        addToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
        });
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast("Entire kitchen vignette added to cart!");
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  const totalPrice = VIGNETTE_ITEMS.reduce((sum, i) => sum + i.price, 0);

  return (
    <section className="py-12 md:py-20 border-t border-[#EAE5DC]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
        <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#C88A58] uppercase block mb-1">
          INTERACTIVE SHOWCASE
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight mb-3">
          Shop The Look
        </h2>
        <p className="text-xs md:text-sm text-[#52525B] leading-relaxed">
          Hover over the curated kitchen vignette to discover individual pieces styled by our lead culinary designers.
        </p>
      </div>

      {/* Showcase Grid: Left Image with Hotspots, Right Pieces List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Interactive Image */}
        <div className="lg:col-span-8 relative aspect-[16/10] bg-[#EFECE6] rounded-3xl overflow-hidden shadow-sm border border-[#EAE5DC]">
          <Image
            src="/images/editorial/kitchen-vignette.png"
            alt="Curated kitchen vignette"
            fill
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover object-center"
          />

          {/* Interactive Pins */}
          {VIGNETTE_ITEMS.map((item) => {
            const isHovered = activeItem === item.id;
            return (
              <div
                key={item.id}
                style={{ top: item.top, left: item.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                onMouseEnter={() => setActiveItem(item.id)}
                onMouseLeave={() => setActiveItem(null)}
              >
                {/* Pin Button */}
                <button
                  type="button"
                  onClick={() => handleAddItem(item)}
                  aria-label={item.name}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-white text-xs font-bold transition-all shadow-md ${
                    isHovered
                      ? "bg-[#1B3B18] scale-125 ring-4 ring-[#2D5A27]/30"
                      : "bg-[#2D5A27] hover:scale-110"
                  }`}
                >
                  +
                </button>

                {/* Floating Tooltip */}
                {isHovered && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs whitespace-nowrap shadow-lg pointer-events-none animate-fade-in">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-[10px] text-gray-300">{item.priceDisplay}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Items List & Add Vignette Button */}
        <div className="lg:col-span-4 space-y-4">
          <div className="space-y-3">
            {VIGNETTE_ITEMS.map((item) => {
              const isHovered = activeItem === item.id;
              return (
                <div
                  key={item.id}
                  onMouseEnter={() => setActiveItem(item.id)}
                  onMouseLeave={() => setActiveItem(null)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                    isHovered
                      ? "bg-white border-[#2D5A27] shadow-card-hover"
                      : "bg-white/80 border-[#EAE5DC] hover:border-[#D9D3C7]"
                  }`}
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-xl bg-[#F7F5F0] overflow-hidden shrink-0 border border-[#EAE5DC] p-1 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="48px"
                        className="object-contain p-0.5"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs md:text-sm font-medium text-[#1C1C1E]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-[#71717A] mt-0.5">
                        {item.priceDisplay}
                      </p>
                    </div>
                  </div>

                  {/* Add Button */}
                  <button
                    type="button"
                    onClick={() => handleAddItem(item)}
                    aria-label={`Add ${item.name} to cart`}
                    className="w-8 h-8 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white flex items-center justify-center text-sm font-bold shadow-xs active:scale-95 transition-all"
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Entire Vignette Button */}
          <button
            type="button"
            onClick={handleAddAll}
            className="w-full py-3 px-4 rounded-xl bg-[#E8E3D9]/70 hover:bg-[#DDD7CB] text-[#1C1C1E] text-xs md:text-sm font-semibold tracking-wide transition-all shadow-xs active:scale-[0.98]"
          >
            Add Entire Vignette To Cart (${totalPrice.toLocaleString()})
          </button>
        </div>
      </div>
    </section>
  );
}
