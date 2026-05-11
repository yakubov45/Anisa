"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { getDeliveryOrdersAction } from "@/lib/actions/order.actions"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"
import { useTranslation } from "@/lib/LanguageContext"

export default function DeliveryHistory() {
    const { t } = useTranslation();
    const { user } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHistory() {
            if (!user) return
            try {
                const result = await getDeliveryOrdersAction(user.uid, "my")
                if (result.success) {
                    setOrders(result.orders.filter(o => o.status === ORDER_STATUS.DELIVERED))
                }
            } catch (error) {
                console.error("Failed to fetch delivery history:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [user])

    const totalEarnings = orders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0)

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('hist_archives')}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t('hist_mission')}</h1>
                </div>

                <div className="bg-[#161B22] border border-white/5 px-8 py-4 rounded-2xl flex items-center gap-6">
                    <div className="space-y-1 text-right">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{t('hist_total_cargo')}</p>
                        <p className="text-xl font-black text-white">$ {totalEarnings.toLocaleString()}</p>
                    </div>
                    <div className="w-[1px] h-10 bg-white/10" />
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{t('hist_completed')}</p>
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
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t('hist_empty')}</p>
                </div>
            ) : (
                <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('hist_manifest_id')}</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('hist_customer')}</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('hist_date')}</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest">{t('hist_valuation')}</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-white/40 uppercase tracking-widest text-right">{t('hist_protocol')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.map(order => (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-mono font-black text-primary uppercase">#{order.id.slice(-6).toUpperCase()}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-black text-white uppercase">
                                                {order.shippingAddress?.fullName || order.customer?.fullName || order.customerName || "—"}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-bold text-white/60">
                                                {order.updatedAt ? new Date(typeof order.updatedAt === 'string' ? order.updatedAt : order.updatedAt.toDate?.() || Date.now()).toLocaleString() : '-'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-[11px] font-black text-white">$ {order.total || order.totalAmount || 0}</p>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Link href={`/delivery/orders/${order.id}`} className="text-[9px] font-black text-white/40 uppercase tracking-widest hover:text-white transition-colors">
                                                {t('hist_view_manifest')}
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
