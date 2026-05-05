"use client";

import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product.service";
import ProductCard from "@/features/product/ProductCard";
import { ProductSkeleton } from "@/components/ui/Skeleton";

export default function InfiniteProductGrid({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loadMore = async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        // Simulate pagination logic
        const timer = setTimeout(() => {
            if (page >= 3) {
                setHasMore(false);
            } else {
                setProducts([...products, ...initialProducts]);
                setPage(page + 1);
            }
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    };

    return (
        <div className="space-y-16">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {products.map((p, i) => (
                    <ProductCard key={`${p.id}-${i}`} product={p} />
                ))}
                {loading && [1, 2, 3, 4].map(i => <ProductSkeleton key={i} />)}
            </div>

            {hasMore ? (
                <div className="flex justify-center pt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-foreground text-background font-black px-12 py-5 rounded-2xl shadow-xl hover:bg-primary hover:text-white transition-all disabled:opacity-50 uppercase text-[10px] tracking-widest active:scale-95"
                    >
                        {loading ? "Calibrating Results..." : "Load More Hardware"}
                    </button>
                </div>
            ) : (
                <div className="text-center py-10 border-t border-surface-50">
                    <p className="text-surface-300 font-black uppercase text-[10px] tracking-[0.3em]">End of Current Inventory Matrix</p>
                </div>
            )}
        </div>
    );
}
