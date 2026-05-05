"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/lib/services/order.service";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from 'next/link';
import useStore from "@/store/useStore";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currency, exchangeRate } = useStore();

    useEffect(() => {
        const fetch = async () => {
            const data = await orderService.getAllOrders();
            setOrders(data);
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

    const getDisplayPrice = (usdPrice) => {
        const price = Number(usdPrice) || 0;
        return currency === 'UZS' ? price * exchangeRate : price;
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">Global Orders</h1>
                <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">Monitor sales performance and shipping fulfillment status.</p>
            </div>

            <div className="bg-surface dark:bg-zinc-900 rounded-3xl shadow-premium border border-surface-50 dark:border-white/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-50 dark:bg-zinc-800/50 border-b border-surface-100 dark:border-white/5 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Order ID</th>
                                <th className="px-8 py-5">Customer</th>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Total</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-100 dark:divide-white/5 text-sm font-bold">
                            {loading ? (
                                <tr><td colSpan="6" className="p-20 text-center text-surface-300 italic uppercase font-black text-[10px] tracking-widest animate-pulse">Fetching logistics data...</td></tr>
                            ) : orders.length === 0 ? (
                                <tr><td colSpan="6" className="p-20 text-center text-surface-400 uppercase font-black text-[10px] tracking-widest">No orders found in registry</td></tr>
                            ) : (
                                orders.map((o) => (
                                    <tr key={o.id} className="hover:bg-surface-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-5 text-surface-400 font-mono text-[10px] uppercase">#{o.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-8 py-5 text-foreground">
                                            <div className="flex flex-col">
                                                <span className="text-sm">{o.customer?.fullName || o.shippingAddress?.fullName || o.customerName || "User"}</span>
                                                <span className="text-[9px] text-surface-400 uppercase tracking-widest">{o.customer?.phone || o.phone || 'NO_PHONE'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-surface-500 text-[11px] font-black uppercase">{formatDate(o.createdAt)}</td>
                                        <td className="px-8 py-5 text-foreground font-black tracking-tight whitespace-nowrap">
                                            {formatPrice(getDisplayPrice(o.totalAmount || o.total || 0), currency)}
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                                                {o.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <Link href={`/admin/orders/${o.id}`} className="inline-flex items-center gap-2 bg-surface-50 dark:bg-white/10 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                                Details <span>→</span>
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
