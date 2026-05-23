"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { useTranslation } from "@/lib/LanguageContext";
import { getUserOrdersAction } from "@/lib/actions/order.actions";
import SkeletonLoading from "@/components/common/SkeletonLoading";
import Link from 'next/link';
import { formatPrice, formatDate } from "@/lib/utils";
import useStore from "@/store/useStore";

export default function UserOrdersPage() {
    const { user } = useUser();
    const { t } = useTranslation();
    const { currency, exchangeRate } = useStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.uid) {
            getUserOrdersAction(user.uid).then(res => {
                if (res.success) {
                    setOrders(res.orders);
                }
                setLoading(false);
            });
        }
    }, [user]);

    if (loading) return (
        <div className="py-10">
            <SkeletonLoading text={t('loading_manifest') || "LOADING MANIFEST..."} />
        </div>
    );

    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-surface-900 tracking-tighter">{t('dash_my_orders')}</h1>
                <p className="text-surface-500 font-medium text-sm">{t('dash_orders_desc')}</p>
            </div>

            {orders.length === 0 ? (
                <div className="bg-surface p-20 rounded-[2.5rem] shadow-premium text-center space-y-4">
                    <div className="text-5xl opacity-20 grayscale">📦</div>
                    <h3 className="text-xl font-bold text-surface-900">{t('ord_empty')}</h3>
                    <p className="text-surface-500 font-medium">{t('ord_empty_desc')}</p>
                    <Link href="/products" className="inline-block bg-primary text-white font-black px-10 py-4 rounded-xl shadow-lg shadow-primary/20 mt-4">{t('ord_start_shopping')}</Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map(o => (
                        <div key={o.id} className="bg-surface p-8 rounded-3xl shadow-premium border border-surface-50 flex items-center justify-between hover:border-primary/20 transition-all group">
                            <div className="flex gap-8 items-center">
                                <div className="w-16 h-16 bg-surface-50 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-surface-400 uppercase tracking-widest mb-1">{t('ord_number')}{o.id.slice(-6).toUpperCase()}</p>
                                    <h4 className="text-lg font-black text-surface-900">{formatPrice(o.totalAmount || o.total, currency, exchangeRate)}</h4>
                                    <p className="text-xs text-surface-400 font-bold">{formatDate(o.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                                <span className="bg-yellow-50 text-yellow-600 text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest">{o.status}</span>
                                <Link href={`/user/orders/${o.id}`} className="text-primary font-bold text-sm hover:underline">{t('ord_track')}</Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
