"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"

export default function DeliveryHistory() {
    const { user } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return
            try {
                const allOrders = await orderService.getAllOrders()
                // Filter for delivered by this person
                setOrders(allOrders.filter(o => o.deliveryId === user.uid && o.status === ORDER_STATUS.DELIVERED))
            } catch (error) {
                console.error("Failed to fetch delivery history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [user])

    const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0)

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Historical Archives</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Mission History</h1>
                </div>

                <div className="bg-[#161B22] border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-6">
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Total Cargo Value</p>
                        <p className="text-xl font-black text-white">$ {totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Completed Jobs</p>
                        <p className="text-xl font-black text-primary">{orders.length}</p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
            ) : orders.length === 0 ? (
                <div className="text-center py-20 bg-[#161B22] rounded-[2.5rem] border border-white/5">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">Archive is currently empty</p>
                </div>
            ) : (
                <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Manifest ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Customer</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Completion Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">Valuation</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-mono font-black text-primary uppercase">#{order.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-black text-white uppercase">{order.customerName}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-bold text-white/60">{new Date(order.updatedAt?.toDate?.() || Date.now()).toLocaleString()}</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-black text-white">$ {order.total}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link href={`/delivery/orders/${order.id}`} className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                                                View Manifest
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
