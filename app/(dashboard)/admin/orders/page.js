"use client";

import { useEffect, useState } from "react";
import { getDeliveryOrdersAction } from "@/lib/actions/order.actions";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from 'next/link';
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminOrdersPage() {
    const { t, lang } = useTranslation();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const { currency, exchangeRate } = useStore();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            const searchParam = urlParams.get("search");
            if (searchParam) {
                setSearchQuery(searchParam);
            }
        }
        const fetch = async () => {
            const result = await getDeliveryOrdersAction(null, "all");
            if (result.success) setOrders(result.orders);
            setLoading(false);
        };
        fetch();
    }, []);

    const getStatusColor = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "delivered": return "bg-green-500/10 text-green-500 border border-green-500/20";
            case "cancelled": return "bg-red-500/10 text-red-500 border border-red-500/20";
            case "processing": return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
            default: return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
        }
    };

    const getStatusLabel = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case "delivered": return t('ord_status_delivered');
            case "cancelled": return t('ord_status_cancelled');
            case "shipped": return t('ord_status_shipped');
            case "confirmed": return t('ord_status_confirmed');
            case "assigned": return t('ord_status_assigned');
            default: return t('ord_status_pending');
        }
    };

    const getPlaceholder = () => {
        if (lang === 'uz') return "ID, Mijoz ismi yoki Tel bo'yicha qidirish...";
        if (lang === 'ru') return "Поиск по ID, Имени или Телефону...";
        return "Search by ID, Name or Phone...";
    };

    // Client-side quick filter logic
    const filteredOrders = orders.filter(o => {
        const query = searchQuery.toLowerCase().trim().replace("#", "");
        if (!query) return true;
        
        const matchesFullId = o.id.toLowerCase().includes(query);
        const matchesShortId = o.id.slice(-6).toLowerCase().includes(query);
        
        const customerName = (o.customer?.fullName || o.shippingAddress?.fullName || o.customerName || "").toLowerCase();
        const matchesName = customerName.includes(query);
        
        const customerPhone = (o.customer?.phone || o.phone || "").toLowerCase();
        const matchesPhone = customerPhone.includes(query);
        
        return matchesFullId || matchesShortId || matchesName || matchesPhone;
    });

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">{t('ord_global_orders')}</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">{t('ord_global_desc')}</p>
                </div>

                {/* PREMIUM SEARCH BOX */}
                <div className="w-full md:w-96 relative">
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getPlaceholder()}
                            className="w-full bg-surface dark:bg-zinc-900 border border-surface-100 dark:border-white/10 rounded-2xl pl-12 pr-10 py-3.5 text-xs font-bold transition-all focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-foreground placeholder:text-surface-400 shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-foreground transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-surface dark:bg-zinc-900 rounded-3xl shadow-premium border border-surface-50 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 dark:bg-zinc-800/50 border-b border-surface-100 dark:border-white/5 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5 whitespace-nowrap">{t('ord_order_id')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('ord_customer')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('ord_date')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('ord_total')}</th>
                                <th className="px-8 py-5 whitespace-nowrap">{t('ord_status')}</th>
                                <th className="px-8 py-5 text-right whitespace-nowrap">{t('ord_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100 dark:divide-white/5 text-sm font-bold">
                            {loading ? (
                                <tr><td colSpan="6" className="p-20 text-center text-surface-300 italic uppercase font-black text-[10px] tracking-widest animate-pulse">{t('ord_loading')}</td></tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr><td colSpan="6" className="p-20 text-center text-surface-400 uppercase font-black text-[10px] tracking-widest">{t('ord_no_found')}</td></tr>
                            ) : (
                                filteredOrders.map((o) => (
                                    <tr key={o.id} className="hover:bg-surface-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5 text-surface-400 font-mono text-[10px] uppercase">#{o.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-5 text-foreground">
                                            <div className="flex flex-col">
                                                <span className="text-sm">{o.customer?.fullName || o.shippingAddress?.fullName || o.customerName || t('dash_guest')}</span>
                                                <span className="text-[9px] text-surface-400 uppercase tracking-widest">{o.customer?.phone || o.phone || 'NO_PHONE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-surface-500 text-[11px] font-black uppercase">{formatDate(o.createdAt)}</td>
                                        <td className="px-8 py-5 text-foreground font-black tracking-tight whitespace-nowrap">
                                            {formatPrice(o.totalAmount || o.total || 0, currency, exchangeRate)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                                                {getStatusLabel(o.status)}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-2 bg-surface-50 dark:bg-white/10 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all whitespace-nowrap">
                                                {t('ord_details')} <span>→</span>
                                            </Link>
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
