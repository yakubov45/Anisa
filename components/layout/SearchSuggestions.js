"use client";

import { useState, useEffect, useRef } from "react";
import { getProductsAction } from "@/lib/actions/product.actions";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function SearchSuggestions({ query, onClose }) {
    const { t } = useTranslation();
    const [suggestions, setSuggestions] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Categories for empty search state
    const popularCategories = [
        { name: t('comp_gpu'), href: '/products?category=Graphics' },
        { name: t('comp_cpu'), href: '/products?category=Processors' },
        { name: t('comp_ram'), href: '/products?category=Memory' },
        { name: t('comp_mob'), href: '/products?category=Motherboards' },
    ];

    useEffect(() => {
        async function fetchFeatured() {
            const products = await getProductsAction(3);
            setFeatured(products);
        }
        fetchFeatured();
    }, []);

    useEffect(() => {
        if (query.length > 0) {
            setLoading(true);
            const timer = setTimeout(async () => {
                const products = await getProductsAction(100);
                const filtered = (products || []).filter(p =>
                    p.name?.toLowerCase().includes(query.toLowerCase()) ||
                    p.category?.toLowerCase().includes(query.toLowerCase()) ||
                    p.brand?.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
                setLoading(false);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
            setLoading(false);
        }
    }, [query]);

    return (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-4 bg-[#161B22] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden z-[60] animate-slide-up w-full md:w-[450px]">
            {query.length === 0 ? (
                <div className="p-6 space-y-6">
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('featured_categories')}</p>
                        <div className="grid grid-cols-2 gap-2">
                            {popularCategories.map(cat => (
                                <Link 
                                    key={cat.href} 
                                    href={cat.href} 
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={onClose}
                                    className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-white/70 hover:text-white hover:bg-primary transition-all uppercase tracking-widest"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-4">
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('home_bestsellers')}</p>
                        <div className="space-y-2">
                            {featured.map(p => (
                                <Link 
                                    key={p.id} 
                                    href={`/products/${p.id}`}
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                        <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-black text-white uppercase truncate">{p.name}</p>
                                        <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{p.category}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">{t('filter_search_results')}</p>
                        {loading && <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                    </div>
                    <div className="divide-y divide-white/5">
                        {suggestions.length > 0 ? (
                            suggestions.map(p => (
                                <Link 
                                    key={p.id} 
                                    href={`/products/${p.id}`} 
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={onClose}
                                    className="flex items-center gap-6 p-5 hover:bg-white/5 transition-colors group"
                                >
                                    <div className="w-14 h-14 rounded-lg bg-white/5 overflow-hidden shrink-0">
                                        <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-extrabold text-white group-hover:text-primary transition-colors uppercase tracking-tight">{p.name}</p>
                                        <p className="text-[9px] text-white/40 font-bold uppercase tracking-[0.3em] font-mono">{p.category} // ${p.price}</p>
                                    </div>
                                </Link>
                            ))
                        ) : !loading && (
                            <div className="p-10 text-center">
                                <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('filter_no_products')}</p>
                            </div>
                        )}
                    </div>
                    {suggestions.length > 0 && (
                        <Link 
                            href={`/products?search=${query}`} 
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={onClose}
                            className="block p-5 text-center bg-primary text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors"
                        >
                            {t('view_all')}
                        </Link>
                    )}
                </>
            )}
        </div>
    );
}
