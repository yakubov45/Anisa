"use client";

import useStore from "@/store/useStore";
import Link from "next/link";
import ProductCard from "@/features/product/ProductCard";

export default function WishlistPage() {
    const wishlist = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('onepc_wishlist')) || []) : [];

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-surface-900 tracking-tighter">Your Wishlist</h1>
                <p className="text-surface-500 font-medium font-bold">Saved hardware waiting for your command.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="bg-surface-50 rounded-3xl border border-dashed border-surface-200 py-24 text-center">
                    <div className="text-5xl mb-6 grayscale opacity-20">❤️</div>
                    <h3 className="text-xl font-bold text-surface-900">Your wishlist is empty</h3>
                    <p className="text-surface-500 text-sm mt-2 mb-8 font-medium">Add items you love to keep track of them.</p>
                    <Link href="/products" className="bg-primary text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                        Discover Products
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlist.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
            )}
        </div>
    );
}
