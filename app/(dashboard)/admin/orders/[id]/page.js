"use client"

import { useState, useEffect } from "react";
import { orderService } from "@/lib/services/order.service";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getById(id);
                if (data) {
                    setOrder(data);
                } else {
                    router.push("/admin/orders");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, router]);

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            await orderService.updateStatus(id, newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-5xl space-y-12 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders" className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center border border-surface-100 hover:text-primary transition-all shadow-sm">
                            ←
                        </Link>
                        <h1 className="text-3xl font-black text-surface-900 tracking-tighter uppercase">Order_Manifest</h1>
                    </div>
                    <p className="text-surface-500 font-bold ml-14">LOG_ID: <span className="font-mono text-xs">#{order.id.toUpperCase()}</span></p>
                </div>

                <div className="flex items-center gap-4">
                    <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className="bg-surface border border-surface-100 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-surface rounded-[2.5rem] shadow-premium border border-surface-50 overflow-hidden">
                        <div className="px-10 py-6 bg-surface-50 border-b border-surface-100">
                            <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Hardware Configuration</h3>
                        </div>
                        <div className="p-10 space-y-6">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between gap-6 pb-6 border-b border-surface-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-surface-50 rounded-2xl overflow-hidden border border-surface-100 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{item.category}</p>
                                            <h4 className="text-sm font-black text-surface-900 leading-tight">{item.name}</h4>
                                            <p className="text-xs font-bold text-surface-400 mt-1">QTY: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-primary">{formatPrice(item.price)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-surface p-10 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-6">
                        <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Client Metadata</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-surface-300 uppercase tracking-widest mb-1">Full Name</p>
                                <p className="text-sm font-bold text-surface-900">{order.shippingAddress?.fullName || order.customerName || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-surface-300 uppercase tracking-widest mb-1">Phone Reference</p>
                                <p className="text-sm font-bold text-surface-900">{order.shippingAddress?.phone || "N/A"}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-surface-300 uppercase tracking-widest mb-1">Deployment Address</p>
                                <p className="text-sm font-bold text-surface-900 leading-relaxed">{order.shippingAddress?.address || "N/A"}</p>
                                <p className="text-xs text-surface-500 font-medium">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-surface-900 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 space-y-6">
                        <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Billing Summary</h3>
                        <div className="space-y-3 border-b border-white/10 pb-6">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-white/50">Subtotal</span>
                                <span>{formatPrice(order.itemsPrice || order.total)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-white/50">Logistics</span>
                                <span>{formatPrice(order.shippingPrice || 0)}</span>
                            </div>
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-white/50">Tax</span>
                                <span>{formatPrice(order.taxPrice || 0)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Total_Amount</span>
                            <span className="text-3xl font-black tracking-tighter">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
