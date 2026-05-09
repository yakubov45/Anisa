"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"
import { useTranslation } from "@/lib/LanguageContext"

export default function DeliveryDashboard() {
    const { t } = useTranslation();
    const { user } = useUser()
    const [activeOrders, setActiveOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [manualSearch, setManualSearch] = useState("");
    const [stats, setStats] = useState({
        active: 0,
        deliveredToday: 0,
        pending: 0,
        totalCargoValue: 0,
        completedJobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        // Real-time listener for delivery orders
        const unsubscribe = orderService.listenToDeliveryOrders(user.uid, (orders) => {
            const today = new Date().toDateString();

            const myActiveOrders = orders.filter(o => 
                o.status?.toLowerCase() === ORDER_STATUS.SHIPPED || o.status?.toLowerCase() === ORDER_STATUS.ASSIGNED
            );
            
            const myDeliveredOrders = orders.filter(o => 
                o.status?.toLowerCase() === ORDER_STATUS.DELIVERED
            );

            // Note: We might still need a separate fetch for available orders if they don't have deliveryId
            // but for now let's focus on the assigned ones.
            
            const cargoValue = myActiveOrders.reduce((sum, o) => sum + (Number(o.total) || Number(o.totalAmount) || 0), 0);

            setStats({
                active: myActiveOrders.length,
                deliveredToday: myDeliveredOrders.filter(o => {
                    const orderDate = new Date(o.updatedAt?.toDate?.() || Date.now()).toDateString();
                    return today === orderDate;
                }).length,
                pending: 0, // This would need a separate global listener
                totalCargoValue: cargoValue,
                completedJobs: myDeliveredOrders.length
            });

            setActiveOrders(myActiveOrders);
            
            // Auto-select first mission if none selected
            if (myActiveOrders.length > 0) {
                if (!selectedOrder || !myActiveOrders.find(o => o.id === selectedOrder.id)) {
                    setSelectedOrder(myActiveOrders[0]);
                }
            } else {
                setSelectedOrder(null);
            }
            
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    const latestAddress = selectedOrder ? 
        `${selectedOrder.shippingAddress?.address || selectedOrder.address || ""}, ${selectedOrder.shippingAddress?.city || selectedOrder.city || ""}` : 
        "Tashkent, Uzbekistan";

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('del_command')}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t('del_console')}</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <Link href="/delivery/scan" className="bg-primary text-white font-black px-8 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                        {t('del_scan_qr')}
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {[
                    { label: t('del_active'), value: stats.active, icon: "🚚", color: "text-primary" },
                    { label: t('del_delivered'), value: stats.deliveredToday, icon: "✅", color: "text-green-500" },
                    { label: t('del_available'), value: stats.pending, icon: "⏳", color: "text-yellow-500" },
                    { label: t('hist_total_cargo'), value: `$ ${stats.totalCargoValue}`, icon: "💰", color: "text-blue-500" },
                    { label: t('hist_completed'), value: stats.completedJobs, icon: "🏆", color: "text-purple-500" }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#161B22] border border-white/10 p-6 rounded-[2.5rem] space-y-3 hover:bg-[#1c2229] transition-all group shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl filter grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                            <span className={`text-3xl font-black ${stat.color} tracking-tighter`}>{stat.value}</span>
                        </div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { name: t('del_my_active'), href: "/delivery/orders", icon: "📦" },
                    { name: t('del_history'), href: "/delivery/history", icon: "📊" },
                    { name: t('del_verification'), href: "/delivery/scan", icon: "🔐" },
                    { name: t('del_support'), href: "https://t.me/onepc_support", icon: "💬", external: true }
                ].map((action, i) => (
                    action.external ? (
                        <a key={i} href={action.href} target="_blank" rel="noopener noreferrer" className="bg-[#161B22] border border-white/5 p-8 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-primary transition-all text-center group">
                            <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{action.name}</span>
                        </a>
                    ) : (
                        <Link key={i} href={action.href} className="bg-[#161B22] border border-white/5 p-8 rounded-[2rem] flex flex-col items-center gap-4 hover:bg-primary transition-all text-center group">
                            <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">{action.name}</span>
                        </Link>
                    )
                ))}
            </div>

            {/* Live Tactical Map */}
            <div className="bg-[#161B22] border border-white/10 rounded-[3rem] overflow-hidden p-1 sm:p-2 shadow-2xl">
                <div className="p-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">{t('del_map_title')}</h3>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{t('del_map_sync')}</p>
                    </div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> {t('del_live_status')}
                    </span>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-4 p-4 pt-0">
                    {/* Mission Selector */}
                    <div className="w-full lg:w-80 space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] px-4">{t('del_active')} Missions</p>
                        {activeOrders.length === 0 ? (
                            <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">No Active Targets</p>
                            </div>
                        ) : (
                            activeOrders.map((order) => (
                                <button 
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`w-full p-5 rounded-2xl border transition-all text-left group flex items-center justify-between gap-4 ${selectedOrder?.id === order.id ? 'bg-primary border-primary shadow-lg shadow-primary/20' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                                >
                                    <div className="space-y-1 overflow-hidden">
                                        <p className={`text-[10px] font-black uppercase tracking-tight truncate ${selectedOrder?.id === order.id ? 'text-white' : 'text-white'}`}>
                                            {order.shippingAddress?.fullName || order.customerName || 'Target Alpha'}
                                        </p>
                                        <p className={`text-[8px] font-bold uppercase tracking-widest truncate ${selectedOrder?.id === order.id ? 'text-white/60' : 'text-white/40'}`}>
                                            #{order.id.slice(-6).toUpperCase()} • {order.shippingAddress?.city || order.city || 'HQ'}
                                        </p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full shrink-0 ${selectedOrder?.id === order.id ? 'bg-white animate-pulse' : 'bg-primary'}`} />
                                </button>
                            ))
                        )}
                    </div>

                    {/* Interactive Map */}
                    <div className="flex-1 aspect-[16/9] lg:aspect-auto min-h-[400px] rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-900 flex items-center justify-center relative">
                        {loading ? (
                            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <iframe 
                                    src={`https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(manualSearch || latestAddress)}&z=14`}
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen={true}
                                />
                                {/* Map Overlay Controls */}
                                <div className="absolute top-6 left-6 right-6 flex flex-col gap-4 pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 pointer-events-auto flex items-center gap-2">
                                        <input 
                                            type="text"
                                            value={manualSearch}
                                            onChange={(e) => setManualSearch(e.target.value)}
                                            placeholder="Manual Reconnaissance Search..."
                                            className="flex-1 bg-transparent border-none outline-none text-[10px] font-bold text-white px-4 py-2 placeholder:text-white/20 uppercase tracking-widest"
                                        />
                                        {manualSearch && (
                                            <button 
                                                onClick={() => setManualSearch("")}
                                                className="p-2 text-white/40 hover:text-white transition-colors"
                                            >
                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 pointer-events-auto">
                                        <p className="text-[9px] font-black text-white uppercase tracking-widest">
                                            Focus: <span className="text-primary">{manualSearch ? 'Manual Override' : (selectedOrder ? `#${selectedOrder.id.slice(-6).toUpperCase()}` : 'Global View')}</span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`https://yandex.uz/maps/?text=${encodeURIComponent(manualSearch || latestAddress)}`, '_blank')}
                                        className="bg-primary text-white text-[9px] font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-xl pointer-events-auto hover:bg-white hover:text-black transition-all"
                                    >
                                        Open GPS
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
