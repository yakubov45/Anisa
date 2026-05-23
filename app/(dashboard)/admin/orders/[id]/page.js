"use client"

import { useState, useEffect } from "react";
import { getOrderByIdAction, updateOrderAction } from "@/lib/actions/order.actions";
import { getUsersByRoleAction } from "@/lib/actions/user.actions";
import { useParams, useRouter } from "next/navigation";
import { formatPrice, formatDate } from "@/lib/utils";
import Link from "next/link";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function OrderDetailsPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const router = useRouter();
    const { currency, exchangeRate } = useStore();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [couriers, setCouriers] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const result = await getOrderByIdAction(id);
                if (result.success && result.order) {
                    setOrder(result.order);
                    setSelectedCourier(result.order.deliveryId || "");
                } else {
                    router.push("/admin/orders");
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        const fetchCouriers = async () => {
            try {
                const result = await getUsersByRoleAction("delivery");
                if (result.success) setCouriers(result.users);
            } catch (e) {
                console.error("Couriers fetch error:", e);
            }
        };
        fetchOrder();
        fetchCouriers();
    }, [id, router]);

    const handleStatusChange = async (newStatus) => {
        setUpdating(true);
        try {
            const result = await updateOrderAction(id, { status: newStatus });
            if (result.success) setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdating(false);
        }
    };

    const handleAssignCourier = async () => {
        if (!selectedCourier) return;
        setUpdating(true);
        try {
            const result = await updateOrderAction(id, {
                deliveryId: selectedCourier,
                status: "Shipped"
            });
            if (result.success) {
                setOrder({ ...order, deliveryId: selectedCourier, status: "Shipped" });
                alert("Courier assigned and shipment initiated.");
            }
        } catch (error) {
            console.error("Error assigning courier:", error);
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/orders" className="w-10 h-10 bg-surface dark:bg-zinc-900 rounded-xl flex items-center justify-center border border-surface-100 dark:border-white/5 hover:text-primary transition-all shadow-sm">
                            ←
                        </Link>
                        <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">{t('det_manifest')}</h1>
                    </div>
                    <p className="text-surface-500 font-bold ml-14">LOG_ID: <span className="font-mono text-xs">#{order.id.toUpperCase()}</span></p>
                </div>

                <div className="flex flex-wrap items-center gap-4 ml-14 md:ml-0">
                    {/* Courier Assignment */}
                    <div className="flex items-center gap-2 bg-surface-50 dark:bg-white/5 p-2 rounded-2xl border border-surface-100 dark:border-white/5">
                        <select
                            value={selectedCourier}
                            onChange={(e) => setSelectedCourier(e.target.value)}
                            className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-foreground min-w-[150px]"
                        >
                            <option value="">{t('admin_search_operatives').replace('_...', '')}</option>
                            {couriers.map(c => (
                                <option key={c.id} value={c.id}>{c.fullName || c.name || c.email}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleAssignCourier}
                            disabled={updating || !selectedCourier}
                            className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-widest hover:bg-white hover:text-black transition-all disabled:opacity-50"
                        >
                            {t('del_accept')}
                        </button>
                    </div>

                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        disabled={updating}
                        className="bg-surface dark:bg-zinc-900 border border-surface-100 dark:border-white/5 rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-primary outline-none cursor-pointer disabled:opacity-50 shadow-sm text-foreground"
                    >
                        <option value="Pending">{t('ord_status_pending')}</option>
                        <option value="Confirmed">{t('ord_status_confirmed')}</option>
                        <option value="Assigned">{t('ord_status_assigned')}</option>
                        <option value="Shipped">{t('ord_status_shipped')}</option>
                        <option value="Delivered">{t('ord_status_delivered')}</option>
                        <option value="Cancelled">{t('ord_status_cancelled')}</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Order Items */}
                    <div className="bg-surface dark:bg-zinc-900 rounded-[2.5rem] shadow-premium border border-surface-50 dark:border-white/5 overflow-hidden">
                        <div className="px-10 py-6 bg-surface-50 dark:bg-zinc-800/50 border-b border-surface-100 dark:border-white/5">
                            <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_cargo_inventory')}</h3>
                        </div>
                        <div className="p-10 space-y-6">
                            {order.items?.map((item, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-surface-50 dark:border-white/5 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-surface-50 dark:bg-black rounded-2xl overflow-hidden border border-surface-100 dark:border-white/5 shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">{item.category}</p>
                                            <h4 className="text-sm font-black text-foreground leading-tight">{item.name}</h4>
                                            <p className="text-xs font-bold text-surface-400 mt-1">QTY: {item.quantity || 1}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-black text-primary">{formatPrice(item.price, currency, exchangeRate)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Customer Info */}
                    <div className="bg-surface dark:bg-zinc-900 p-10 rounded-[2.5rem] shadow-premium border border-surface-50 dark:border-white/5 space-y-6">
                        <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_customer_intel')}</h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[9px] font-black text-surface-300 dark:text-white/30 uppercase tracking-widest mb-1">Full Name</p>
                                <p className="text-sm font-bold text-foreground">
                                    {order.customer?.fullName || order.shippingAddress?.fullName || order.fullName || order.customerName || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-surface-300 dark:text-white/30 uppercase tracking-widest mb-1">Phone Reference</p>
                                <p className="text-sm font-bold text-foreground">
                                    {order.customer?.phone || order.shippingAddress?.phone || order.phone || "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-surface-300 dark:text-white/30 uppercase tracking-widest mb-1">Deployment Address</p>
                                <p className="text-sm font-bold text-foreground leading-relaxed">
                                    {order.customer?.address || order.shippingAddress?.address || order.address || "N/A"}
                                </p>
                                <p className="text-xs text-surface-500 font-medium">
                                    {[order.customer?.region, order.shippingAddress?.city].filter(Boolean).join(', ') || "No Region Data"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-zinc-950 text-white p-10 rounded-[2.5rem] shadow-2xl shadow-black/20 space-y-6 border border-white/5 h-auto min-h-fit">
                        <h3 className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('det_total_valuation')}</h3>
                        <div className="space-y-4 border-b border-white/10 pb-6">
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs font-bold">
                                <span className="text-white/50 uppercase tracking-widest">Subtotal</span>
                                <span className="text-white">{formatPrice(order.totalAmount || order.itemsPrice || order.subtotal || order.total, currency, exchangeRate)}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs font-bold">
                                <span className="text-white/50 uppercase tracking-widest">Logistics</span>
                                <span className="text-white">{formatPrice(order.shippingPrice || 0, currency, exchangeRate)}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-xs font-bold">
                                <span className="text-white/50 uppercase tracking-widest">Tax</span>
                                <span className="text-white">{formatPrice(order.taxPrice || 0, currency, exchangeRate)}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/50">Total_Amount</span>
                            <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white break-words">
                                {formatPrice(order.totalAmount || order.total, currency, exchangeRate)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}