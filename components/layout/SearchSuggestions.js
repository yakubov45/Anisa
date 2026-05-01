"use client";

import { useState, useEffect, useRef } from "react";
import { productService } from "@/lib/services/product.service";
import Link from "next/link";

export default function SearchSuggestions({ query }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (query.length > 2) {
            setLoading(true);
            const timer = setTimeout(async () => {
                const products = await productService.getAll();
                const filtered = products.filter(p =>
                    p.name.toLowerCase().includes(query.toLowerCase()) ||
                    p.category.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 5);
                setSuggestions(filtered);
                setLoading(false);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
        }
    }, [query]);

    if (suggestions.length === 0) return null;

    return (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-4 bg-surface-50 rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-[60] animate-slide-up">
            <div className="p-5 border-b border-white/5 bg-surface-100/50">
                <p className="text-[9px] font-black text-surface-500 uppercase tracking-[0.4em]">Hardware_Matrix_Suggestions</p>
            </div>
            <div className="divide-y divide-white/5">
                {suggestions.map(p => (
                    <Link key={p.id} href={`/products/${p.id}`} className="flex items-center gap-6 p-5 hover:bg-surface-100 transition-colors group">
                        <div className="w-14 h-14 rounded-lg bg-surface-200 overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-700">
                            <img src={p.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 space-y-1">
                            <p className="text-sm font-extrabold text-white group-hover:text-primary transition-colors uppercase tracking-tight">{p.name}</p>
                            <p className="text-[9px] text-surface-500 font-bold uppercase tracking-[0.3em] font-mono">{p.category} // ${p.price}</p>
                        </div>
                    </Link>
                ))}
            </div>
            <Link href={`/search?q=${query}`} className="block p-5 text-center bg-white text-surface-900 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-white transition-colors">
                View_Full_Results_Registry
            </Link>
        </div>
    );
}
