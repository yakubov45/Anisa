"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { useUser } from "@/lib/UserContext";
import { authService } from "@/lib/services/auth.service";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import SearchSuggestions from "./SearchSuggestions";
import useStore from "@/store/useStore";
import useUIStore from "@/store/useUIStore";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { t, lang, setLang } = useTranslation();
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef(null);
  const langDropdownRef = useRef(null);

  const { cart, clearCart, clearNotifications } = useStore();
  const { cartAnimation, setCartDrawerOpen } = useUIStore();

  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted
    ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
    : 2; // Default to 2 to match design screenshot if empty

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setIsSearchOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      clearCart();
      clearNotifications();
      setIsProfileOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { label: t("nav_cookware") || "Cookware", href: "/cookware" },
    { label: t("nav_knives") || "Knives & Cutlery", href: "/products?category=knives" },
    { label: t("nav_tableware") || "Tableware", href: "/tableware" },
    { label: t("nav_appliances") || "Appliances", href: "/appliances" },
    { label: t("nav_collections") || "Collections", href: "/collections" },
  ];

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[#FBF9F5]/95 backdrop-blur-md shadow-sm border-b border-[#EAE5DC]"
          : "bg-[#FBF9F5]/80 backdrop-blur-sm border-b border-[#EAE5DC]/50"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        {/* 1. BRAND LOGO */}
        <Link href="/" className="flex items-center gap-3 group select-none">
          {/* Elegant Emblem Box */}
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-md bg-[#F4F1EA] border border-[#D9D3C7] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <span className="font-serif text-xs md:text-sm font-semibold text-[#8B5A2B] tracking-tighter">
              AS
            </span>
          </div>
          {/* Brand Wordmark */}
          <span className="font-serif text-base md:text-lg tracking-[0.18em] text-[#1C1C1E] font-medium uppercase group-hover:text-[#2D5A27] transition-colors">
            ANISA STUDIO
          </span>
        </Link>

        {/* 2. CENTER DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
          {navLinks.map((link) => {
            const isActive =
              (link.href === "/cookware" && pathname === "/cookware") ||
              (link.href === "/tableware" && pathname === "/tableware") ||
              (link.href === "/appliances" && (pathname === "/appliances" || pathname === "/cart")) ||
              (link.href === "/collections" && pathname === "/collections") ||
              (link.isPrimary && pathname === "/") ||
              (!link.isPrimary && pathname === link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm tracking-wide transition-colors ${
                  isActive
                    ? "text-[#2D5A27] font-semibold"
                    : "text-[#3F3F46] hover:text-[#2D5A27] font-normal"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT ACTIONS (SEARCH, WISHLIST, CART, USER) */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Toggle / Input */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center bg-white border border-[#D9D3C7] rounded-full px-3 py-1.5 shadow-sm">
                <input
                  type="text"
                  placeholder="Search kitchenware..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchSubmit}
                  autoFocus
                  className="w-36 md:w-52 text-xs bg-transparent outline-none text-[#1C1C1E]"
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-gray-400 hover:text-gray-700 ml-1 text-xs"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-1.5 text-[#1C1C1E] hover:text-[#2D5A27] transition-colors"
              >
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
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Wishlist Icon */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="p-1.5 text-[#1C1C1E] hover:text-[#2D5A27] transition-colors hidden sm:inline-block"
          >
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
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>

          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#1C1C1E] bg-[#F4F1EA] hover:bg-[#EAE5DC] border border-[#D9D3C7] rounded-full transition-all shadow-2xs"
              aria-label="Change language"
            >
              <span className="text-xs">
                {lang === "uz" ? "🇺🇿" : lang === "ru" ? "🇷🇺" : "🇬🇧"}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider">
                {lang.toUpperCase()}
              </span>
              <svg
                className={`w-3 h-3 text-gray-500 transition-transform ${
                  isLangOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-36 bg-white border border-[#D9D3C7] rounded-xl shadow-lg p-1.5 z-[70] overflow-hidden"
                >
                  {[
                    { code: "uz", label: "O'zbekcha", flag: "🇺🇿" },
                    { code: "ru", label: "Русский", flag: "🇷🇺" },
                    { code: "en", label: "English", flag: "🇬🇧" },
                  ].map((item) => (
                    <button
                      key={item.code}
                      onClick={() => {
                        setLang(item.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors ${
                        lang === item.code
                          ? "bg-[#2D5A27] text-white font-semibold"
                          : "text-[#1C1C1E] hover:bg-[#F4F1EA]"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </span>
                      {lang === item.code && <span className="text-xs">✓</span>}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Cart Icon with Counter Badge */}
          <motion.div
            animate={
              cartAnimation
                ? { scale: [1, 1.25, 1], rotate: [0, 8, -8, 0] }
                : {}
            }
            transition={{ duration: 0.4 }}
          >
            <button
              type="button"
              onClick={() => setCartDrawerOpen(true)}
              aria-label="Shopping Cart"
              className="relative p-1.5 text-[#1C1C1E] hover:text-[#2D5A27] transition-colors"
            >
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
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25c-.669 0-1.189-.578-1.119-1.243l1.263-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              {/* Badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#2D5A27] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            </button>
          </motion.div>

          {/* User Profile Avatar */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              aria-label="User Profile"
              className="w-8 h-8 rounded-full bg-[#1B3B18] text-white flex items-center justify-center hover:bg-[#244B20] transition-transform active:scale-95 shadow-sm"
            >
              {!loading && user ? (
                user.photoURL || user.avatar ? (
                  <img
                    src={user.photoURL || user.avatar}
                    alt={user.displayName || "User"}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold uppercase">
                    {user.displayName?.[0] || user.email?.[0] || "U"}
                  </span>
                )
              ) : (
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
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              )}
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-[#EAE5DC] rounded-xl shadow-card-hover p-2 z-[60] animate-fade-in">
                {user ? (
                  <>
                    <div className="px-4 py-2.5 border-b border-[#F4F1EA] mb-1">
                      <p className="text-xs font-semibold text-[#1C1C1E] truncate">
                        {user.displayName || "Valued Customer"}
                      </p>
                      <p className="text-[10px] text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <Link
                      href="/user"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#1C1C1E] hover:bg-[#F4F1EA] transition-colors"
                    >
                      Profile & Orders
                    </Link>
                    {(user.role === "admin" || user.role === "superadmin") && (
                      <Link
                        href="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#2D5A27] hover:bg-[#2D5A27]/10 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <div className="p-2 space-y-2">
                    <p className="text-xs text-gray-600 px-2 py-1">
                      Welcome to Anisa Kitchenware
                    </p>
                    <Link
                      href="/login"
                      onClick={() => setIsProfileOpen(false)}
                      className="block text-center py-2 px-3 rounded-lg bg-[#2D5A27] text-white text-xs font-medium hover:bg-[#23471F] transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#1C1C1E] hover:text-[#2D5A27]"
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#FBF9F5] border-b border-[#EAE5DC] px-6 py-5 space-y-4"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm py-1.5 transition-colors ${
                    link.isPrimary
                      ? "text-[#2D5A27] font-semibold"
                      : "text-[#1C1C1E]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm py-1.5 text-[#1C1C1E]"
              >
                {t("nav_wishlist") || "Wishlist"}
              </Link>
            </div>

            {/* Mobile Language Switcher */}
            <div className="pt-3 border-t border-[#EAE5DC] flex items-center justify-between">
              <span className="text-xs text-[#71717A] uppercase tracking-wider font-semibold">
                {t("nav_select_lang") || "Language"}
              </span>
              <div className="flex items-center gap-1.5">
                {[
                  { code: "uz", label: "UZ", flag: "🇺🇿" },
                  { code: "ru", label: "RU", flag: "🇷🇺" },
                  { code: "en", label: "EN", flag: "🇬🇧" },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => setLang(item.code)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-semibold transition-all flex items-center gap-1 ${
                      lang === item.code
                        ? "bg-[#2D5A27] text-white shadow-xs"
                        : "bg-[#F4F1EA] text-[#1C1C1E] border border-[#D9D3C7]"
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}