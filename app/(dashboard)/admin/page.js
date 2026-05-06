"use client";

import { useUser } from "@/lib/UserContext";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS, ORDER_STATUS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminOverview() {
    const { t } = useTranslation();
    const { user } = useUser();
    const { currency, exchangeRate } = useStore();
    const [stats, setStats] = useState([
        { label: t('admin_total_products'), value: "...", growth: t('admin_hardware_units'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
        { label: t('admin_active_orders'), value: "0", growth: t('admin_pending').replace('{count}', '0'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
        { label: t('admin_user_base'), value: "...", growth: t('admin_registered_clients'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
        { label: t('admin_total_revenue'), value: "$0", growth: t('admin_life_time'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const productSnapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
                const userSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
                const orderSnapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));

                const orders = orderSnapshot.docs.map(d => d.data());
                const pendingOrdersCount = orders.filter(o => {
                    const status = o.status?.toLowerCase();
                    return status === ORDER_STATUS.PENDING || status === 'pending' || status === 'processing';
                }).length;

                const totalRevenueUSD = orders.reduce((acc, o) => acc + (Number(o.totalAmount || o.total) || 0), 0);
                const displayRevenue = currency === 'UZS' ? totalRevenueUSD * exchangeRate : totalRevenueUSD;

                setStats([
                    { label: t('admin_total_products'), value: productSnapshot.size.toString(), growth: t('admin_hardware_units'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
                    { label: t('admin_active_orders'), value: pendingOrdersCount.toString(), growth: t('admin_pending').replace('{count}', pendingOrdersCount), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
                    { label: t('admin_user_base'), value: userSnapshot.size.toString(), growth: t('admin_registered_clients'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
                    { label: t('admin_total_revenue'), value: formatPrice(displayRevenue, currency), growth: t('admin_life_time'), icon: <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                ]);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, [currency, exchangeRate, t]);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">{t('admin_command_center')}</h1>
                <p className="text-surface-500 font-bold">
                    {t('admin_authenticated_as').replace('{name}', user?.name || t('admin_administration'))}. {t('admin_node_status')}: <span className="text-green-500 uppercase">OPTIMAL</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-surface p-8 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-4 hover:shadow-2xl transition-all group">
                        <div className="flex justify-between items-start">
                            <div className="w-10 h-10 text-primary group-hover:scale-110 transition-transform">{stat.icon}</div>
                            <span className="text-[10px] font-black px-2.5 py-1 bg-surface-50 text-surface-400 rounded-lg uppercase tracking-widest">{stat.growth}</span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <p className="text-3xl font-black text-surface-900 tracking-tighter">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Breakdown */}
                <div className="lg:col-span-2 bg-surface p-10 rounded-[2.5rem] shadow-premium border border-surface-50">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-black text-surface-900 tracking-tight uppercase">{t('admin_recent_transactions')}</h3>
                        <Link href="/admin/orders" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">{t('admin_view_all')}</Link>
                    </div>
                    <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-50">
                        <div className="w-16 h-16 bg-surface-50 rounded-2xl flex items-center justify-center text-surface-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                        </div>
                        <p className="text-xs font-black text-surface-400 uppercase tracking-widest">{t('admin_no_transactions')}</p>
                    </div>
                </div>

                {/* Quick Actions / Categories */}
                <div className="bg-surface p-10 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-8">
                    <h3 className="text-xl font-black text-surface-900 tracking-tight uppercase">{t('admin_quick_controls')}</h3>
                    <div className="space-y-4">
                        {[
                            { label: t('admin_add_new_product'), href: "/admin/products/new", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>, color: "bg-primary text-white shadow-primary/20 shadow-lg" },
                            { label: t('admin_flash_deals_cluster'), href: "/admin/flash-deals", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-surface-900 text-white shadow-xl shadow-black/10" },
                            { label: t('admin_currency_exchange'), href: "/admin/currency", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, color: "bg-primary text-white shadow-xl shadow-primary/20" },
                            { label: t('admin_manage_inventory'), href: "/admin/products", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, color: "bg-surface-100 text-surface-900" },
                        ].map((action) => (
                            <Link
                                key={action.label}
                                href={action.href}
                                className={`w-full flex items-center justify-between p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all ${action.color}`}
                            >
                                <span className="flex items-center gap-3">{action.icon} {action.label}</span>
                                <span>→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}