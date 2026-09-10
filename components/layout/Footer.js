"use client";

import { useState } from "react";
import Link from "next/link";
import useUIStore from "@/store/useUIStore";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useUIStore();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    if (addToast) addToast("Thank you for subscribing to our culinary journal!");
    setEmail("");
  };

  return (
    <footer className="w-full bg-[#FBF9F5] border-t border-[#EAE5DC] text-[#1C1C1E] pt-14 md:pt-16 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 mb-14">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg md:text-xl font-medium tracking-tight text-[#1C1C1E]">
              Anisa Studio
            </h3>
            <p className="text-xs md:text-sm text-[#71717A] leading-relaxed max-w-xs">
              Bridging the gap between professional gastronomy and domestic tranquility through exceptional artisanal kitchenware.
            </p>
          </div>

          {/* Col 2: Customer Care */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              CUSTOMER CARE
            </h4>
            <ul className="space-y-2.5 text-xs md:text-sm text-[#71717A]">
              <li>
                <Link href="/shipping" className="hover:text-[#2D5A27] transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#2D5A27] transition-colors">
                  Warranty & Care
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#2D5A27] transition-colors">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#2D5A27] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              NEWSLETTER
            </h4>
            <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
              Subscribe to receive private sales, culinary notes, and new releases.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 pt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white border border-[#D9D3C7] rounded-lg px-3.5 py-2 text-xs text-[#1C1C1E] outline-none focus:border-[#2D5A27] transition-colors placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-[#1B3B18] hover:bg-[#244B20] text-white text-xs font-semibold shrink-0 transition-colors shadow-xs active:scale-95"
              >
                {subscribed ? "Done" : "Join"}
              </button>
            </form>
          </div>

          {/* Col 4: Secure Shopping */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-[0.18em] uppercase text-[#1C1C1E]">
              SECURE SHOPPING
            </h4>
            <p className="text-xs md:text-sm text-[#71717A] leading-relaxed">
              All transactions are encrypted and secured with industry-standard protocols.
            </p>
            {/* Security Icons */}
            <div className="flex items-center gap-3 text-[#71717A] pt-1">
              {/* Lock Icon */}
              <div className="p-2 rounded-md bg-[#F4F1EA] border border-[#E8E3D9]" title="SSL Encrypted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              {/* Shield Icon */}
              <div className="p-2 rounded-md bg-[#F4F1EA] border border-[#E8E3D9]" title="Verified Protection">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              </div>
              {/* Credit Card Icon */}
              <div className="p-2 rounded-md bg-[#F4F1EA] border border-[#E8E3D9]" title="Secure Payments">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-6-10.5A2.25 2.25 0 002.25 8v8a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 16V8a2.25 2.25 0 00-2.25-2.25H3.75z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#EAE5DC] text-center">
          <p className="text-xs text-[#71717A]">
            &copy; {new Date().getFullYear()} Anisa Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
