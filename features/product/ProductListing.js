"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";

export default function ProductListing({
  initialProducts = [],
  totalProducts = 48,
  currentPage = 1,
}) {
  const { addToCart, wishlist, toggleWishlist } = useStore();
  const { setCartDrawerOpen, addToast, triggerCartAnimation } = useUIStore();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [maxPrice, setMaxPrice] = useState(750);
  const [selectedMaterials, setSelectedMaterials] = useState(["Damascus Steel"]);
  const [inStockOnly, setInStockOnly] = useState(true);
  const [sortBy, setSortBy] = useState("featured");
  const [page, setPage] = useState(currentPage);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const categoriesList = [
    { id: "all", label: "All Products", count: 48 },
    { id: "cookware", label: "Cookware", count: 18 },
    { id: "knives", label: "Knives & Cutlery", count: 12 },
    { id: "tableware", label: "Tableware", count: 10 },
    { id: "appliances", label: "Appliances", count: 8 },
  ];

  const materialsList = ["Cast Iron", "Damascus Steel", "Copper", "Stoneware", "Walnut"];

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setMaxPrice(750);
    setSelectedMaterials([]);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const toggleMaterial = (mat) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  // Filter and Sort Products
  const displayedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const cat = (p.category || "").toLowerCase();
        return cat.includes(selectedCategory);
      });
    }

    // Price filter
    result = result.filter((p) => {
      const price = Number(p.price || p.basePrice || 0);
      return price <= maxPrice;
    });

    // Material filter
    if (selectedMaterials.length > 0) {
      result = result.filter((p) => {
        if (!p.material) return true;
        return selectedMaterials.some((m) =>
          p.material.toLowerCase().includes(m.toLowerCase())
        );
      });
    }

    // In Stock filter
    if (inStockOnly) {
      result = result.filter((p) => p.inStock !== false);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else {
      // Featured
      result.sort((a, b) => (a.sortOrder || 99) - (b.sortOrder || 99));
    }

    return result;
  }, [initialProducts, selectedCategory, maxPrice, selectedMaterials, inStockOnly, sortBy]);

  const handleQuickAdd = (product) => {
    if (addToCart) {
      addToCart({
        id: product.id,
        name: product.name || product.title,
        price: Number(product.price || product.basePrice || 240),
        image: product.image || "/images/editorial/cat-prod-skillet.png",
        quantity: 1,
      });
    }
    if (triggerCartAnimation) triggerCartAnimation();
    if (addToast) addToast(`${product.name || product.title} added to cart`);
    if (setCartDrawerOpen) setCartDrawerOpen(true);
  };

  return (
    <div className="space-y-8 animate-fade-in bg-[#FBF9F5] pt-20 md:pt-28 pb-16">
      {/* 1. HEADER & BREADCRUMB */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#EAE5DC]">
        <div>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] text-[#71717A] uppercase mb-2">
            <span>CATALOG</span>
            <span>/</span>
            <span className="text-[#1C1C1E]">ALL COLLECTIONS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-normal text-[#1C1C1E] tracking-tight">
            Curated Culinary Artifacts
          </h1>
        </div>
        <p className="text-xs md:text-sm text-[#52525B] max-w-md leading-relaxed">
          Explore our complete range of professional-grade cookware, hand-forged Japanese steel, and artisanal tableware crafted for daily mastery.
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-[#D9D3C7] text-xs font-semibold text-[#1C1C1E] shadow-xs"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
          </svg>
          <span>Filters</span>
        </button>
        <span className="text-xs text-[#71717A]">
          Showing {displayedProducts.length} products
        </span>
      </div>

      {/* 2. MAIN LAYOUT: SIDEBAR FILTERS + PRODUCTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT SIDEBAR FILTERS (DESKTOP) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 bg-white/70 p-6 rounded-3xl border border-[#EAE5DC] shadow-xs sticky top-28">
          {/* Filters Title & Reset */}
          <div className="flex items-center justify-between pb-4 border-b border-[#F4F1EA]">
            <h3 className="font-serif text-lg font-normal text-[#1C1C1E]">
              Filters
            </h3>
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#71717A] hover:text-[#1C1C1E] transition-colors"
            >
              Reset All
            </button>
          </div>

          {/* Category Checklist */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              CATEGORY
            </h4>
            <div className="space-y-2.5">
              {categoriesList.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <label
                    key={cat.id}
                    className="flex items-center justify-between cursor-pointer group select-none text-xs text-[#3F3F46] hover:text-[#1C1C1E]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="category"
                        checked={isSelected}
                        onChange={() => setSelectedCategory(cat.id)}
                        className="w-4 h-4 accent-[#1B3B18] rounded cursor-pointer"
                      />
                      <span className={isSelected ? "font-semibold text-[#1C1C1E]" : ""}>
                        {cat.label}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#71717A]">({cat.count})</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              PRICE RANGE
            </h4>
            <div className="space-y-2">
              <input
                type="range"
                min="20"
                max="750"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 bg-[#E8E3D9] rounded-lg appearance-none cursor-pointer accent-[#1B3B18]"
              />
              <div className="flex items-center justify-between text-xs text-[#71717A] font-mono">
                <span>$20</span>
                <span>${maxPrice} max</span>
              </div>
            </div>
          </div>

          {/* Material Pills */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              MATERIAL
            </h4>
            <div className="flex flex-wrap gap-2">
              {materialsList.map((mat) => {
                const isSelected = selectedMaterials.includes(mat);
                return (
                  <button
                    key={mat}
                    type="button"
                    onClick={() => toggleMaterial(mat)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                      isSelected
                        ? "bg-[#1B3B18] text-white font-semibold shadow-xs"
                        : "bg-[#F4F1EA] text-[#52525B] hover:bg-[#EAE5DC]"
                    }`}
                  >
                    {mat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-2 border-t border-[#F4F1EA]">
            <label className="flex items-center justify-between cursor-pointer select-none text-xs font-bold tracking-[0.15em] uppercase text-[#1C1C1E]">
              <span>IN STOCK ONLY</span>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4.5 h-4.5 accent-[#1B3B18] rounded cursor-pointer"
              />
            </label>
          </div>
        </aside>

        {/* RIGHT MAIN CATALOG */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Count & Sort Dropdown */}
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
            <span className="text-xs md:text-sm text-[#71717A]">
              Showing <strong className="text-[#1C1C1E]">1–{displayedProducts.length}</strong> of{" "}
              {totalProducts} products
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#71717A] hidden sm:inline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-[#D9D3C7] rounded-xl px-3 py-1.5 text-xs text-[#1C1C1E] outline-none shadow-xs cursor-pointer"
              >
                <option value="featured">Featured Highlights</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* 3-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => {
              const isFavorite = wishlist.some((item) => item.id === product.id);
              const badge = product.badge;
              const isGreenBadge = product.badgeType === "green";

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#EAE5DC] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-card-hover transition-all duration-300 group"
                >
                  {/* Image Box */}
                  <div className="relative aspect-square w-full bg-[#F7F5F0] overflow-hidden flex items-center justify-center p-4">
                    {/* Badge */}
                    {badge && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-xs ${
                            isGreenBadge
                              ? "bg-[#2D5A27] text-white"
                              : "bg-[#8C5930] text-white"
                          }`}
                        >
                          {badge}
                        </span>
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label="Save to Wishlist"
                      className="absolute top-3.5 right-3.5 z-10 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-xs transition-transform active:scale-90"
                    >
                      <svg
                        className={`w-4 h-4 transition-colors ${
                          isFavorite ? "fill-red-500 text-red-500" : "text-[#71717A] hover:text-[#1C1C1E]"
                        }`}
                        fill={isFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                    </button>

                    {/* Product Photo */}
                    <Image
                      src={product.image || "/images/editorial/cat-prod-skillet.png"}
                      alt={product.name || product.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Subcategory & Rating */}
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-[10px] font-semibold tracking-wider text-[#71717A] uppercase">
                          {product.subcategory || product.category?.toUpperCase() || "COOKWARE"}
                        </span>
                        <span className="text-[#D48B38] font-medium flex items-center gap-1">
                          ★ {Number(product.rating || 4.9).toFixed(1)}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-base md:text-lg font-medium text-[#1C1C1E] leading-snug group-hover:text-[#2D5A27] transition-colors line-clamp-1">
                        {product.name || product.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed mt-1">
                        {product.description}
                      </p>
                    </div>

                    {/* Footer Row: Price & Quick Add */}
                    <div className="pt-3 border-t border-[#F4F1EA] flex items-center justify-between">
                      <span className="font-serif text-base md:text-lg font-semibold text-[#1C1C1E]">
                        ${Number(product.price || product.basePrice || 240)}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                          />
                        </svg>
                        <span>Quick Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. PAGINATION (Screenshot 3) */}
          <div className="pt-10 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-lg border border-[#D9D3C7] bg-white text-[#1C1C1E] text-sm flex items-center justify-center hover:bg-[#F4F1EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>

            {/* Page 1 */}
            <button
              type="button"
              onClick={() => setPage(1)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                page === 1
                  ? "bg-[#1B3B18] text-white shadow-xs"
                  : "bg-white border border-[#D9D3C7] text-[#1C1C1E] hover:bg-[#F4F1EA]"
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            <button
              type="button"
              onClick={() => setPage(2)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                page === 2
                  ? "bg-[#1B3B18] text-white shadow-xs"
                  : "bg-white border border-[#D9D3C7] text-[#1C1C1E] hover:bg-[#F4F1EA]"
              }`}
            >
              2
            </button>

            {/* Page 3 */}
            <button
              type="button"
              onClick={() => setPage(3)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                page === 3
                  ? "bg-[#1B3B18] text-white shadow-xs"
                  : "bg-white border border-[#D9D3C7] text-[#1C1C1E] hover:bg-[#F4F1EA]"
              }`}
            >
              3
            </button>

            <span className="px-1 text-[#71717A] text-sm">...</span>

            {/* Page 6 */}
            <button
              type="button"
              onClick={() => setPage(6)}
              className={`w-9 h-9 rounded-lg text-sm font-semibold flex items-center justify-center transition-colors ${
                page === 6
                  ? "bg-[#1B3B18] text-white shadow-xs"
                  : "bg-white border border-[#D9D3C7] text-[#1C1C1E] hover:bg-[#F4F1EA]"
              }`}
            >
              6
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(6, p + 1))}
              disabled={page === 6}
              className="w-9 h-9 rounded-lg border border-[#D9D3C7] bg-white text-[#1C1C1E] text-sm flex items-center justify-center hover:bg-[#F4F1EA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}