"use client";

import { useUser } from "@/lib/UserContext";
import useStore from "@/store/useStore";
import Link from 'next/link';
import ProductCard from "@/features/product/ProductCard";

export default function WishlistPage() {
    const { user } = useUser();
    const { wishlist } = useStore();

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-surface-900 tracking-tighter">My Wishlist</h1>
                <p className="text-surface-500 font-medium text-sm">Save your dream components for later deployment.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="bg-surface p-20 rounded-[2.5rem] shadow-premium text-center space-y-6">
                    <div className="text-6xl opacity-20 grayscale">❤️</div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-surface-900">Your wishlist is empty</h3>
                        <p className="text-surface-500 font-medium max-w-xs mx-auto">Explore our high-performance inventory and save items you're interested in.</p>
                    </div>
                    <Link href="/products" className="inline-block bg-primary text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-primary/20 mt-4 transition-transform hover:scale-105 active:scale-95">
                        Browse Inventory
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {wishlist.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
