"use client"

import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product.service";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ 
        name: "", 
        price: "", 
        category: "laptops", 
        brand: "",
        image: "",
        description: "",
        countInStock: 10,
        discount: 0
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getById(id);
                if (product) {
                    setForm(product);
                } else {
                    alert("Product not found");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await productService.update(id, form);
            router.push("/admin/products");
        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Error updating product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-4xl space-y-12 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">Modify_Hardware</h1>
                    <p className="text-surface-500 font-bold italic">Update technical specifications and listing data for this unit.</p>
                </div>
                <Link href="/admin/products" className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary transition-colors">
                    ← Back to Inventory
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8 bg-surface p-10 md:p-14 rounded-[2.5rem] shadow-premium border border-surface-50">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Product Designation</label>
                            <input 
                                type="text" 
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Full Description</label>
                            <textarea 
                                rows="5"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all resize-none" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Hardware Brand</label>
                                <input 
                                    type="text" 
                                    value={form.brand}
                                    onChange={e => setForm({ ...form, brand: e.target.value })} 
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Image URL</label>
                                <input 
                                    type="text" 
                                    value={form.image}
                                    onChange={e => setForm({ ...form, image: e.target.value })} 
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-surface p-8 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-6">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Pricing & Logistics</p>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Unit Price ($)</label>
                            <input 
                                type="number" 
                                value={form.price}
                                onChange={e => setForm({ ...form, price: Number(e.target.value) })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-black text-primary focus:ring-2 focus:ring-primary transition-all" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Discount (%)</label>
                            <input 
                                type="number" 
                                value={form.discount}
                                onChange={e => setForm({ ...form, discount: Number(e.target.value) })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Stock Quantity</label>
                            <input 
                                type="number" 
                                value={form.countInStock}
                                onChange={e => setForm({ ...form, countInStock: Number(e.target.value) })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Taxonomy</label>
                            <select 
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })} 
                                className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                            >
                                <option value="Processors">Processors (CPU)</option>
                                <option value="Motherboards">Motherboards</option>
                                <option value="Memory">Memory (RAM)</option>
                                <option value="Graphics">Graphics Cards (GPU)</option>
                                <option value="Storage">Storage (SSD/HDD)</option>
                                <option value="PSUs">Power Supply (PSU)</option>
                                <option value="Cases">Chassis (Case)</option>
                                <option value="Cooling">Cooling Systems</option>
                                <option value="laptops">Laptops</option>
                                <option value="accessories">Accessories</option>
                            </select>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={saving}
                        className="w-full bg-surface-900 text-white font-black py-6 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs"
                    >
                        {saving ? "Updating..." : "Commit Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
