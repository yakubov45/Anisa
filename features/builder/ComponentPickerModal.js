"use client"

import { useState, useEffect } from "react"
import { getProducts } from "@/features/product/api"
import PriceDisplay from "@/components/common/PriceDisplay"
import ImageWithFallback from "@/components/common/ImageWithFallback"

export default function ComponentPickerModal({ isOpen, onClose, category, onSelect }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        if (isOpen) {
            setLoading(true)
            getProducts().then(allProducts => {
                // Filter by category (case-insensitive and plural-handled)
                const filtered = allProducts.filter(p => 
                    p.category && p.category.toLowerCase() === category.toLowerCase()
                )
                setProducts(filtered)
                setLoading(false)
            })
        }
    }, [isOpen, category])

    if (!isOpen) return null

    const filteredList = products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-fade-in" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl bg-surface border border-border-alpha rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
                {/* Header */}
                <div className="px-8 py-6 border-b border-border-alpha flex items-center justify-between bg-surface-50">
                    <div className="flex flex-col">
                        <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Resource_Allocation</span>
                        <h2 className="text-xl font-black text-foreground tracking-tighter uppercase">Select {category}</h2>
                    </div>
                    <button 
                        onClick={onClose}
                        className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Search */}
                <div className="px-8 py-4 bg-surface-50 border-b border-border-alpha">
                    <div className="relative">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`SEARCH_${category.toUpperCase()}_HARDWARE...`}
                            className="w-full bg-surface-100 border border-border-alpha rounded-xl px-6 py-4 text-xs font-mono tracking-widest focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest animate-pulse">Syncing_Inventory...</span>
                        </div>
                    ) : filteredList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredList.map(product => (
                                <div 
                                    key={product.id}
                                    className="bg-surface-50 border border-border-alpha rounded-2xl p-4 flex items-center justify-between group hover:border-primary/40 transition-all cursor-pointer"
                                    onClick={() => onSelect(product)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-border-alpha overflow-hidden">
                                            <ImageWithFallback 
                                                src={product.image} 
                                                alt={product.name} 
                                                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" 
                                            />
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest">{product.brand}</span>
                                            <h4 className="text-xs font-black text-foreground tracking-tight uppercase line-clamp-1">{product.name}</h4>
                                            <PriceDisplay price={product.price} className="text-[10px] font-mono text-green-500 font-bold" />
                                        </div>
                                    </div>
                                    <button className="bg-foreground text-background text-[9px] font-black px-4 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-primary hover:text-white transition-all uppercase tracking-widest shadow-lg">
                                        Select
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 space-y-4">
                            <span className="text-4xl">🚫</span>
                            <h3 className="text-sm font-black text-surface-500 uppercase tracking-widest">No matching components found</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
