"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { useTranslation } from "@/lib/LanguageContext";

// Fallback demo items matching user screenshot if user's cart is empty
const INITIAL_DEMO_ITEMS = [
  {
    id: "cast-iron-skillet-forest",
    name: "Artisanal Cast Iron Skillet",
    category: "COOKWARE",
    variantText: "Size: 10.5 inch | Color: Forest Olive",
    price: 145.0,
    quantity: 1,
    image: "/images/editorial/cart-skillet.png",
  },
  {
    id: "santoku-damascus-walnut",
    name: "Santoku Damascus Chef Knife",
    category: "KNIVES & CUTLERY",
    variantText: "Blade: 7 inch | Handle: Walnut",
    price: 180.0,
    quantity: 1,
    image: "/images/editorial/cart-knife.png",
  },
];

export default function CulinaryCart() {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { cart, removeFromCart, updateQuantity } = useStore();
  const { addToast } = useUIStore();

  const [isGift, setIsGift] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  // Use cart if items exist, otherwise show demo items matching screenshot
  const displayItems = cart && cart.length > 0 ? cart : INITIAL_DEMO_ITEMS;

  const subtotal = displayItems.reduce((acc, item) => {
    const price = Number(item.price) || 0;
    const qty = Number(item.quantity) || 1;
    return acc + price * qty;
  }, 0);

  // Free shipping threshold logic ($350)
  const FREE_SHIPPING_THRESHOLD = 350;
  const freeShippingDiff = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(
    100,
    Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  );

  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 12.0;
  const taxCost = Math.round(subtotal * 0.08); // ~8% estimated tax
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const total = subtotal + shippingCost + taxCost - discountAmount;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const code = promoInput.trim().toUpperCase();
    if (code === "ANISA10" || code === "CULINARY10" || code === "WELCOME10" || code === "CHEF") {
      setDiscountPercent(10);
      setPromoMessage({ type: "success", text: t("cart_promo_applied") || "Promo code applied! -10%" });
      if (addToast) addToast("10% discount applied to your order!");
    } else {
      setDiscountPercent(0);
      setPromoMessage({ type: "error", text: t("cart_promo_invalid") || "Invalid promo code" });
    }
  };

  const handleUpdateQty = (itemId, newQty) => {
    if (newQty < 1) return;
    if (updateQuantity) {
      updateQuantity(itemId, newQty);
    }
  };

  const handleRemove = (itemId, itemName) => {
    if (removeFromCart) {
      removeFromCart(itemId);
    }
    if (addToast) addToast(`${itemName || "Item"} removed from cart`);
  };

  return (
    <div className="space-y-8 pt-20 md:pt-24 pb-8">
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-[#71717A]">
        <Link href="/" className="hover:text-[#1C1C1E] transition-colors">
          {t("cart_breadcrumb_shop") || "Shop"}
        </Link>
        <span>/</span>
        <span className="text-[#1C1C1E] font-medium">
          {t("cart_breadcrumb_checkout") || "Cart & Checkout"}
        </span>
      </nav>

      {/* 2. TITLE */}
      <div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#1C1C1E] font-normal tracking-tight">
          {t("cart_culinary_title") || "Your Culinary Cart"}
        </h1>
      </div>

      {/* 3. FREE SHIPPING PROGRESS BAR */}
      <div className="bg-[#F4F1EA] border border-[#EAE5DC] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-[#1C1C1E] font-medium">
            <span className="text-base sm:text-lg">🚚</span>
            <span>
              {freeShippingDiff > 0 ? (
                <>
                  {t("cart_free_shipping_prefix") || "You are"}{" "}
                  <strong className="font-semibold text-[#2D5A27]">
                    ${freeShippingDiff.toFixed(0)}
                  </strong>{" "}
                  {t("cart_free_shipping_suffix") || "away from free shipping!"}
                </>
              ) : (
                <span className="text-[#2D5A27] font-semibold">
                  {t("cart_free_shipping_unlocked") ||
                    "You unlocked free shipping! 🎉"}
                </span>
              )}
            </span>
          </div>
          <span className="font-mono text-xs text-[#71717A] font-semibold">
            {freeShippingProgress}%
          </span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1B3B18] transition-all duration-500 rounded-full"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* 4. MAIN TWO-COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* LEFT COLUMN: CART ITEMS & GIFT CARD (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Cart Item Cards */}
          {displayItems.map((item) => {
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const itemTotal = itemPrice * itemQty;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE5DC] shadow-xs flex items-center justify-between gap-4 transition-all hover:border-[#D9D3C7]"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#F7F5F0] border border-[#EAE5DC] shrink-0">
                    <Image
                      src={item.image || "/images/editorial/cart-skillet.png"}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-semibold block">
                      {item.category || "COOKWARE"}
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-medium text-[#1C1C1E] leading-snug truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#71717A] truncate">
                      {item.variantText || item.description || "Artisanal Kitchenware"}
                    </p>
                  </div>
                </div>

                {/* Right: Quantity Controls, Price & Delete */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                  {/* Quantity pill */}
                  <div className="flex items-center border border-[#EAE5DC] bg-[#F4F1EA] rounded-lg px-2.5 py-1 text-xs gap-3">
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, itemQty - 1)}
                      className="text-[#71717A] hover:text-[#1C1C1E] font-medium transition-colors"
                      aria-label="Decrease quantity"
                    >
                      &minus;
                    </button>
                    <span className="font-semibold text-[#1C1C1E] min-w-[12px] text-center">
                      {itemQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateQty(item.id, itemQty + 1)}
                      className="text-[#71717A] hover:text-[#1C1C1E] font-medium transition-colors"
                      aria-label="Increase quantity"
                    >
                      &#43;
                    </button>
                  </div>

                  {/* Price */}
                  <span className="font-serif font-semibold text-sm sm:text-base text-[#1C1C1E] min-w-[70px] text-right">
                    ${itemTotal.toFixed(2)}
                  </span>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id, item.name)}
                    className="text-[#A1A1AA] hover:text-red-600 transition-colors p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Make this a gift Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EAE5DC] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#2D5A27]/10 text-[#2D5A27] flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H4.5a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m-9 3.75h18"
                  />
                </svg>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold text-[#1C1C1E]">
                  {t("cart_make_gift") || "Make this a gift?"}
                </h4>
                <p className="text-xs text-[#71717A]">
                  {t("cart_make_gift_desc") ||
                    "Includes signature gift wrapping and a handwritten card."}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsGift(!isGift)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isGift ? "bg-[#2D5A27]" : "bg-[#D9D3C7]"
              }`}
              role="switch"
              aria-checked={isGift}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isGift ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: ORDER SUMMARY (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE5DC] shadow-xs space-y-5 sticky top-28">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#1C1C1E]">
              {t("cart_order_summary") || "Order Summary"}
            </h2>

            {/* Summary Rows */}
            <div className="space-y-3 text-xs sm:text-sm text-[#52525B] pt-1">
              <div className="flex items-center justify-between">
                <span>{t("cart_subtotal") || "Subtotal"}</span>
                <span className="font-semibold text-[#1C1C1E]">
                  ${subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>{t("cart_shipping") || "Estimated Shipping"}</span>
                <span className="font-semibold text-[#1C1C1E]">
                  {shippingCost === 0 ? (
                    <span className="text-[#2D5A27]">{t("cart_shipping_free") || "Free"}</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>{t("cart_tax") || "Estimated Tax"}</span>
                <span className="font-semibold text-[#1C1C1E]">
                  ${taxCost.toFixed(2)}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between text-[#2D5A27]">
                  <span>Discount (10%)</span>
                  <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* PROMO CODE BOX */}
            <div className="pt-2 border-t border-[#EAE5DC] space-y-2">
              <label className="text-[10px] font-bold text-[#71717A] uppercase tracking-wider block">
                {t("cart_promo_code") || "PROMO CODE"}
              </label>
              <form onSubmit={handleApplyPromo} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("cart_enter_code") || "Enter code"}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-[#F9F7F2] border border-[#EAE5DC] focus:border-[#2D5A27] rounded-xl px-4 py-2 text-xs text-[#1C1C1E] outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#F4F1EA] hover:bg-[#EAE5DC] text-[#1C1C1E] border border-[#D9D3C7] rounded-xl px-4 py-2 text-xs font-semibold transition-all active:scale-95"
                >
                  {t("cart_apply") || "Apply"}
                </button>
              </form>

              {promoMessage && (
                <p
                  className={`text-[11px] ${
                    promoMessage.type === "success"
                      ? "text-[#2D5A27]"
                      : "text-red-600"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* TOTAL */}
            <div className="pt-4 border-t border-[#EAE5DC] flex items-baseline justify-between">
              <span className="font-serif text-base sm:text-lg text-[#1C1C1E] font-medium">
                {t("cart_total") || "Total"}
              </span>
              <span className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1C1E]">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* CHECKOUT BUTTON */}
            <Link
              href="/checkout"
              className="w-full bg-[#1B3B18] hover:bg-[#142D12] text-white py-3.5 px-6 rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                />
              </svg>
              <span>{t("cart_proceed_checkout") || "Proceed to Secure Checkout"}</span>
            </Link>

            {/* TRUST BADGES */}
            <div className="pt-2 flex items-center justify-center gap-6 text-[11px] text-[#71717A]">
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span>{t("cart_ssl_badge") || "Secure 256-bit SSL"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-[#2D5A27]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
                <span>{t("cart_returns_badge") || "30-Day Returns"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
