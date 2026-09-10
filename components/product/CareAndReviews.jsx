"use client";

import { useState } from "react";
import useUIStore from "@/store/useUIStore";

export default function CareAndReviews() {
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewName, setReviewName] = useState("");
  const { addToast } = useUIStore();

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim() || !reviewName.trim()) return;
    if (addToast) addToast("Thank you for your review! It will be published shortly.");
    setReviewText("");
    setReviewName("");
    setIsWriteModalOpen(false);
  };

  const careCards = [
    {
      id: "cleaning",
      icon: (
        <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-.778.099-1.533.284-2.253" />
        </svg>
      ),
      title: "Easy Cleaning",
      description:
        "The smooth enamel interior requires no seasoning. Simply wash with warm soapy water and a non-abrasive sponge. Dishwasher safe, though hand washing preserves the exterior gloss.",
    },
    {
      id: "thermal",
      icon: (
        <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
        </svg>
      ),
      title: "Thermal Care",
      description:
        "Avoid heating an empty pot. Gradual temperature increases protect the enamel finish from thermal shock. Use silicone or wooden utensils to prevent surface scratches.",
    },
    {
      id: "enamel",
      icon: (
        <svg className="w-5 h-5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
      title: "Vitreous Enamel",
      description:
        "Crafted from molten iron poured into sand molds, coated twice with porcelain enamel and fired at 800°C for absolute chip resistance and chemical neutrality.",
    },
  ];

  const reviews = [
    {
      id: "r1",
      stars: 5,
      date: "2 days ago",
      title: "Absolute masterpiece in the kitchen",
      comment:
        '"The olive green finish is even more stunning in person. I\'ve baked four sourdough loaves in it so far and the crust is bakery-quality every single time. Heat distribution is remarkably even."',
      author: "Eleanor Vance",
      initials: "EL",
      verified: true,
    },
    {
      id: "r2",
      stars: 5,
      date: "1 week ago",
      title: "Worth every single penny",
      comment:
        '"Replaced my old worn-out pot with this 6L beauty. Soups, braised short ribs, and stews come out insanely flavorful. Cleaning is a breeze thanks to the high-grade enamel interior."',
      author: "Marcus R.",
      initials: "MR",
      verified: true,
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 py-12 md:py-20 border-t border-[#EAE5DC]">
      {/* 1. MAINTENANCE SECTION */}
      <section className="space-y-10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs md:text-sm font-semibold tracking-[0.2em] text-[#2D5A27] uppercase block">
            MAINTENANCE
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
            Materials &amp; Care Instructions
          </h2>
          <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
            Designed for simple maintenance so your cookware remains a family heirloom for decades.
          </p>
        </div>

        {/* 3 Care Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {careCards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-3xl p-7 border border-[#EAE5DC] shadow-xs space-y-4 flex flex-col justify-start"
            >
              {/* Icon Bubble */}
              <div className="w-10 h-10 rounded-full bg-[#EAF0E7] flex items-center justify-center">
                {card.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-medium text-[#1C1C1E]">
                {card.title}
              </h3>

              {/* Text */}
              <p className="text-xs text-[#52525B] leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. CUSTOMER REVIEWS SECTION */}
      <section className="pt-8 border-t border-[#EAE5DC] space-y-8">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl text-[#1C1C1E] font-normal tracking-tight">
              Customer Reviews
            </h3>
            <p className="text-xs text-[#71717A] flex items-center gap-1.5">
              <span className="text-[#D48B38] font-semibold">★★★★★ 4.9</span>
              <span>out of 5</span>
              <span>&bull;</span>
              <span>Based on 128 verified purchases</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsWriteModalOpen(true)}
            className="px-5 py-2 rounded-full border border-[#D9D3C7] bg-white text-xs font-semibold text-[#1C1C1E] hover:bg-[#F4F1EA] shadow-xs transition-colors self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        {/* 2 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#EAE5DC] shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Rating & Date */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#D48B38] tracking-tighter">
                    {"★".repeat(rev.stars)}
                  </span>
                  <span className="text-[#71717A] text-[11px]">{rev.date}</span>
                </div>

                {/* Title */}
                <h4 className="font-serif text-base font-medium text-[#1C1C1E]">
                  {rev.title}
                </h4>

                {/* Comment */}
                <p className="text-xs text-[#52525B] leading-relaxed italic">
                  {rev.comment}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-[#F4F1EA]">
                <div className="w-8 h-8 rounded-full bg-[#F4F1EA] border border-[#D9D3C7] flex items-center justify-center text-xs font-bold text-[#1C1C1E]">
                  {rev.initials}
                </div>
                <div>
                  <span className="block text-xs font-semibold text-[#1C1C1E]">
                    {rev.author}
                  </span>
                  <span className="block text-[10px] text-[#2D5A27] font-medium">
                    Verified Buyer
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Modal */}
      {isWriteModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsWriteModalOpen(false)}
        >
          <div
            className="bg-white max-w-md w-full rounded-3xl p-6 shadow-2xl border border-[#EAE5DC] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F4F1EA]">
              <h3 className="font-serif text-lg font-medium text-[#1C1C1E]">
                Write a Review
              </h3>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#1C1C1E] mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eleanor Vance"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D3C7] outline-none focus:border-[#2D5A27]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#1C1C1E] mb-1">
                  Review
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share your culinary experience with this piece..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#D9D3C7] outline-none focus:border-[#2D5A27]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#1B3B18] text-white text-xs font-semibold hover:bg-[#244B20] transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
