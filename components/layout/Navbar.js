"use client"

import { useState, useEffect, useRef } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import { useUser } from "@/lib/UserContext"
import { authService } from "@/lib/services/auth.service"
import { getCategoriesAction } from "@/lib/actions/product.actions"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import SearchSuggestions from "./SearchSuggestions"
import { FEATURES } from "@/lib/features"
import { getCategoryDisplayName } from "@/lib/constants"

import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
    const { t, lang, setLang } = useTranslation();
    const { isDarkMode, toggleDarkMode, user, loading } = useUser();
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { cart, currency, setCurrency, notifications } = useStore()
    const { cartAnimation, setCartDrawerOpen, setNotificationsDrawerOpen } = useUIStore()
    const [mounted, setMounted] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const pathname = usePathname()
    const [categories, setCategories] = useState([
        { id: 'Processors', name: 'Processor (CPU)' },
        { id: 'Graphics', name: 'Video Card (GPU)' },
        { id: 'Motherboards', name: 'Материнская плата' },
        { id: 'Memory', name: 'Оперативная память (DDR)' },
        { id: 'Storage', name: 'SSD/HDD Накопители' },
        { id: 'monitors', name: 'Мониторы' },
        { id: 'mice', name: 'Мышь' },
        { id: 'keyboards', name: 'Клавиатура' },
        { id: 'headsets', name: 'Наушники' },
        { id: 'Cooling', name: 'Куллер (Cooling)' },
        { id: 'PSUs', name: 'Блок питания (UPS)' },
        { id: 'Cases', name: 'Корпус' },
        { id: 'chairs', name: 'Gaming Chair' }
    ])

    useEffect(() => {
        setMounted(true)
        async function fetchCategories() {
            try {
                const data = await getCategoriesAction()
                if (data && data.length > 0) {
                    setCategories(data)
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error)
            }
        }
        fetchCategories()
    }, [])

    const cartCount = mounted ? cart.reduce((sum, item) => sum + (item.quantity || 1), 0) : 0
    const activeCurrency = mounted ? currency : 'USD'
    const unreadNotificationsCount = mounted && notifications ? notifications.filter(n => !n.isRead).length : 0;

    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsScrolled(currentScrollY > 20);
            if (currentScrollY > lastScrollY && currentScrollY > 120) {
                setIsVisible(false);
                setIsProfileOpen(false);
                setIsMobileSearchOpen(false);
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
            setIsMobileSearchOpen(false);
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
            <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'} ${isScrolled ? 'py-1 md:py-2' : 'py-2.5 md:py-4'}`}>
                <div className="mx-auto max-w-[1400px] px-4 md:px-8">
                    <div className="bg-[#161B22]/90 backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-500">
                        <div className="flex items-center justify-between px-5 md:px-7 py-2 md:py-3">
                            {/* LOGO */}
                            <Link href="/" className="flex items-center gap-1 md:gap-1.5 group shrink-0 select-none">
                                <span className="text-lg md:text-xl font-black tracking-tighter uppercase font-outfit">
                                    <span className="text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)]">ONE</span>
                                    <span className="text-primary drop-shadow-[0_2px_10px_rgba(239,68,68,0.2)]">PC</span>
                                </span>
                                <div className="relative w-6 h-6 md:w-7 md:h-7 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                                    <img 
                                        src="/favicon.ico" 
                                        alt="OnePC Logo" 
                                        className="w-full h-full object-contain transform transition-transform duration-300 group-hover:rotate-12" 
                                    />
                                </div>
                            </Link>
 
                            {/* COMPACT SEARCH */}
                            <div className="flex-1 max-w-sm lg:max-w-md mx-3 lg:mx-6 hidden md:block relative">
                                <div className="relative">
                                    <img src="/icons/search.svg" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60" alt="" />
                                    <input
                                        type="text"
                                        aria-label="Search products"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        placeholder={t('nav_search_placeholder')}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono tracking-wider focus:ring-1 focus:ring-primary/50 focus:bg-black/40 transition-all placeholder:text-white/40 text-white outline-none"
                                    />
                                    {showSuggestions && <SearchSuggestions query={searchQuery} onClose={() => setShowSuggestions(false)} />}
                                </div>
                            </div>
 
                            {/* ACTIONS */}
                            <div className="flex items-center gap-3 lg:gap-5 shrink-0">
                                <div className="flex items-center gap-3 lg:gap-4 border-r border-white/10 pr-3 lg:pr-5 hidden sm:flex">
                                    {[
                                        { name: t('nav_products'), href: "/products" },
                                        { name: t('nav_prebuilts') || "Prebuilts", href: "/prebuilts" },
                                        ...(FEATURES.PC_BUILDER ? [{ name: t('nav_pc_builder'), href: "/pc-builder" }] : []),
                                        { name: t('nav_faq'), href: "/faq" },
                                        { name: t('nav_about'), href: "/about" }
                                    ].map((link) => (
                                        <Link 
                                            key={link.href} 
                                            href={link.href} 
                                            className={`relative py-1 text-[10px] md:text-[11px] font-black uppercase tracking-[0.25em] transition-colors duration-300 ${pathname === link.href ? 'text-primary' : 'text-white/70 hover:text-white'} group`}
                                        >
                                            {link.name}
                                            <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-all duration-300 transform origin-left ${pathname === link.href ? 'scale-x-100 shadow-[0_0_8px_#ef4444]' : 'scale-x-0 group-hover:scale-x-100 group-hover:shadow-[0_0_8px_#ef4444]'}`} />
                                        </Link>
                                    ))}
                                </div>
 
                                <div className="flex items-center gap-3 lg:gap-5">
                                    {/* Language Switcher */}
                                    <div className="relative group hidden md:block">
                                        <button aria-label="Toggle language menu" className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 hover:bg-white/10 hover:border-primary/30 hover:scale-105 transition-all text-white duration-300">
                                            <span className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                                                {lang === 'uz' ? '🇺🇿 UZ' : lang === 'ru' ? '🇷🇺 RU' : '🇬🇧 EN'}
                                            </span>
                                            <svg className="w-2.5 h-2.5 opacity-40 group-hover:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" /></svg>
                                        </button>
                                        <div className="absolute top-full right-0 mt-2 w-36 bg-[#161B22] border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-[60]">
                                            {[
                                                { id: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' },
                                                { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                                                { id: 'en', label: 'English', flag: '🇬🇧' }
                                            ].map(l => (
                                                <button
                                                    key={l.id}
                                                    onClick={() => setLang(l.id)}
                                                    className={`w-full px-4 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors flex items-center gap-2.5 ${lang === l.id ? 'text-primary' : 'text-white/60'}`}
                                                >
                                                    <span className="text-sm leading-none">{l.flag}</span>
                                                    <span>{l.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Currency Switcher */}
                                    <button
                                        aria-label="Toggle currency"
                                        onClick={() => setCurrency(activeCurrency === 'USD' ? 'UZS' : 'USD')}
                                        className="hidden md:flex h-10 px-4 rounded-xl bg-white/5 border border-white/10 items-center gap-1.5 hover:bg-white/10 hover:border-primary/30 hover:scale-105 transition-all text-white group duration-300"
                                    >
                                        <span className="text-[11px] font-black tracking-wider">{activeCurrency}</span>
                                    </button>
 
                                    {/* Theme Toggle */}
                                    {mounted && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                aria-label="Toggle mobile search"
                                                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                                                className={`md:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition-all group ${isMobileSearchOpen ? 'bg-primary border-primary text-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                                            >
                                                <svg className="w-4 h-4 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </button>
                                            <button
                                                aria-label="Toggle dark mode"
                                                onClick={toggleDarkMode}
                                                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hidden md:flex items-center justify-center hover:bg-primary hover:border-primary/45 hover:text-white hover:scale-105 transition-all group duration-300"
                                            >
                                                {isDarkMode ? (
                                                    <svg className="w-4 h-4 text-yellow-500 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg>
                                                ) : (
                                                    <svg className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                                                )}
                                            </button>
                                        </div>
                                    )}

                                    {/* Notifications */}
                                    {mounted && (
                                        <button
                                            aria-label="Notifications"
                                            onClick={() => setNotificationsDrawerOpen(true)}
                                            className="relative group hover:scale-110 transition-transform flex items-center justify-center mr-1"
                                        >
                                            <svg className="w-[22px] h-[22px] text-white/70 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            {unreadNotificationsCount > 0 && (
                                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#161B22] animate-pulse"></span>
                                            )}
                                        </button>
                                    )}

                                    <motion.div
                                        animate={cartAnimation ? { scale: [1, 1.4, 1], rotate: [0, 10, -10, 0] } : {}}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <button 
                                            onClick={() => setCartDrawerOpen(true)} 
                                            aria-label="Shopping Cart" 
                                            className="relative group hover:scale-110 transition-transform flex items-center justify-center"
                                        >
                                            <img src="/icons/cart.svg" className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" alt="Cart" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white text-[8px] font-black flex items-center justify-center rounded-lg border border-black animate-pop-in">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </button>
                                    </motion.div>

                                    {!loading && (
                                        user ? (
                                            <div className="relative" ref={dropdownRef}>
                                                <button
                                                    aria-label="Toggle user profile menu"
                                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                                    className="flex items-center gap-2 group outline-none"
                                                >
                                                    <div className="w-7 h-7 md:w-8 md:h-8 bg-primary rounded-lg md:rounded-xl overflow-hidden flex items-center justify-center font-black text-white shadow-lg shadow-primary/40 transition-transform group-hover:scale-105 active:scale-95 text-[10px]">
                                                        {(user.photoURL || user.avatar) ? (
                                                            <img src={user.photoURL || user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="uppercase">{user.displayName?.[0] || user.email?.[0] || 'U'}</span>
                                                        )}
                                                    </div>
                                                </button>

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

                                                            {(user.role === 'admin' || user.role === 'superadmin') && (
                                                                <Link
                                                                    href="/admin"
                                                                    onClick={() => setIsProfileOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 transition-colors text-[10px] font-black uppercase tracking-widest text-primary"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> {t('nav_admin') || "ADMIN PANEL"}
                                                                </Link>
                                                            )}

                                                            {user.role === 'delivery' && (
                                                                <Link
                                                                    href="/delivery"
                                                                    onClick={() => setIsProfileOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-primary/10 transition-colors text-[10px] font-black uppercase tracking-widest text-primary"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4"/></svg> KURYER PANEL
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
                                            <Link href="/login" className="btn-premium btn-premium-white font-black px-4 md:px-5 py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest shadow-lg">
                                                {t('nav_sign_in')}
                                            </Link>
                                        )
                                    )}

                                    {/* Mobile Menu Toggle */}
                                    <button
                                        aria-label="Open mobile menu"
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

                        {/* Mobile Search Input Expansion */}
                        {isMobileSearchOpen && (
                            <div className="md:hidden px-6 pb-4 animate-slide-down relative">
                                <div className="relative">
                                    <img src="/icons/search.svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60" alt="" />
                                    <input
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={handleSearch}
                                        onFocus={() => setShowSuggestions(true)}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        placeholder={t('nav_search_placeholder')}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl pl-11 pr-5 py-3 text-[11px] font-mono tracking-wider focus:ring-1 focus:ring-primary transition-all placeholder:text-white/40 text-white outline-none"
                                    />
                                    {showSuggestions && <SearchSuggestions query={searchQuery} onClose={() => {
                                        setShowSuggestions(false)
                                        setIsMobileSearchOpen(false)
                                    }} />}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden flex justify-end">
                        {/* Overlay backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* Slide-out Drawer Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 220 }}
                            className="relative w-full max-w-sm bg-gradient-to-b from-[#0a0c10] to-[#040507]/95 text-white shadow-[0_0_50px_rgba(239,68,68,0.15)] z-[101] flex flex-col h-full border-l border-white/5"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#0f131a]/80 backdrop-blur-md">
                                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-1 group shrink-0 select-none">
                                    <span className="text-lg font-outfit font-black tracking-tighter uppercase">
                                        <span className="text-white">ONE</span>
                                        <span className="text-primary">PC</span>
                                    </span>
                                    <div className="relative w-6 h-6 flex items-center justify-center transition-all group-hover:scale-110">
                                        <img 
                                            src="/favicon.ico" 
                                            alt="OnePC Logo" 
                                            className="w-full h-full object-contain transform transition-transform duration-300 group-hover:rotate-12" 
                                        />
                                    </div>
                                </Link>
                                <motion.button 
                                    whileHover={{ rotate: 90, scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    aria-label="Close mobile menu" 
                                    onClick={() => setIsMobileMenuOpen(false)} 
                                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/30 transition-all duration-300"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Floating Wishlist & Cart buttons */}
                            <div className="grid grid-cols-2 gap-3 p-5 border-b border-white/5 bg-black/40">
                                <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                                    <svg className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('nav_wishlist')}</span>
                                </Link>
                                <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all duration-300 group">
                                    <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span className="text-[10px] font-black uppercase tracking-widest">{t('nav_cart')}</span>
                                </Link>
                            </div>

                            {/* Main scrollable body */}
                            <div className="flex-1 overflow-y-auto no-scrollbar py-6 space-y-8 bg-black/20">
                                {/* Navigation links list */}
                                <div className="px-6 space-y-3">
                                    {[
                                        { href: "/prebuilts", label: t('nav_prebuilts') || "Tayyor Kompyuterlar", icon: <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                                        ...(FEATURES.PC_BUILDER ? [{ href: "/pc-builder", label: t('nav_pc_builder'), icon: <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg> }] : []),
                                        { href: "/about", label: t('nav_about'), icon: <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
                                    ].map((link, idx) => (
                                        <motion.div
                                            key={link.href}
                                            initial={{ opacity: 0, x: 30 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 + 0.1, duration: 0.4, type: "spring", stiffness: 150 }}
                                        >
                                            <Link 
                                                href={link.href} 
                                                onClick={() => setIsMobileMenuOpen(false)} 
                                                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-primary/5 hover:border-primary/20 transition-all duration-300 group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                                        {link.icon}
                                                    </div>
                                                    <span className="text-[11px] font-black text-white/80 group-hover:text-primary uppercase tracking-[0.2em] transition-colors">{link.label}</span>
                                                </div>
                                                <svg className="w-4 h-4 text-white/20 group-hover:text-primary transition-all group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Settings Section */}
                                <div className="px-6 space-y-4">
                                    <div className="h-px bg-white/5" />
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">{t('nav_settings') || "SETTINGS"}</p>
                                    
                                    <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1">
                                        {[
                                            { id: 'uz', label: '🇺🇿 UZ' },
                                            { id: 'ru', label: '🇷🇺 RU' },
                                            { id: 'en', label: '🇬🇧 EN' }
                                        ].map(l => (
                                            <button
                                                key={l.id}
                                                onClick={() => setLang(l.id)}
                                                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${lang === l.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {l.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Currency Switcher - Mobile */}
                                    <div className="flex bg-black/40 border border-white/5 rounded-2xl p-1">
                                        {['USD', 'UZS'].map(cur => (
                                            <button
                                                key={cur}
                                                onClick={() => setCurrency(cur)}
                                                className={`flex-1 py-3 text-[10px] font-black rounded-xl transition-all duration-300 ${activeCurrency === cur ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white'}`}
                                            >
                                                {cur === 'USD' ? '🇺🇸 USD' : '🇺🇿 UZS'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories Section */}
                                <div className="px-6 space-y-4">
                                    <div className="h-px bg-white/5" />
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 ml-2">{t('nav_categories') || "CATEGORIES"}</p>
                                    
                                    <div className="grid grid-cols-1 gap-1 pl-2">
                                        {categories.map((cat, idx) => {
                                            const catFilterId = cat.slug || cat.id;
                                            return (
                                            <motion.div
                                                key={cat.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: idx * 0.015 + 0.2 }}
                                            >
                                                <Link
                                                    href={`/products?category=${catFilterId}`}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="flex items-center justify-between py-3 border-b border-white/[0.02] group transition-all"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-primary transition-colors">{getCategoryDisplayName(cat, lang)}</span>
                                                    <svg className="w-3 h-3 text-white/10 group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                                                </Link>
                                            </motion.div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}