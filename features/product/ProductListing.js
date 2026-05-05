"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductGrid from "./ProductGrid"

export default function ProductListing({ initialProducts = [], allCategories = [] }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedCategories, setSelectedCategories] = useState([])
    const [sortBy, setSortBy] = useState("newest")
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get("search")
    const categoryQuery = searchParams.get("category")

    // URL orqali kelgan kategoriyani tanlash (Kichik harflarga o'girib saqlaymiz)
    useEffect(() => {
        if (categoryQuery) {
            setSelectedCategories([categoryQuery.toLowerCase()]);
            setCurrentPage(1);
        }
    }, [categoryQuery]);
    
    const maxProductPrice = useMemo(() => {
        if (!initialProducts || initialProducts.length === 0) return 10000
        const prices = initialProducts.map(p => Number(p.price) || 0)
        return Math.ceil(Math.max(...prices, 100) / 100) * 100
    }, [initialProducts])

    const [priceRange, setPriceRange] = useState({ min: 0, max: maxProductPrice })

    useEffect(() => {
        setPriceRange(prev => ({ ...prev, max: Math.max(prev.max, maxProductPrice) }))
    }, [maxProductPrice])

    const categories = useMemo(() => {
        const catMap = new Map();

        if (allCategories && allCategories.length > 0) {
            allCategories.forEach(cat => {
                const id = (cat.id || cat._id || cat.slug || cat.name || '').toString().trim();
                const name = (cat.name || cat.title || id || "Unnamed").toString().trim();
                if (id) catMap.set(id.toLowerCase(), { id, name });
            });
        }

        initialProducts.forEach(p => {
            const val = p.category;
            if (val) {
                let id = '';
                let name = '';
                if (typeof val === 'string') {
                    id = val.trim();
                    name = val.trim().charAt(0).toUpperCase() + val.trim().slice(1);
                } else if (typeof val === 'object') {
                    id = (val.id || val._id || val.slug || val.name || '').toString().trim();
                    name = (val.name || val.title || id || "Unnamed").toString().trim();
                }
                
                if (id) {
                    const lowerId = id.toLowerCase();
                    if (!catMap.has(lowerId)) {
                        catMap.set(lowerId, { id, name });
                    }
                }
            }
        });

        return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [initialProducts, allCategories])

    const filteredProducts = useMemo(() => {
        return initialProducts.filter(p => {
            const pCatValues = [];
            const extract = (val) => {
                if (!val) return;
                if (Array.isArray(val)) val.forEach(extract);
                else if (typeof val === 'object') {
                    Object.values(val).forEach(v => {
                        if (typeof v === 'string' || typeof v === 'number') {
                            pCatValues.push(v.toString().toLowerCase().trim());
                        }
                    });
                } else {
                    pCatValues.push(val.toString().toLowerCase().trim());
                }
            };
            extract(p.category);

            const categoryMatch = selectedCategories.length === 0 || 
                selectedCategories.some(selId => {
                    const selIdLower = selId.toString().toLowerCase().trim();
                    const matchingCat = categories.find(c => c.id?.toString().toLowerCase().trim() === selIdLower);
                    const catNameLower = matchingCat ? matchingCat.name?.toLowerCase().trim() : '';

                    // 1. Direct matches in category fields
                    if (pCatValues.some(v => v === selIdLower || v.includes(selIdLower) || selIdLower.includes(v))) return true;
                    if (catNameLower && pCatValues.some(v => v === catNameLower || v.includes(catNameLower) || catNameLower.includes(v))) return true;

                    // 2. Nuclear fallback: Search name, brand, and type
                    const nameLower = p.name?.toLowerCase() || "";
                    const brandLower = p.brand?.toLowerCase() || "";
                    const typeLower = p.type?.toLowerCase() || "";
                    
                    if (nameLower.includes(selIdLower) || brandLower.includes(selIdLower) || typeLower.includes(selIdLower)) return true;

                    // 3. Final fallback: Entire object search
                    const pString = JSON.stringify(p).toLowerCase();
                    if (pString.includes(`"${selIdLower}"`) || pString.includes(`:${selIdLower}`)) return true;
                    
                    return false;
                });
            
            // Robust price parsing
            const priceStr = String(p.price || "0").replace(/[^0-9.]/g, '');
            const price = Number(priceStr) || 0;
            const priceMatch = price >= priceRange.min && price <= priceRange.max;
            
            const searchMatch = !searchQuery || 
                p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pCatValues.some(v => v.includes(searchQuery.toLowerCase()));
            
            return categoryMatch && priceMatch && searchMatch;
        })
    }, [initialProducts, selectedCategories, priceRange, searchQuery, categories])

    // Apply Sorting
    const sortedProducts = useMemo(() => {
        const result = [...filteredProducts];
        if (sortBy === "price_asc") {
            result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
        } else if (sortBy === "price_desc") {
            result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
        } else {
            result.sort((a, b) => (b.id || "").localeCompare(a.id || ""))
        }
        return result;
    }, [filteredProducts, sortBy]);

    const totalPages = Math.ceil(sortedProducts.length / 12)
    const paginatedProducts = sortedProducts.slice((currentPage - 1) * 12, currentPage * 12)

    const handleCategoryChange = (categoryId) => {
        const lowId = categoryId.toLowerCase();
        setSelectedCategories(prev => 
            prev.map(c => c.toLowerCase()).includes(lowId) 
                ? prev.filter(c => c.toLowerCase() !== lowId) 
                : [...prev, lowId]
        )
        setCurrentPage(1)
    }

    const resetFilters = () => {
        setSelectedCategories([]);
        setPriceRange({ min: 0, max: maxProductPrice });
        setCurrentPage(1);
    }

    const getPageNumbers = () => {
        const pages = []
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, '...', totalPages)
            else if (currentPage >= totalPages - 3) pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            else pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
        }
        return pages
    }

    return (
        <div className="flex flex-col lg:flex-row gap-12">
            {/* SIDEBAR */}
            <aside className="w-full lg:w-80 space-y-12">
                <div className="space-y-8 bg-surface-50/50 p-6 rounded-3xl border border-border-alpha">
                    <div className="flex items-center justify-between border-b border-border-alpha pb-4">
                        <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em]">Categories</h3>
                        {selectedCategories.length > 0 && (
                            <button onClick={() => setSelectedCategories([])} className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Clear</button>
                        )}
                    </div>
                    <div className="flex flex-col gap-4">
                        {categories.map(cat => (
                            <label key={cat.id} className="flex items-center group cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.some(c => c.toLowerCase() === cat.id.toLowerCase())}
                                            onChange={() => handleCategoryChange(cat.id)}
                                            className="peer appearance-none w-6 h-6 border-2 border-border-alpha rounded-xl bg-surface-100 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                                        />
                                        <svg className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <span className={`text-sm font-bold uppercase tracking-widest transition-all ${selectedCategories.some(c => c.toLowerCase() === cat.id.toLowerCase()) ? 'text-primary' : 'text-foreground/60 group-hover:text-foreground'}`}>
                                        {cat.name}
                                    </span>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="space-y-8 bg-surface-50/50 p-6 rounded-3xl border border-border-alpha">
                    <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.4em] border-b border-border-alpha pb-4">Price Range</h3>
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 space-y-2">
                                <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Min</label>
                                <input 
                                    type="number" 
                                    value={priceRange.min}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                                    className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-primary/40 outline-none text-foreground"
                                />
                            </div>
                            <div className="flex-1 space-y-2">
                                <label className="text-[9px] font-black text-foreground/40 uppercase tracking-widest">Max</label>
                                <input 
                                    type="number" 
                                    value={priceRange.max}
                                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                                    className="w-full bg-surface-100 border border-border-alpha rounded-xl px-4 py-3 text-xs font-mono focus:ring-1 focus:ring-primary/40 outline-none text-foreground"
                                />
                            </div>
                        </div>

                        <div className="relative h-12 flex items-center px-2">
                            <div className="absolute left-0 right-0 h-1.5 bg-surface-100 rounded-full border border-border-alpha" />
                            <div 
                                className="absolute h-1.5 bg-primary rounded-full pointer-events-none"
                                style={{ 
                                    left: `${Math.max(0, (priceRange.min / maxProductPrice) * 100)}%`, 
                                    right: `${Math.max(0, 100 - (priceRange.max / maxProductPrice) * 100)}%` 
                                }}
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={priceRange.min}
                                onChange={(e) => {
                                    const value = Math.min(Number(e.target.value), priceRange.max - 10);
                                    setPriceRange(prev => ({ ...prev, min: value }));
                                }}
                                className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                            <input
                                type="range"
                                min="0"
                                max={maxProductPrice}
                                value={priceRange.max}
                                onChange={(e) => {
                                    const value = Math.max(Number(e.target.value), priceRange.min + 10);
                                    setPriceRange(prev => ({ ...prev, max: value }));
                                }}
                                className="absolute left-0 right-0 w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-foreground [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer"
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <div className="flex-1 space-y-12">
                <div className="flex items-center justify-between border-b border-border-alpha pb-6">
                    <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em]">
                        Showing <span className="text-foreground">{paginatedProducts.length}</span> of <span className="text-foreground">{sortedProducts.length}</span> results
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest hidden sm:block">Sort By:</span>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer hover:text-primary transition-colors focus:ring-0 border-none"
                        >
                            <option value="newest" className="bg-background text-foreground">Newest</option>
                            <option value="price_asc" className="bg-background text-foreground">Price: Low to High</option>
                            <option value="price_desc" className="bg-background text-foreground">Price: High to Low</option>
                        </select>
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
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tight">No Results Found</h2>
                            <p className="text-foreground/60 text-sm max-w-xs mx-auto">Try adjusting your filters or clearing them to see all hardware components.</p>
                        </div>
                        <button 
                            onClick={resetFilters}
                            className="bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] px-8 py-4 rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-xl"
                        >
                            Reset All Filters
                        </button>
                    </div>
                )}

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