"use client"

import { useEffect, useState } from "react";
import { productService } from "@/lib/services/product.service";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import InventoryTools from "@/components/admin/InventoryTools";

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await productService.getAll();
            setProducts(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter">Inventory Control</h1>
                    <p className="text-surface-500 font-bold italic text-sm">Synchronize hardware stock and global listings.</p>
                </div>
                <Link href="/admin/products/new" className="bg-primary text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Add New Product
                </Link>
            </div>

            <InventoryTools />

            <div className="bg-surface rounded-[2.5rem] shadow-premium border border-surface-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-50 border-b border-surface-100 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Hardware Unit</th>
                            <th className="px-8 py-5">Taxonomy</th>
                            <th className="px-8 py-5">Pricing</th>
                            <th className="px-8 py-5">Stock Level</th>
                            <th className="px-8 py-5">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 text-sm font-bold">
                        {loading ? (
                            <tr><td colSpan="5" className="p-10 text-center text-surface-300 italic animate-pulse tracking-widest uppercase text-xs">Calibrating inventory data...</td></tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-surface-50/50 transition-colors group">
                                    <td className="px-8 py-6 flex items-center gap-4 text-surface-900">
                                        <div className="w-12 h-12 rounded-xl bg-surface-100 overflow-hidden shrink-0 border border-surface-100">
                                            <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt="" />
                                        </div>
                                        <span className="truncate max-w-[250px] font-extrabold">{p.name}</span>
                                    </td>
                                    <td className="px-8 py-6 text-surface-400 capitalize">{p.category}</td>
                                    <td className="px-8 py-6 text-primary font-black">{formatPrice(p.price)}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black tracking-widest ${p.countInStock > 5 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                            {p.countInStock || 0} left
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex gap-6">
                                            <Link href={`/admin/products/${p.id}`} className="text-surface-400 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest">Edit</Link>
                                            <button onClick={() => handleDelete(p.id)} className="text-surface-400 hover:text-red-600 transition-colors font-black uppercase text-[10px] tracking-widest">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
