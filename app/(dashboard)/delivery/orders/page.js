"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"

export default function DeliveryOrders() {
    const { user } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState("my") // "my" or "available"

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return
            try {
                const allOrders = await orderService.getAllOrders()
                if (tab === "my") {
                    setOrders(allOrders.filter(o => o.deliveryId === user.uid && o.status !== ORDER_STATUS.DELIVERED))
                } else {
                    setOrders(allOrders.filter(o => o.status === ORDER_STATUS.CONFIRMED))
                }
            } catch (error) {
                console.error("Failed to fetch delivery orders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [user, tab])

    const handleAccept = async (orderId) => {
        if (!confirm("Accept this delivery deployment?")) return
        try {
            await orderService.updateStatus(orderId, ORDER_STATUS.SHIPPED)
            // Also need to set deliveryId
            await orderService.updateOrder(orderId, { deliveryId: user.uid })
            setOrders(prev => prev.filter(o => o.id !== orderId))
            alert("Order accepted and assigned to you.")
        } catch (error) {
            console.error("Failed to accept order:", error)
        }
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Fleet Management</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Order Queue</h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-white/5 pb-4">
                {[
                    { id: "my", label: "My Active Jobs" },
                    { id: "available", label: "Available Deployments" }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all ${tab === t.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-[#161B22] rounded-[2.5rem] border border-white/5 border-dashed">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">No active deployments found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-[#161B22] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-primary/30 transition-all group">
                            <div className="space-y-4 flex-1">
                                <div className="flex items-center gap-4">
                                    <span className="text-[9px] font-mono text-primary font-black uppercase bg-primary/10 px-3 py-1 rounded-lg">#{order.id.slice(-6).toUpperCase()}</span>
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">{new Date(order.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">{order.customerName || "System User"}</h3>
                                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider mt-1">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{order.status}</span>
                                    </div>
                                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">$ {order.total}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {tab === "available" ? (
                                    <button 
                                        onClick={() => handleAccept(order.id)}
                                        className="bg-primary text-white font-black px-8 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20"
                                    >
                                        Accept Deployment
                                    </button>
                                ) : (
                                    <>
                                        <Link href={`/delivery/orders/${order.id}`} className="bg-white/5 text-white font-black px-6 py-4 rounded-xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all border border-white/10">
                                            Manage Order
                                        </Link>
                                        <a href={`tel:${order.shippingAddress?.phone}`} className="w-14 h-14 flex items-center justify-center bg-green-600/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-600 hover:text-white transition-all">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </a>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
