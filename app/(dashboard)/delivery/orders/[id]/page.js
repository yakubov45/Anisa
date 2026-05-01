"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"

export default function DeliveryOrderDetail() {
    const { id } = useParams()
    const { user } = useUser()
    const router = useRouter()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrder() {
            try {
                const data = await orderService.getById(id)
                setOrder(data)
            } catch (error) {
                console.error("Failed to fetch order:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchOrder()
    }, [id])

    const handleStatusUpdate = async (status) => {
        if (!confirm(`Update deployment status to ${status}?`)) return
        try {
            await orderService.updateStatus(id, status)
            setOrder({ ...order, status })
            alert(`Order status updated to ${status}`)
        } catch (error) {
            console.error("Failed to update status:", error)
        }
    }

    if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div>
    if (!order) return <div className="text-center py-20"><p className="text-white/40 uppercase tracking-widest font-black">Order not found</p></div>

    return (
        <div className="space-y-10 animate-fade-in max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <Link href="/delivery/orders" className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] hover:text-primary transition-colors flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" /></svg>
                        Back to Queue
                    </Link>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Manifest #{order.id.slice(-6).toUpperCase()}</h1>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${order.status === ORDER_STATUS.SHIPPED ? 'bg-blue-500/20 text-blue-500' : 'bg-green-500/20 text-green-500'}`}>
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Deployment Intel */}
                <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Customer Intel</h3>
                        <div className="space-y-2">
                            <p className="text-2xl font-black text-white uppercase">{order.customerName}</p>
                            <div className="flex items-center gap-4">
                                <a href={`tel:${order.shippingAddress?.phone}`} className="text-sm font-bold text-white/60 hover:text-white transition-colors underline decoration-primary underline-offset-4">{order.shippingAddress?.phone}</a>
                                <div className="w-1 h-1 bg-white/20 rounded-full" />
                                <span className="text-sm font-bold text-white/40">{order.shippingAddress?.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Target Location</h3>
                        <div className="space-y-4">
                            <p className="text-lg font-bold text-white leading-relaxed">{order.shippingAddress?.address}, {order.shippingAddress?.city}</p>
                            <div className="flex gap-4">
                                <a 
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shippingAddress?.address + " " + order.shippingAddress?.city)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-white/5 border border-white/10 text-white font-black py-4 rounded-xl text-[9px] uppercase tracking-widest text-center hover:bg-white hover:text-black transition-all"
                                >
                                    Open Tactical Map
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cargo Inventory */}
                <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                    <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Cargo Inventory</h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                        {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center justify-between gap-4 border-b border-white/5 pb-4">
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black text-white uppercase tracking-tight line-clamp-1">{item.name}</p>
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Qty: {item.quantity}</p>
                                </div>
                                <span className="text-[10px] font-black text-white">$ {item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Total Valuation</span>
                        <span className="text-2xl font-black text-white">$ {order.total}</span>
                    </div>
                </div>
            </div>

            {/* Action Protocols */}
            <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-10 space-y-8 text-center">
                <h3 className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Mission Protocols</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {order.status === ORDER_STATUS.ASSIGNED && (
                        <button 
                            onClick={() => handleStatusUpdate(ORDER_STATUS.SHIPPED)}
                            className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-blue-600/20"
                        >
                            Initiate Delivery
                        </button>
                    )}
                    
                    {order.status === ORDER_STATUS.SHIPPED && (
                        <>
                            <Link 
                                href={`/delivery/scan?id=${order.id}`}
                                className="w-full bg-primary text-white font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                                Scan Verification
                            </Link>
                            <button 
                                onClick={() => handleStatusUpdate(ORDER_STATUS.DELIVERED)}
                                className="w-full bg-green-600 text-white font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-xl shadow-green-600/20"
                            >
                                Force Confirmation
                            </button>
                        </>
                    )}
                    
                    {order.status !== ORDER_STATUS.DELIVERED && (
                        <button 
                            onClick={() => handleStatusUpdate(ORDER_STATUS.CANCELLED)}
                            className="w-full bg-red-600/10 border border-red-600/20 text-red-500 font-black py-6 rounded-2xl uppercase text-xs tracking-[0.2em] hover:bg-red-600 hover:text-white transition-all"
                        >
                            Abort Deployment
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
