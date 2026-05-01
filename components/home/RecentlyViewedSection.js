"use client";

import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import ProductCard from "@/features/product/ProductCard";

export default function RecentlyViewedSection() {
    const { recent } = useRecentlyViewed();

    if (recent.length === 0) return null;

    return (
        <section className="space-y-16 animate-fade-in py-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32" />

            <div className="flex items-end justify-between px-4 border-l-4 border-primary pl-8">
                <div className="space-y-3">
                    <h2 className="text-5xl font-black text-foreground tracking-tighter uppercase">System Logs</h2>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.2em]">Recently accessed hardware units</p>
                </div>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-10 snap-x no-scrollbar px-4">
                {recent.map((product) => (
                    <div key={product.id} className="min-w-[320px] snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-10 left-0 w-32 h-32 bg-primary/5 blur-[80px] rounded-full -ml-16" />
        </section>
    );
}
