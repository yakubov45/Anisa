"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductGrid from "./ProductGrid"
import { useTranslation } from "@/lib/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import DualRangeSlider from "@/components/common/DualRangeSlider"
import PriceDisplay from "@/components/common/PriceDisplay"

const getCategorySvg = (name) => {
    const key = name?.toLowerCase().trim();
    
    // Default fallback icon
    const fallback = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
    );

    const icons = {
        'monitors': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'monitorlar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="21" x2="16" y2="21" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="17" x2="12" y2="21" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'graphics': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'video kartalar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="8" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="16" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'processors': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="9" width="6" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
        ),
        'markaziy protsessorlar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="4" y="4" width="16" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="9" y="9" width="6" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
            </svg>
        ),
        'motherboards': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h4v4H6zm8 0h4v2h-4zm0 6h4v6h-4zm-8 2h4v4H6z" />
            </svg>
        ),
        'ona platalar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h4v4H6zm8 0h4v2h-4zm0 6h4v6h-4zm-8 2h4v4H6z" />
            </svg>
        ),
        'ram': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h20v8H2zM6 16v2M10 16v2M14 16v2M18 16v2M2 12h20" />
            </svg>
        ),
        'tezkor xotira': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h20v8H2zM6 16v2M10 16v2M14 16v2M18 16v2M2 12h20" />
            </svg>
        ),
        'tezkor xotira (ram)': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 8h20v8H2zM6 16v2M10 16v2M14 16v2M18 16v2M2 12h20" />
            </svg>
        ),
        'memory': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="7" r="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10M7 15h10" />
            </svg>
        ),
        'storage': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="7" r="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10M7 15h10" />
            </svg>
        ),
        'ssd / hdd xotira': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="17" cy="7" r="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 11h10M7 15h10" />
            </svg>
        ),
        'psus': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l-4 6h4l-2 4" />
            </svg>
        ),
        'quvvat bloklari': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l-4 6h4l-2 4" />
            </svg>
        ),
        'cases': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 3h16l2 4v14H2V7l2-4zM2 7h20M6 12h12M6 16h12" />
            </svg>
        ),
        'korpuslar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 3h16l2 4v14H2V7l2-4zM2 7h20M6 12h12M6 16h12" />
            </svg>
        ),
        'cooling': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v7M12 15v7M2 12h7M15 12h7" />
            </svg>
        ),
        'sovutish tizimlari': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v7M12 15v7M2 12h7M15 12h7" />
            </svg>
        ),
        'keyboards': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h2M11 10h2M16 10h2M6 14h12" />
            </svg>
        ),
        'klaviaturalar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="6" width="20" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 10h2M11 10h2M16 10h2M6 14h12" />
            </svg>
        ),
        'mice': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="6" y="2" width="12" height="20" rx="6" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v10M6 10h12" />
            </svg>
        ),
        'sichqonchalar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="6" y="2" width="12" height="20" rx="6" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v10M6 10h12" />
            </svg>
        ),
        'accessories': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
                <rect x="2" y="13" width="4" height="6" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="18" y="13" width="4" height="6" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'aksessuarlar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 14c0-4.97 4.03-9 9-9s9 4.03 9 9" />
                <rect x="2" y="13" width="4" height="6" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="18" y="13" width="4" height="6" rx="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        'prebuilts': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 21h12M12 17v4M6 7h12M6 11h12" />
            </svg>
        ),
        'tayyor kompyuterlar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 21h12M12 17v4M6 7h12M6 11h12" />
            </svg>
        ),
        'laptops': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 18h20M12 16v2" />
            </svg>
        ),
        'noutbuklar': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2 18h20M12 16v2" />
            </svg>
        ),
        'desks': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 18v3M20 18v3M4 10h16M4 14h16M2 6h20" />
            </svg>
        ),
        'chairs': (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 18v3M20 18v3M4 10h16M4 14h16M2 6h20" />
            </svg>
        )
    };
    
    return icons[key] || fallback;
};

export default function ProductListing({ initialProducts = [], allCategories = [], totalProducts = 0, currentPage: serverPage = 1 }) {
    const { t, lang } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const searchQuery = searchParams.get("search")
    const categoryQuery = searchParams.get("category")

    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })
    const [sortBy, setSortBy] = useState("newest")
    const [isCatOpen, setIsCatOpen] = useState(false)
    const itemsPerPage = 12

    // Sync categories from URL
    useEffect(() => {
        if (categoryQuery) {
            setSelectedCategories([categoryQuery])
        } else {
            setSelectedCategories([])
        }
    }, [categoryQuery])

    const maxProductPrice = useMemo(() => {
        if (!initialProducts || initialProducts.length === 0) return 5000
        const prices = initialProducts.map(p => Number(p.price)).filter(p => !isNaN(p) && p > 0)
        if (prices.length === 0) return 5000
        return Math.max(...prices)
    }, [initialProducts])

    const activeCategoryName = useMemo(() => {
        if (selectedCategories.length === 0) return t('view_all') || 'All Categories';
        const activeCat = allCategories.find(c => selectedCategories.includes(c.id));
        if (!activeCat) return t('view_all') || 'All Categories';
        
        if (lang === 'ru' && activeCat.name_ru) return activeCat.name_ru;
        if (lang === 'en' && activeCat.name_en) return activeCat.name_en;
        return activeCat.name;
    }, [selectedCategories, allCategories, t, lang]);

    useEffect(() => {
        setPriceRange(prev => ({ ...prev, max: maxProductPrice }))
    }, [maxProductPrice])

    // Lock body scroll when filter dropdown is open
    useEffect(() => {
        if (isCatOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCatOpen])

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesSearch = !searchQuery || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesCategory = selectedCategories.length === 0 || 
                selectedCategories.includes(product.categoryId) || 
                selectedCategories.some(c => c?.toLowerCase() === product.category?.toLowerCase())
            
            const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max

            return matchesSearch && matchesCategory && matchesPrice
        })
    }, [initialProducts, searchQuery, selectedCategories, priceRange])

    const sortedProducts = useMemo(() => {
        return [...filteredProducts].sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price
            if (sortBy === "price-high") return b.price - a.price
            if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt)
            return 0
        })
    }, [filteredProducts, sortBy])

    const totalPages = Math.ceil(totalProducts / itemsPerPage)

    const handlePageChange = (pageNum) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", pageNum.toString())
        router.push(`/products?${params.toString()}`, { scroll: true })
    }

    const toggleCategory = (categoryId) => {
        const params = new URLSearchParams(searchParams.toString())
        if (params.get("category") === categoryId) {
            params.delete("category")
        } else {
            params.set("category", categoryId)
        }
        params.set("page", "1") // Reset to page 1 on filter change
        router.push(`/products?${params.toString()}`)
    }

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: maxProductPrice });
        router.push('/products');
    }

    const getPageNumbers = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) pages.push(i)
        return pages
    }

    return (
        <div className="space-y-12">
            {/* GLOBAL HEADER (Localizable) */}
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('shop_title')}</span>
                    {searchQuery && (
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                            / {t('filter_search_results')}: "{searchQuery}"
                        </span>
                    )}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase leading-[1.1]">
                    {t('shop_products')}
                </h1>
                <p className="text-foreground/60 font-medium max-w-2xl text-sm md:text-base leading-relaxed">
                    {t('shop_desc')}
                </p>
            </div>

            <div className="flex flex-col gap-12">
                {/* HORIZONTAL FILTERS BAR */}
                <div className="flex flex-col gap-5 bg-surface-50/50 p-4 md:p-6 rounded-3xl border border-border-alpha">
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                        {/* Categories Dropdown Section */}
                        <div className="w-full sm:flex-1 space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <h3 className="text-[9px] font-black text-foreground/50 uppercase tracking-[0.4em]">{t('filter_categories')}</h3>
                                {(selectedCategories.length > 0 || searchQuery || priceRange.min > 0 || priceRange.max < maxProductPrice) && (
                                    <button 
                                        onClick={resetFilters} 
                                        className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline"
                                    >
                                        {t('cart_clear_btn')}
                                    </button>
                                )}
                            </div>
                        
                        <div className="relative w-full sm:w-80">
                            <button
                                onClick={() => setIsCatOpen(!isCatOpen)}
                                className="w-full flex items-center justify-between px-5 py-3.5 bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-primary/50 transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_8px_30px_rgb(0,0,0,0.5)]"
                            >
                                <span className="flex items-center gap-2.5 truncate">
                                    <span className="text-primary shrink-0">
                                        {selectedCategories.length === 0 ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" />
                                            </svg>
                                        ) : (
                                            getCategorySvg(activeCategoryName)
                                        )}
                                    </span>
                                    <span className="text-white/40">{t('filter_categories')}:</span>
                                    <span className="text-primary truncate">{activeCategoryName}</span>
                                </span>
                                <svg 
                                    className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isCatOpen ? 'rotate-180 text-primary' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {isCatOpen && (
                                    <>
                                        {/* Click outside backdrop */}
                                        <div className="fixed inset-0 z-30" onClick={() => setIsCatOpen(false)} />
                                        
                                        <motion.div
                                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 26 }}
                                            className="absolute top-full left-0 mt-3 w-full sm:w-[480px] bg-[#0d1117]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),_inset_0_1px_1px_rgba(255,255,255,0.05)] overflow-hidden z-40 p-4"
                                        >
                                            <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto scrollbar-thin pr-1">
                                                {/* All Categories Option */}
                                                <button
                                                    onClick={() => {
                                                        const params = new URLSearchParams(searchParams.toString())
                                                        params.delete("category")
                                                        params.set("page", "1")
                                                        router.push(`/products?${params.toString()}`)
                                                        setIsCatOpen(false)
                                                    }}
                                                    className={`col-span-2 text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-between border ${
                                                        selectedCategories.length === 0 
                                                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                                            : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10'
                                                    }`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className="shrink-0 text-white/70">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                                <circle cx="12" cy="12" r="10" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10M12 2a15.3 15.3 0 00-4 10 15.3 15.3 0 004 10" />
                                                            </svg>
                                                        </span>
                                                        <span>{t('view_all') || 'All Categories'}</span>
                                                    </span>
                                                    {selectedCategories.length === 0 && (
                                                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                                    )}
                                                </button>

                                                {/* Category List */}
                                                {allCategories.map((cat) => {
                                                    const isSelected = selectedCategories.includes(cat.id);
                                                    return (
                                                        <motion.button
                                                            key={cat.id}
                                                            whileHover={{ scale: 1.02, x: 2 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => {
                                                                toggleCategory(cat.id)
                                                                setIsCatOpen(false)
                                                            }}
                                                            className={`text-left px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-between border ${
                                                                isSelected 
                                                                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                                                    : 'bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10'
                                                            }`}
                                                        >
                                                            <span className="flex items-center gap-2.5 truncate">
                                                                <span className="shrink-0 opacity-80">{getCategorySvg(cat.name)}</span>
                                                                <span className="truncate">
                                                                    {lang === 'ru' && cat.name_ru ? cat.name_ru : lang === 'en' && cat.name_en ? cat.name_en : cat.name}
                                                                </span>
                                                            </span>
                                                            {isSelected && (
                                                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                                                            )}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                        </div>

                        {/* Price Range Section */}
                        <div className="w-full sm:w-72 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-[9px] font-black text-foreground/50 uppercase tracking-[0.4em]">{t('filter_price_range')}</h3>
                                <div className="text-[10px] font-mono font-black text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md shadow-md shadow-primary/5 flex items-center gap-1.5">
                                    <PriceDisplay price={priceRange.min} /> — <PriceDisplay price={priceRange.max} />
                                </div>
                            </div>
                            
                            <div className="px-1 py-1">
                                <DualRangeSlider 
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    minLimit={0}
                                    maxLimit={maxProductPrice}
                                    onChange={(vals) => setPriceRange(vals)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="space-y-12">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 justify-between border-b border-border-alpha pb-5">
                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em]">
                            {t('showing_results_count')
                                .replace('{count}', sortedProducts.length)
                                .replace('{total}', totalProducts)}
                        </span>

                        <div className="flex items-center p-1 bg-surface-100/50 dark:bg-white/5 rounded-xl border border-white/5 overflow-x-auto">
                            {[
                                { id: 'newest', label: t('sort_newest') },
                                { id: 'price-low', label: t('sort_price_low') },
                                { id: 'price-high', label: t('sort_price_high') }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSortBy(option.id)}
                                    className={`relative px-3 md:px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${sortBy === option.id ? 'text-white' : 'text-foreground/40 hover:text-foreground'
                                        }`}
                                >
                                    {sortBy === option.id && (
                                        <motion.div
                                            layoutId="activeSort"
                                            className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-lg shadow-primary/20"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{option.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {sortedProducts.length > 0 ? (
                        <ProductGrid products={sortedProducts} />
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 text-center space-y-6 animate-fade-in">
                            <div className="w-20 h-20 bg-surface-100 rounded-full flex items-center justify-center border border-border-alpha">
                                <svg className="w-10 h-10 text-foreground/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">{t('filter_no_products')}</h2>
                                <p className="text-foreground/60 text-sm max-w-xs mx-auto">{t('cart_empty_desc')}</p>
                            </div>
                            <button 
                                onClick={resetFilters}
                                className="bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl"
                            >
                                {t('cart_clear_btn')}
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-12 border-t border-border-alpha">
                            {getPageNumbers().map(num => (
                                <button
                                    key={num}
                                    onClick={() => handlePageChange(num)}
                                    className={`w-12 h-12 rounded-xl text-xs font-black transition-all ${
                                        serverPage === num 
                                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                                            : 'bg-surface-100 text-surface-500 hover:bg-surface-200'
                                    }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}