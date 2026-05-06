"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import { useUser } from "@/lib/UserContext"
import { authService } from "@/lib/services/auth.service"
import { categoryService } from "@/lib/services/category.service"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import SearchSuggestions from "./SearchSuggestions"

import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import { motion } from "framer-motion"

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const { isDarkMode, toggleDarkMode, user, loading } = useUser();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { cart, currency, setCurrency } = useStore()
    const { cartAnimation } = useUIStore()
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const pathname = usePathname()
    const [categories, setCategories] = useState([
        { id: 'cpu', name: 'Processor (CPU)' },
        { id: 'gpu', name: 'Video Card (GPU)' },
        { id: 'motherboard', name: 'Материнская плата' },
        { id: 'ram', name: 'Оперативная память (DDR)' },
        { id: 'ssd', name: 'SSD Накопители' },
        { id: 'hdd', name: 'Жесткий диск (HDD)' },
        { id: 'monitor', name: 'Мониторы' },
        { id: 'laptop', name: 'Ноутбуки' },
        { id: 'mouse', name: 'Мышь' },
        { id: 'keyboard', name: 'Клавиатура' },
        { id: 'headset', name: 'Наушники' },
        { id: 'cooler', name: 'Куллер (Cooling)' },
        { id: 'psu', name: 'Блок питания (UPS)' },
        { id: 'case', name: 'Корпус' },
        { id: 'accessories', name: 'Accessories' }
    ])

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await categoryService.getAll()
                if (data && data.length > 0) {
                    setCategories(data)
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            }
        }
        fetchCategories()
    }, [])

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Background blur toggle
            setIsScrolled(currentScrollY > 20);

            // Hide on scroll down, show on scroll up
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
                setIsVisible(false);
                setIsProfileOpen(false); // Close dropdown when hiding
            } else {
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [lastScrollY]);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            router.push(`/products?search=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
            e.target.blur();
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logout();
            setIsProfileOpen(false);
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-5'}`}>
                <div className={`mx-auto max-w-7xl px-4 md:px-8`}>
                    <div className={`bg-[#161B22]/90 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 md:px-8 py-2 md:py-3.5 transition-all duration-500`}>

                        {/* LOGO */}
                        <Link href="/" className="flex items-center group shrink-0">
                            <div className="relative w-20 h-10 md:w-40 md:h-16 flex items-center justify-center transition-all">
                                <img src="/images/Logo.png" alt="OnePC" className="w-full h-full object-contain" />
                            </div>
                        </Link>

                        {/* COMPACT SEARCH */}
                        <div className="flex-1 max-w-xs mx-4 lg:mx-8 hidden md:block relative">
                            <div className="relative">
                                <img src="/icons/search.svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60" alt="" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    onFocus={() => setShowSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    placeholder="Search inventory..."
                                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-5 py-2.5 text-[11px] font-mono tracking-wider focus:ring-1 focus:ring-primary/50 focus:bg-black/40 transition-all placeholder:text-white/40 text-white outline-none"
                                />
                                {showSuggestions && searchQuery.length > 2 && <SearchSuggestions query={searchQuery} />}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center gap-4 lg:gap-6">
                            <div className="flex items-center gap-4 lg:gap-6 border-r border-white/10 pr-4 lg:pr-6 hidden sm:flex">
                                {[
                                    { name: t('nav_products'), href: "/products" },
                                    { name: t('nav_pc_builder'), href: "/pc-builder" },
                                    { name: t('nav_faq'), href: "/faq" },
                                    { name: t('nav_about'), href: "/about" }
                                ].map((link) => (
                                    <Link key={link.href} href={link.href} className={`text-[9px] font-black uppercase tracking-[0.25em] transition-colors ${pathname === link.href ? 'text-primary' : 'text-white/70 hover:text-white'}`}>
                                        {link.name}
                                    </Link>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 lg:gap-5">
                                {/* Language Switcher */}
                                <div className="relative group hidden md:block">
                                    <button className="h-9 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 transition-all text-white">
                                        <span className="text-[10px] font-black uppercase tracking-widest">{lang}</span>
                                        <svg className="w-2.5 h-2.5 opacity-40 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full right-0 mt-2 w-32 bg-[#161B22] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[60]">
                                        {[
                                            { id: 'uz', label: 'O\'zbekcha' },
                                            { id: 'ru', label: 'Русский' },
                                            { id: 'en', label: 'English' }
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setLang(l.id)}
                                                className={`w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors ${lang === l.id ? 'text-primary' : 'text-white/60'}`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Currency Switcher */}
                                <button
                                    onClick={() => setCurrency(currency === 'USD' ? 'UZS' : 'USD')}
                                    className="hidden md:flex h-9 px-3 rounded-xl bg-white/5 border border-white/10 items-center gap-2 hover:bg-white/10 transition-all text-white group"
                                >
                                    <span className="text-[10px] font-black tracking-widest">{currency}</span>
                                </button>

                                {/* Theme Toggle */}
                                {mounted && (
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href="/products"
                                            className="md:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group"
                                            title="Search"
                                        >
                                            <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={toggleDarkMode}
                                            className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all group flex"
                                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                                        >
                                            {isDarkMode ? (
                                                <svg className="w-4 h-4 text-yellow-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                )}

                                <motion.div
                                    animate={cartAnimation ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Link href="/cart" className="relative group hover:scale-110 transition-transform flex items-center justify-center">
                                        <img src="/icons/cart.svg" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" alt="Cart" />
                                        {cart.length > 0 && (
                                            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-lg border border-black animate-pop-in">
                                                {cart.length}
                                            </span>
                                        )}
                                    </Link>
                                </motion.div>

                                {!loading && (
                                    user ? (
                                        <div className="relative" ref={dropdownRef}>
                                            <button
                                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                                className="flex items-center gap-2 group outline-none"
                                            >
                                                <div className="w-8 h-8 md:w-9 md:h-9 bg-primary rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center font-black text-white shadow-lg shadow-primary/40 transition-transform group-hover:scale-105 active:scale-95 text-xs">
                                                    {(user.photoURL || user.avatar) ? (
                                                        <img src={user.photoURL || user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.displayName?.[0] || user.email?.[0].toUpperCase()
                                                    )}
                                                </div>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isProfileOpen && (
                                                <div className="absolute right-0 mt-4 w-56 bg-[#161B22] border border-white/10 rounded-2xl shadow-premium p-2 animate-slide-up z-[60]">
                                                    <div className="px-4 py-3 border-b border-white/10 mb-2">
                                                        <p className="text-[10px] font-black uppercase text-white truncate">{user.displayName || 'User'}</p>
                                                        <p className="text-[8px] font-bold text-white/40 truncate mt-0.5">{user.email}</p>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <Link
                                                            href="/user"
                                                            onClick={() => setIsProfileOpen(false)}
                                                            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest text-white/70 hover:text-white"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> {t('nav_profile')}
                                                        </Link>

                                                        {user.role === 'admin' && (
                                                            <Link
                                                                href="/admin"
                                                                onClick={() => setIsProfileOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 transition-colors text-[10px] font-black uppercase tracking-widest text-primary"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {t('nav_admin')}
                                                            </Link>
                                                        )}

                                                        {user.role === 'delivery' && (
                                                            <Link
                                                                href="/delivery"
                                                                onClick={() => setIsProfileOpen(false)}
                                                                className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-blue-500/10 transition-colors text-[10px] font-black uppercase tracking-widest text-blue-500"
                                                            >
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4" /></svg> {t('nav_delivery')}
                                                            </Link>
                                                        )}

                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-[10px] font-black uppercase tracking-widest text-red-500"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg> {t('nav_logout')}
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link href="/login" className="bg-white text-black font-black px-4 md:px-5 py-2 rounded-lg md:rounded-xl hover:bg-primary hover:text-white transition-all text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg active:scale-95">
                                            {t('nav_sign_in')}
                                        </Link>
                                    )
                                )}

                                {/* Mobile Menu Toggle */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="lg:hidden w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                                >
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isMobileMenuOpen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <div className={`fixed inset-0 z-[100] lg:hidden transition-all duration-500 ${isMobileMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />

                {/* Drawer Content */}
                <div className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-surface dark:bg-[#050505] shadow-2xl transition-transform duration-500 z-[101] flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-black/100 dark:border-white/5 bg-white dark:bg-[#161B22]">
                        <img src="/images/Logo.png" alt="Logo" className="h-6 w-auto" />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-foreground dark:text-white opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Quick Access Tabs */}
                    <div className="flex border-b border-black/10 dark:border-white/5 bg-white dark:bg-[#050505]">
                        <Link
                            href="/wishlist"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 flex items-center justify-center gap-3 py-4 text-foreground dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/5 transition-all border-r border-black/10 dark:border-white/5"
                        >
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('nav_wishlist')}</span>
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex-1 flex items-center justify-center gap-3 py-4 text-foreground dark:text-white hover:bg-black/[0.02] dark:hover:bg-white/5 transition-all"
                        >
                            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-[10px] font-black uppercase tracking-widest">{t('nav_cart')}</span>
                        </Link>
                    </div>

                    {/* Category List */}
                    <div className="flex-1 overflow-y-auto no-scrollbar bg-surface-100 dark:bg-black">
                        <div className="flex flex-col">
                            {/* Primary Navigation Links */}
                            <div className="flex flex-col">
                                <Link
                                    href="/pc-builder"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-8 py-6 border-b border-black dark:border-white/10 bg-white dark:bg-white/5 hover:bg-primary/5 transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <svg className="w-5 h-5 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
                                        </div>
                                        <span className="text-[11px] font-black text-foreground dark:text-white group-hover:text-primary uppercase tracking-[0.2em] transition-colors">{t('nav_pc_builder')}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-foreground/30 dark:text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>

                                <Link
                                    href="/about"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-8 py-6 border-b border-black dark:border-white/10 bg-white dark:bg-white/5 hover:bg-primary/5 transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <svg className="w-5 h-5 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <span className="text-[11px] font-black text-foreground dark:text-white group-hover:text-primary uppercase tracking-[0.2em] transition-colors">{t('nav_about')}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-foreground/30 dark:text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>

                                <Link
                                    href="/faq"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-8 py-6 border-b border-black dark:border-white/10 bg-white dark:bg-white/5 hover:bg-primary/5 transition-all group shadow-sm"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                                            <svg className="w-5 h-5 text-primary group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <span className="text-[11px] font-black text-foreground dark:text-white group-hover:text-primary uppercase tracking-[0.2em] transition-colors">{t('nav_faq')}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-foreground/30 dark:text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                            </div>

                            {/* Settings & Language in Mobile Menu */}
                            <div className="p-6 border-b border-black/10 dark:border-white/5 space-y-6 bg-black/[0.02] dark:bg-white/[0.02]">
                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-foreground/40 dark:text-white/30 uppercase tracking-[0.2em]">Preferences</p>
                                    <div className="flex gap-2">
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setCurrency('USD')}
                                                className={`py-2.5 rounded-xl border text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-sm ${currency === 'USD' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-white/5 border-black/100 dark:border-white/10 text-foreground dark:text-white/60'}`}
                                            >
                                                USD
                                            </button>
                                            <button
                                                onClick={() => setCurrency('UZS')}
                                                className={`py-2.5 rounded-xl border text-[10px] font-black tracking-widest transition-all active:scale-95 shadow-sm ${currency === 'UZS' ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-white/5 border-black/100 dark:border-white/10 text-foreground dark:text-white/60'}`}
                                            >
                                                UZS
                                            </button>
                                        </div>
                                        <button
                                            onClick={toggleDarkMode}
                                            className="w-12 h-12 rounded-xl border border-black/20 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center text-foreground dark:text-white active:scale-95 transition-all shadow-sm"
                                        >
                                            {isDarkMode ? (
                                                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-foreground/60" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-[9px] font-black text-foreground/40 dark:text-white/30 uppercase tracking-[0.2em]">Regional Language</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { id: 'uz', label: 'UZ' },
                                            { id: 'ru', label: 'RU' },
                                            { id: 'en', label: 'EN' }
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setLang(l.id)}
                                                className={`py-3 rounded-xl border text-[10px] font-black transition-all active:scale-95 shadow-sm ${lang === l.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-white/5 border-black/20 dark:border-white/10 text-foreground dark:text-white/60'}`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-black/[0.02] dark:bg-white/5">
                                <p className="text-[9px] font-black text-foreground/40 dark:text-white/30 uppercase tracking-[0.2em] px-4 py-2">{t('nav_categories')}</p>
                            </div>

                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/products?category=${cat.id}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-8 py-5 border-b border-black/10 dark:border-white/5 bg-white dark:bg-transparent hover:bg-black/[0.02] dark:hover:bg-white/5 transition-all group"
                                >
                                    <span className="text-[11px] font-bold text-foreground dark:text-white uppercase tracking-wider group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </span>
                                    <svg className="w-4 h-4 text-foreground/30 dark:text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="p-8 border-t border-black/10 dark:border-white/5 bg-white dark:bg-[#050505]">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-foreground/40 dark:text-white/40 uppercase tracking-widest">System Status: Online</span>
                        </div>
                        <p className="text-[8px] font-black text-foreground/20 dark:text-white/20 uppercase tracking-[0.3em]">OnePC Engineering 2026</p>
                    </div>
                </div>
            </div>
        </>
    )
}