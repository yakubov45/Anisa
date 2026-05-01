"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"

export default function DeliveryDashboard() {
    const { user } = useUser()
    const [stats, setStats] = useState({
        active: 0,
        deliveredToday: 0,
        pending: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchStats() {
            if (!user) return
            try {
                const allOrders = await orderService.getAllOrders()
                // Filter for assigned to this delivery person or available to accept
                const myActive = allOrders.filter(o => o.deliveryId === user.uid && o.status === ORDER_STATUS.SHIPPED).length
                const deliveredToday = allOrders.filter(o => o.deliveryId === user.uid && o.status === ORDER_STATUS.DELIVERED).length
                const available = allOrders.filter(o => o.status === ORDER_STATUS.CONFIRMED).length

                setStats({
                    active: myActive,
                    deliveredToday,
                    pending: available
                })
            } catch (error) {
                console.error("Failed to fetch delivery stats:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [user])

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Logistics Command</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Delivery Console</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <Link href="/delivery/scan" className="bg-primary text-white font-black px-8 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 flex items-center gap-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                        Scan QR Code
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Active Deliveries", value: stats.active, icon: "🚚", color: "text-primary" },
                    { label: "Delivered Today", value: stats.deliveredToday, icon: "✅", color: "text-primary" },
                    { label: "Available Orders", value: stats.pending, icon: "⏳", color: "text-primary" }
                ].map((stat, i) => (
                    <div key={i} className="bg-[#161B22] border border-white/10 p-8 rounded-[2.5rem] space-y-4 hover:bg-[#1c2229] transition-all group shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                            <span className={`text-5xl font-black ${stat.color} tracking-tighter`}>{stat.value}</span>
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { name: "My Active Orders", href: "/delivery/orders", icon: "📦" },
                    { name: "Order History", href: "/delivery/history", icon: "📊" },
                    { name: "QR Verification", href: "/delivery/scan", icon: "🔐" },
                    { name: "Support Chat", href: "https://t.me/onepc_support", icon: "💬", external: true }
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
                        <h3 className="text-lg font-black text-white uppercase tracking-tight">Tactical Deployment Map</h3>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Real-time Grid Synchronization</p>
                    </div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Live Status
                    </span>
                </div>
                <div className="aspect-[21/9] w-full rounded-[2rem] overflow-hidden border border-white/5">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95897.16450684252!2d69.2401!3d41.2995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc5d13f23%3A0x497f4800361234!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1714480000000!5m2!1sen!2s" 
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </div>
    )
}
