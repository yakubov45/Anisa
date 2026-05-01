"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductGrid from "@/features/product/ProductGrid";
import { productService } from "@/lib/services/product.service";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            // Simulating search on existing products for now
            const all = await productService.getAll();
            const filtered = all.filter(p =>
                p.name.toLowerCase().includes(query.toLowerCase()) ||
                p.category?.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
            setLoading(false);
        };
        fetchResults();
    }, [query]);

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-surface-900 tracking-tighter">
                    {query ? `Results for "${query}"` : "Search Hardware"}
                </h1>
                <p className="text-surface-500 font-medium font-bold italic">{results.length} results found</p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
                </div>
            ) : (
                <ProductGrid products={results} />
            )}
        </div>
    );
}
