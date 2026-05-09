"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductGrid from "./ProductGrid"
import { useTranslation } from "@/lib/LanguageContext"
import { motion, AnimatePresence } from "framer-motion"
import DualRangeSlider from "@/components/common/DualRangeSlider"

export default function ProductListing({ initialProducts = [], allCategories = [] }) {
    const { t } = useTranslation()
    const searchParams = useSearchParams()
    const router = useRouter()
    
    const searchQuery = searchParams.get("search")
    const categoryQuery = searchParams.get("category")

    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 })
    const [sortBy, setSortBy] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)
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
        if (initialProducts.length === 0) return 5000
        return Math.max(...initialProducts.map(p => p.price))
    }, [initialProducts])

    useEffect(() => {
        setPriceRange(prev => ({ ...prev, max: maxProductPrice }))
    }, [maxProductPrice])

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesSearch = !searchQuery || 
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.category?.toLowerCase().includes(searchQuery.toLowerCase())
            
            const matchesCategory = selectedCategories.length === 0 || 
                selectedCategories.includes(product.categoryId) || 
                selectedCategories.includes(product.category)
            
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

    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return sortedProducts.slice(start, start + itemsPerPage)
    }, [sortedProducts, currentPage])

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage)

    const toggleCategory = (categoryId) => {
        setSelectedCategories(prev => 
            prev.includes(categoryId) 
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        )
        setCurrentPage(1)
    }

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: maxProductPrice });
        setCurrentPage(1);
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

            <div className="flex flex-col lg:flex-row gap-12">
                {/* SIDEBAR FILTERS */}
                <aside className="w-full lg:w-80 space-y-12">
                    <div className="space-y-8 bg-surface-50/50 p-6 rounded-3xl border border-border-alpha">
                        <div className="flex items-center justify-between border-b border-border-alpha pb-4">
                            <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em]">{t('filter_categories')}</h3>
                            {(selectedCategories.length > 0 || searchQuery || priceRange.min > 0 || priceRange.max < maxProductPrice) && (
                                <button 
                                    onClick={resetFilters} 
                                    className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline"
                                >
                                    {t('cart_clear_btn')}
                                </button>
                            )}
                        </div>
                        <div className="flex flex-col gap-4">
                            {allCategories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => toggleCategory(cat.id)}
                                    className={`flex items-center justify-between group transition-all ${
                                        selectedCategories.includes(cat.id) ? 'text-primary' : 'text-surface-500 hover:text-foreground'
                                    }`}
                                >
                                    <span className="text-[10px] font-black uppercase tracking-widest">{cat.name}</span>
                                    <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                                        selectedCategories.includes(cat.id) ? 'bg-primary border-primary' : 'border-border-alpha group-hover:border-foreground/30'
                                    }`}>
                                        {selectedCategories.includes(cat.id) && (
                                            <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-8 bg-surface-50/50 p-6 rounded-3xl border border-border-alpha">
                        <div className="space-y-6">
                            <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em] border-b border-border-alpha pb-4">{t('filter_price_range')}</h3>
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">{t('filter_min')}</label>
                                        <input 
                                            type="number" 
                                            value={priceRange.min}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                            className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-[11px] font-mono font-bold focus:ring-1 focus:ring-primary/30 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">{t('filter_max')}</label>
                                        <input 
                                            type="number" 
                                            value={priceRange.max}
                                            onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                            className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-[11px] font-mono font-bold focus:ring-1 focus:ring-primary/30 outline-none"
                                        />
                                    </div>
                                </div>
                                
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
                </aside>

                {/* MAIN CONTENT */}
                <div className="flex-1 space-y-12">
                    <div className="flex items-center justify-between border-b border-border-alpha pb-6">
                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em]">
                            {t('showing_results_count')
                                .replace('{count}', paginatedProducts.length)
                                .replace('{total}', sortedProducts.length)}
                        </span>

                        <div className="flex items-center p-1 bg-surface-100/50 dark:bg-white/5 rounded-xl border border-white/5">
                            {[
                                { id: 'newest', label: t('sort_newest') },
                                { id: 'price-low', label: t('sort_price_low') },
                                { id: 'price-high', label: t('sort_price_high') }
                            ].map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => setSortBy(option.id)}
                                    className={`relative px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${sortBy === option.id ? 'text-white' : 'text-foreground/40 hover:text-foreground'
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

                    {paginatedProducts.length > 0 ? (
                        <ProductGrid products={paginatedProducts} />
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
                                    onClick={() => {
                                        setCurrentPage(num)
                                        window.scrollTo({ top: 0, behavior: 'smooth' })
                                    }}
                                    className={`w-12 h-12 rounded-xl text-xs font-black transition-all ${
                                        currentPage === num 
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