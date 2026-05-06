"use client";

import { useEffect, useState } from "react";
import { productService } from "@/lib/services/product.service";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import InventoryTools from "@/components/admin/InventoryTools";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminProductsPage() {
    const { t } = useTranslation();
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
        if (confirm(t('prod_confirm_delete'))) {
            await productService.delete(id);
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">{t('prod_inventory_control')}</h1>
                    <p className="text-surface-500 font-bold italic text-sm">{t('prod_inventory_desc')}</p>
                </div>
                <Link href="/admin/products/new" className="bg-primary text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs">
                    {t('prod_add_new')}
                </Link>
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
            </div>
        </div>
    );
}
