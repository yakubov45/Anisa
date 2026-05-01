"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "./ProductGrid"

export default function ProductListing({ initialProducts }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortBy, setSortBy] = useState("newest")
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("search")
    const maxProductPrice = useMemo(() => {
        if (!initialProducts || initialProducts.length === 0) return 10000
        return Math.ceil(Math.max(...initialProducts.map(p => p.price)) / 100) * 100
    }, [initialProducts])

    const [priceRange, setPriceRange] = useState({ min: 0, max: maxProductPrice })
    const productsPerPage = 12

    // Update max price if products change (e.g. admin adds more)
    useMemo(() => {
        setPriceRange(prev => ({ ...prev, max: Math.max(prev.max, maxProductPrice) }))
    }, [maxProductPrice])

    // Extract dynamic categories and their counts
    const categories = useMemo(() => {
        const counts = {}
        initialProducts.forEach(p => {
            if (p.category) {
                counts[p.category] = (counts[p.category] || 0) + 1
            }
        })
        return Object.entries(counts).map(([name, count]) => ({ name, count }))
    }, [initialProducts])

    // Filtering logic
    const filteredProducts = useMemo(() => {
        let result = initialProducts.filter(p => {
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(p.category)
            const priceMatch = p.price >= priceRange.min && p.price <= priceRange.max
            const searchMatch = !searchQuery || 
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            
            return categoryMatch && priceMatch && searchMatch
        })

        // Apply Sorting
        if (sortBy === "price_asc") {
            result.sort((a, b) => a.price - b.price)
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => b.price - a.price)
        } else {
            // Newest (assuming createdAt or id as proxy)
            result.sort((a, b) => b.id.localeCompare(a.id))
        }

        return result
    }, [initialProducts, selectedCategories, priceRange, sortBy])

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    )

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category) 
                : [...prev, category]
        )
        setCurrentPage(1)
    }

    // Pagination Helper
    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages)
            } else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
            }
        }
        return pages
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* SIDEBAR FILTERS */}
            <aside className="w-full lg:w-72 space-y-10">
                {/* Categories */}
                <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em] border-b border-border-alpha pb-4">Categories</h3>
                    <div className="flex flex-col gap-3">
                        {categories.map(cat => (
                            <label key={cat.name} className="flex items-center justify-between group cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(cat.name)}
                                            onChange={() => handleCategoryChange(cat.name)}
                                            className="peer appearance-none w-5 h-5 border border-border-alpha rounded-lg bg-surface-100 checked:bg-primary checked:border-primary transition-all"
                                        />
                                        <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className="text-[11px] font-bold text-foreground/60 group-hover:text-foreground transition-colors uppercase tracking-widest">{cat.name}</span>
                                </div>
                                <span className="text-[9px] font-mono text-foreground/40 bg-surface-100 px-2 py-0.5 rounded-md">{cat.count}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-6 pt-4">
                    <h3 className="text-[10px] font-black text-foreground uppercase tracking-[0.4em] border-b border-border-alpha pb-4">Price Range</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Min Price</label>
                                <input 
                                    type="number" 
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                    className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-[10px] font-mono focus:ring-1 focus:ring-primary/40 outline-none text-foreground"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">Max Price</label>
                                <input 
                                    type="number" 
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-[10px] font-mono focus:ring-1 focus:ring-primary/40 outline-none text-foreground"
                                />
                            </div>
                        </div>
                        
                        {/* Dual Range Slider */}
                        <div className="relative h-12 flex items-center">
                            <div className="absolute w-full h-1.5 bg-surface-100 rounded-full border border-border-alpha" />
                            <div 
                                className="absolute h-1.5 bg-primary rounded-full"
                                style={{ 
                                    left: `${(priceRange.min / maxProductPrice) * 100}%`, 
                                    right: `${100 - (priceRange.max / maxProductPrice) * 100}%` 
                                }}
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={priceRange.min}
                                onChange={(e) => {
                                    const value = Math.min(Number(e.target.value), priceRange.max - 100);
                                    setPriceRange(prev => ({ ...prev, min: value }));
                                }}
                                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-900 dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-900 dark:[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={priceRange.max}
                                onChange={(e) => {
                                    const value = Math.max(Number(e.target.value), priceRange.min + 100);
                                    setPriceRange(prev => ({ ...prev, max: value }));
                                }}
                                className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-zinc-900 dark:[&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-zinc-900 dark:[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 space-y-12">
                <div className="flex items-center justify-between border-b border-border-alpha pb-6">
                    <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em]">
                        Showing <span className="text-foreground">{paginatedProducts.length}</span> of <span className="text-foreground">{filteredProducts.length}</span> results
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Sort By:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-colors focus:ring-0 border-none"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <ProductGrid products={paginatedProducts} />

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-8">
                        <button 
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-alpha bg-surface-50 text-surface-500 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-surface-50 disabled:hover:text-surface-500"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {getPageNumbers().map((page, idx) => (
                            page === '...' ? (
                                <span key={`dots-${idx}`} className="w-10 text-center text-surface-400 font-mono text-xs">...</span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`w-10 h-10 rounded-xl border font-mono text-[11px] font-bold transition-all ${currentPage === page ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'border-border-alpha bg-surface-50 text-surface-500 hover:bg-surface-100'}`}
                                >
                                    {page < 10 ? `0${page}` : page}
                                </button>
                            )
                        ))}

                        <button 
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-border-alpha bg-surface-50 text-surface-500 hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-surface-50 disabled:hover:text-surface-500"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
