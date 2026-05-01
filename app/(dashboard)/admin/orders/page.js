"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/lib/services/order.service";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from 'next/link';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const data = await orderService.getAllOrders();
            setOrders(data);
            setLoading(false);
        };
        fetch();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-50 text-green-600";
            case "Cancelled": return "bg-red-50 text-red-600";
            case "Processing": return "bg-blue-50 text-blue-600";
            default: return "bg-yellow-50 text-yellow-600";
        }
    };

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-surface-900 tracking-tighter">Global Orders</h1>
                <p className="text-surface-500 font-medium text-sm">Monitor sales performance and shipping fulfillment status.</p>
            </div>

            <div className="bg-surface rounded-3xl shadow-premium border border-surface-50 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-surface-50 border-b border-surface-100 text-[10px] font-black text-surface-400 uppercase tracking-widest">
                        <tr>
                            <th className="px-8 py-5">Order ID</th>
                            <th className="px-8 py-5">Customer</th>
                            <th className="px-8 py-5">Date</th>
                            <th className="px-8 py-5">Total</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100 text-sm font-bold">
                        {loading ? (
                            <tr><td colSpan="6" className="p-10 text-center text-surface-300 italic">Fetching logistics data...</td></tr>
                        ) : (
                            orders.map((o) => (
                                <tr key={o.id} className="hover:bg-surface-50/50 transition-colors">
                                    <td className="px-8 py-5 text-surface-400 font-mono text-xs">#{o.id.slice(-6).toUpperCase()}</td>
                                    <td className="px-8 py-5 text-surface-900">{o.customerName || "User"}</td>
                                    <td className="px-8 py-5 text-surface-500">{formatDate(o.createdAt)}</td>
                                    <td className="px-8 py-5 text-surface-900">{formatPrice(o.total)}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${getStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <Link href={`/admin/orders/${o.id}`} className="text-primary font-black hover:underline transition-all">Details</Link>
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
