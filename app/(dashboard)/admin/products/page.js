"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/services/product.service";
import { getAdminProductsAction } from "@/lib/actions/product.actions";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import InventoryTools from "@/components/admin/InventoryTools";
import { useTranslation } from "@/lib/LanguageContext";
import { auth } from "@/lib/firebase/client";

export default function AdminProductsPage() {
    const { t } = useTranslation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const limit = 10;

    // Debounce search query
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const data = await getAdminProductsAction(page, limit, debouncedSearch);
            setProducts(data?.products || []);
            setTotalPages(Math.ceil((data?.total || 0) / limit) || 1);
            setLoading(false);
        };
        fetch();
    }, [page, debouncedSearch]);

    const handleDelete = async (id) => {
        if (confirm(t('prod_confirm_delete'))) {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleDeleteAll = async () => {
        if (products.length === 0) return;
        
        if (confirm("DIQQAT! Barcha mahsulotlar o'chiriladi. Ishonchingiz komilmi?")) {
            if (confirm("Ikkinchi tasdiqlash: Bu amalni ortga qaytarib bo'lmaydi! Rostdan ham HAMMA mahsulotni o'chirmoqchimisiz?")) {
                setLoading(true);
                try {
                    const token = await auth.currentUser?.getIdToken();
                    if (!token) throw new Error("Tasdiqlash tokeni topilmadi. Qaytadan tizimga kiring.");

                    // Xavfsizlik uchun firebase-admin orqali tozalash API siga so'rov
                    const res = await fetch('/api/admin/clear-products', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!res.ok) {
                        const errData = await res.json();
                        throw new Error(errData.error || res.statusText);
                    }
                    
                    setProducts([]);
                    alert("Barcha mahsulotlar muvaffaqiyatli o'chirildi!");
                } catch (error) {
                    console.error("Xatolik:", error);
                    alert("O'chirishda xatolik yuz berdi.");
                } finally {
                    setLoading(false);
                }
            }
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">{t('prod_inventory_control')}</h1>
                    <p className="text-surface-500 font-bold italic text-sm">{t('prod_inventory_desc')}</p>
                </div>
                <div className="flex gap-4">
                    {products.length > 0 && (
                        <button 
                            onClick={handleDeleteAll}
                            disabled={loading}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 font-black px-6 py-5 rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                            Hammasini O'chirish
                        </button>
                    )}
                    <Link href="/admin/products/new" className="bg-primary text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs flex items-center justify-center">
                        {t('prod_add_new')}
                    </Link>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
                <div className="w-full md:w-1/3 relative">
                    <input
                        type="text"
                        placeholder="Mahsulot yoki kategoriya qidiring..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all text-surface-900"
                    />
                    <svg className="w-5 h-5 text-surface-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <InventoryTools />

            <div className="bg-surface rounded-[2.5rem] shadow-premium border border-surface-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 border-b border-surface-100 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5 whitespace-nowrap">{t('prod_hardware_unit')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('prod_taxonomy')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('prod_pricing')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('prod_stock_level')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('prod_management')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100 text-sm font-bold">
                            {loading ? (
                                <tr><td colSpan="5" className="p-10 text-center text-surface-300 italic animate-pulse tracking-widest uppercase text-xs">{t('prod_loading')}</td></tr>
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
                                                {t('prod_left').replace('{count}', p.countInStock || 0)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex gap-6">
                                                <Link href={`/admin/products/${p.id}`} className="text-surface-400 hover:text-primary transition-colors font-black uppercase text-[10px] tracking-widest">{t('prod_edit')}</Link>
                                                <button onClick={() => handleDelete(p.id)} className="text-surface-400 hover:text-red-600 transition-colors font-black uppercase text-[10px] tracking-widest">{t('prod_delete')}</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-4 border-t border-surface-100 bg-surface-50">
                        <span className="text-xs font-bold text-surface-400">
                            Sahifa {page} / {totalPages}
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white border border-surface-200 rounded-xl disabled:opacity-50 hover:border-primary transition-all text-surface-900"
                            >
                                Oldingi
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-white border border-surface-200 rounded-xl disabled:opacity-50 hover:border-primary transition-all text-surface-900"
                            >
                                Keyingi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
