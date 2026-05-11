"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { orderService } from "@/lib/services/order.service";
import OrderQRCode from "@/components/orders/OrderQRCode";
import PriceDisplay from "@/components/common/PriceDisplay";
import Link from "next/link";
import { useTranslation } from "@/lib/LanguageContext";

export default function UserOrderDetails() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const data = await orderService.getById(id);
            setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    if (loading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!order) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
            <h1 className="text-2xl font-black uppercase">{t('det_not_found')}</h1>
            <Link href="/dashboard/user/orders" className="text-primary font-black uppercase text-xs tracking-widest underline">{t('det_back_registry')}</Link>
        </div>
    );

    const isDelivered = order.status === "delivered";

    return (
        <div className="max-w-6xl mx-auto space-y-12 py-10 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">{order.id}</h1>
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDelivered ? 'bg-green-500/10 text-green-500' : 'bg-primary/10 text-primary'}`}>
                            {order.status}
                        </span>
                    </div>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">{t('ord_global_desc')}</p>
                </div>
                
                <Link href="/dashboard/user/orders" className="bg-surface-100 dark:bg-white/5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-200 transition-all">
                    {t('det_back_history')}
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* LEFT: ORDER CONTENT */}
                <div className="lg:col-span-7 space-y-10">
                    {/* ITEMS */}
                    <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 rounded-[3rem] p-10 shadow-xl space-y-8">
                        <div className="border-l-4 border-primary pl-6">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">{t('det_manifest')}</h2>
                            <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest mt-1">{t('det_cargo_inventory')}</p>
                        </div>

                        <div className="space-y-6">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-6 group">
                                    <div className="w-20 h-20 bg-surface-50 dark:bg-black rounded-2xl border border-surface-200 dark:border-white/5 p-3 flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black text-foreground uppercase tracking-tight group-hover:text-primary transition-colors">{item.name}</h4>
                                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest mt-1">{t('ord_quantity')}: {item.quantity}</p>
                                    </div>
                                    <PriceDisplay price={item.price * item.quantity} className="text-sm font-black text-foreground" />
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-surface-100 dark:border-white/5 flex justify-between items-end">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_total_valuation')}</p>
                                <p className="text-xs text-surface-500 font-bold uppercase tracking-widest">{t('det_inclusive_duties')}</p>
                            </div>
                            <PriceDisplay price={order.totalAmount} className="text-3xl font-black text-foreground tracking-tighter" />
                        </div>
                    </div>

                    {/* SHIPPING INFO */}
                    <div className="bg-surface-50 dark:bg-zinc-900/50 border border-surface-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8">
                        <div className="border-l-4 border-surface-300 pl-6">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">{t('det_deployment_logistics')}</h2>
                            <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest mt-1">{t('det_destination_coords')}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_recipient')}</p>
                                <p className="text-sm font-black text-foreground uppercase">{order.customer?.fullName || order.fullName}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_contact')}</p>
                                <p className="text-sm font-black text-foreground uppercase">{order.customer?.phone || order.phone}</p>
                            </div>
                            <div className="space-y-1 col-span-2">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('det_address')}</p>
                                <p className="text-sm font-black text-foreground uppercase leading-relaxed">
                                    {order.customer?.region || order.region}, {order.customer?.address || order.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: VERIFICATION QR */}
                <div className="lg:col-span-5 sticky top-32 space-y-8">
                    {!isDelivered ? (
                        <div className="bg-white dark:bg-zinc-900 border-2 border-primary/20 rounded-[3rem] p-10 shadow-2xl flex flex-col items-center text-center space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                            
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">{t('det_security_pass')}</h3>
                                <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest max-w-[200px] mx-auto">{t('det_present_code')}</p>
                            </div>

                            {order.verification?.token ? (
                                <>
                                    <OrderQRCode 
                                        orderId={order.id} 
                                        token={order.verification.token} 
                                        size={220}
                                        isHighValue={order.totalAmount > 1000}
                                    />

                                    <div className="bg-surface-50 dark:bg-black/40 p-6 rounded-2xl border border-surface-200 dark:border-white/5 w-full">
                                        <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest mb-2">{t('det_manual_token')}</p>
                                        <p className="text-sm font-black text-primary tracking-[0.3em] font-mono select-all">
                                            {order.verification.token.toUpperCase()}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2 text-orange-500">
                                        <span className="animate-pulse">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </span>
                                        <span className="text-[9px] font-black uppercase tracking-widest">{t('det_expires_72')}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-orange-500/10 border border-orange-500/20 p-8 rounded-2xl space-y-4 w-full">
                                    <div className="flex justify-center text-orange-500">
                                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{t('det_legacy_acq')}</p>
                                        <p className="text-[11px] font-bold text-surface-500 uppercase leading-relaxed">
                                            {t('det_legacy_desc')}
                                        </p>
                                    </div>
                                    <Link href="/faq?q=legacy-order" className="text-[9px] font-black text-primary uppercase tracking-[0.2em] underline">{t('det_protocol_doc')}</Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="bg-green-500 rounded-[3rem] p-10 text-white text-center space-y-6 shadow-2xl shadow-green-500/20">
                            <div className="flex justify-center">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7M9 19H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-4"/></svg>
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">{t('det_mission_accomplished')}</h3>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-80">{t('det_mission_desc')}</p>
                            <div className="h-px bg-white/20" />
                            <div className="text-[10px] font-black uppercase tracking-widest">
                                {t('det_delivered_at')}: {new Date(order.delivery?.deliveredAt).toLocaleString()}
                            </div>
                        </div>
                    )}

                    <div className="bg-surface-900 text-white p-8 rounded-[2rem] space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest">{t('det_protocol_support')}</h4>
                        <p className="text-xs text-surface-400 font-medium">{t('det_support_desc')}</p>
                        <Link href="/faq" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline inline-block">{t('det_visit_faq')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
