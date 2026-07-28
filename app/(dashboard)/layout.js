"use client";

import { useState, useEffect, useRef } from "react";

import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/lib/guards/admin.guard";
import { UserGuard } from "@/lib/guards/user.guard";
import { DeliveryGuard } from "@/lib/guards/delivery.guard";
import { useTranslation } from "@/lib/LanguageContext";
import { AnimatePresence, motion } from "framer-motion";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";

export default function DashboardLayout({ children }) {
    const { t } = useTranslation();
    const { user } = useUser();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isSidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen]);

    const isUserRoute = pathname.startsWith("/user");
    const isAdminRoute = pathname.startsWith("/admin");
    const isDeliveryRoute = pathname.startsWith("/delivery");

    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [copiedId, setCopiedId] = useState(false);
    const { currency, exchangeRate } = useStore();
    const mountTimeRef = useRef(Date.now());

    // Lock body scroll when mobile sidebar or new order modal is open
    useEffect(() => {
        if (isSidebarOpen || newOrderAlert) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isSidebarOpen, newOrderAlert]);

    const handleCopyId = (id) => {
        if (!id) return;
        try {
            navigator.clipboard.writeText(id);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } catch (e) {
            console.error("Failed to copy ID:", e);
        }
    };

    // Premium real-time synthesized alert chime note sequence
    const playNotificationSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const playTone = (freq, startTime, duration) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.12, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            const now = audioCtx.currentTime;
            playTone(523.25, now, 0.2);       // Chime 1 (C5)
            playTone(659.25, now + 0.08, 0.2);  // Chime 2 (E5)
            playTone(783.99, now + 0.16, 0.4);  // Chime 3 (G5)
        } catch (e) {
            console.error("Audio synthesis failed:", e);
        }
    };

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) return;

        // Reset the mount timestamp so we only alert on items added AFTER this mount
        mountTimeRef.current = Date.now();

        const q = query(
            collection(db, COLLECTIONS.ORDERS),
            orderBy("createdAt", "desc"),
            limit(1)
        );

        let initialLoad = true;
        const unsubscribe = onSnapshot(
            q, 
            (snapshot) => {
                try {
                    if (snapshot.empty) {
                        initialLoad = false;
                        return;
                    }

                    const docData = snapshot.docs[0];
                    const order = { id: docData.id, ...docData.data() };
                    
                    // Bulletproof date parser for Firestore Timestamps, Strings, or Numbers
                    const getOrderTime = (createdAt) => {
                        if (!createdAt) return Date.now();
                        if (typeof createdAt.toDate === 'function') {
                            return createdAt.toDate().getTime();
                        }
                        if (createdAt.seconds) {
                            return createdAt.seconds * 1000;
                        }
                        const parsed = new Date(createdAt).getTime();
                        return isNaN(parsed) ? Date.now() : parsed;
                    };

                    const orderTime = getOrderTime(order.createdAt);

                    // Fire sound and pop-up modal if it's not the initial loaded doc and is newer than mount time
                    if (!initialLoad && orderTime > mountTimeRef.current - 10000) {
                        // Ensure we update our mount time limit to prevent double alerts
                        mountTimeRef.current = orderTime + 1000;
                        setNewOrderAlert(order);
                        playNotificationSound();
                    }
                    initialLoad = false;
                } catch (err) {
                    console.error("Order snapshot processing error:", err);
                }
            },
            (error) => {
                console.error("Order real-time snapshot subscription failed:", error);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const NavItem = ({ href, label, icon }) => {
        const active = pathname === href;
        return (
            <Link href={href} className={`group flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 relative overflow-hidden ${active 
                ? "bg-gradient-to-r from-primary to-primary-600 text-white shadow-[0_10px_20px_rgba(239,68,68,0.2)]" 
                : "text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-50 dark:hover:bg-white/5"
            }`}>
                {active && (
                    <motion.div 
                        layoutId="activeTab"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                        initial={false}
                    />
                )}
                <span className={`w-6 h-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${active ? "text-white" : "text-surface-400 group-hover:text-primary"}`}>
                    {icon}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${active ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                    {label}
                </span>
            </Link>
        );
    };

    const Sidebar = ({ isMobile = false }) => (
        <aside className={`${isMobile ? 'w-full h-full pb-20' : 'w-80 hidden lg:flex h-[calc(100vh-80px)] sticky top-20'} bg-surface dark:bg-[#0A0A0A] border-r border-surface-100 dark:border-white/5 flex flex-col p-6 z-[40]`}>
            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar">
                {isAdminRoute && (
                    <>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-4 pb-2">{t('dash_admin_control')}</p>
                        <NavItem href="/admin" label={t('dash_overview')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>} />
                        <NavItem href="/admin/products" label={t('dash_products')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>} />
                        <NavItem href="/admin/orders" label={t('dash_orders')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>} />
                        {user?.role === 'superadmin' && (
                            <NavItem href="/admin/users" label={t('dash_users')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>} />
                        )}
                        <NavItem href="/admin/prebuilts" label="Prebuilts" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />
                        <NavItem href="/admin/categories" label={t('dash_categories')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01" /></svg>} />
                        <NavItem href="/admin/brands" label="Brendlar" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z"/></svg>} />
                        <NavItem href="/admin/analytics" label={t('dash_analytics')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>} />
                        <NavItem href="/admin/banners" label={t('dash_banners')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} />
                        <NavItem href="/admin/flash-deals" label={t('dash_flash_deals')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
                        <NavItem href="/admin/currency" label="Valyuta Kursi" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
                        <NavItem href="/admin/stores" label={t('dash_stores')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} />
                    </>
                )}

                {isUserRoute && (
                    <>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-4 pb-2">{t('dash_user_account')}</p>
                        <NavItem href="/user" label={t('dash_overview')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>} />
                        <NavItem href="/user/orders" label={t('dash_my_orders')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>} />
                        <NavItem href="/user/profile" label={t('dash_profile_settings')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} />
                        <NavItem href="/user/wishlist" label={t('dash_my_wishlist')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>} />
                    </>
                )}

                {isDeliveryRoute && (
                    <>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-4 pb-2">{t('dash_delivery_hub')}</p>
                        <NavItem href="/delivery" label={t('dash_dashboard')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4"/></svg>} />
                        <NavItem href="/delivery/orders" label={t('dash_active_orders')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>} />
                        <NavItem href="/delivery/history" label={t('dash_history')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>} />
                    </>
                )}
            </div>

            <div className="pt-6 border-t border-surface-100 dark:border-white/5">
                <div className="bg-surface-50 dark:bg-white/5 p-5 rounded-[2rem] flex items-center gap-4 border border-black/5 dark:border-white/5 group transition-all hover:bg-surface-100 dark:hover:bg-white/10">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                        {(user?.photoURL || user?.avatar) ? (
                            <img src={user.photoURL || user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xl uppercase">{user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-surface-900 dark:text-white truncate uppercase tracking-tighter">{user?.displayName || user?.name || t('dash_guest')}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <p className="text-[9px] font-black text-surface-400 uppercase tracking-widest">{user?.role || "user"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );

    // Pick correct guard
    let Guard = UserGuard;
    if (isAdminRoute) Guard = AdminGuard;
    if (isDeliveryRoute) Guard = DeliveryGuard;

    return (
        <Guard>
            <div className="flex flex-col lg:flex-row gap-0 lg:gap-8 relative">
                {/* Mobile Sidebar Toggle */}
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-8 right-8 z-[100] w-16 h-16 bg-primary text-white rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.4)] flex items-center justify-center active:scale-90 transition-all border-4 border-white dark:border-[#0A0A0A]"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                {/* Mobile Sidebar Overlay */}
                <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ${isSidebarOpen ? 'visible' : 'invisible'}`}>
                    <div 
                        className={`absolute inset-0 bg-background/80 backdrop-blur-md transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
                        onClick={() => setIsSidebarOpen(false)}
                    />
                    <div className={`absolute left-0 top-0 bottom-0 w-80 bg-surface dark:bg-[#0A0A0A] shadow-2xl transition-transform duration-500 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`} onClick={e => e.stopPropagation()}>
                        <Sidebar isMobile />
                    </div>
                </div>

                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-120px)] animate-fade-in p-4 lg:p-0">
                    {children}
                </main>

                {/* Un-dismissable Real-Time New Order Modal */}
                <AnimatePresence>
                    {newOrderAlert && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                            {/* Dark Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/80 backdrop-blur-md"
                            />

                            {/* Modal Card */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.85, y: 30 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] border border-red-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-[0_25px_70px_rgba(239,68,68,0.3)] text-foreground space-y-6 z-10 my-auto overflow-hidden"
                            >
                                {/* Background glow accent */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-surface-200 dark:border-white/10 pb-5">
                                    <div className="flex items-center gap-3">
                                        <div className="relative flex h-4 w-4">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                        </div>
                                        <div>
                                            <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-red-500">🚨 YANGI BUYURTMA KELDI!</h3>
                                            <p className="text-[10px] font-bold uppercase text-surface-400 tracking-widest">Yangi xarid tizimga tushdi</p>
                                        </div>
                                    </div>

                                    {/* Exit 'X' Button */}
                                    <button
                                        onClick={() => setNewOrderAlert(null)}
                                        className="w-10 h-10 rounded-full bg-surface-100 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-foreground font-black text-lg shadow-sm active:scale-95"
                                        title="Yopish"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Order ID Box with Copy Action */}
                                <div className="bg-surface-50 dark:bg-zinc-900/90 border border-surface-200 dark:border-white/10 p-4 rounded-2xl flex items-center justify-between gap-3">
                                    <div className="overflow-hidden">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-0.5">BUYURTMA ID (SEARCH UCHUN)</span>
                                        <span className="text-sm md:text-base font-mono font-black text-foreground truncate block">
                                            #{newOrderAlert.id}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopyId(newOrderAlert.id)}
                                        className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                                            copiedId 
                                                ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                                                : "bg-primary text-white hover:bg-primary-600 shadow-md shadow-primary/20"
                                        }`}
                                    >
                                        {copiedId ? (
                                            <>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                                Nusxalandi!
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                Nusxalash
                                            </>
                                        )}
                                    </button>
                                </div>

                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-surface-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-surface-200 dark:border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-1">Mijoz Ismi</span>
                                        <p className="text-xs font-bold text-foreground truncate">
                                            {newOrderAlert.customer?.fullName || newOrderAlert.fullName || newOrderAlert.shippingAddress?.fullName || "Mehmon"}
                                        </p>
                                    </div>

                                    <div className="bg-surface-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-surface-200 dark:border-white/5">
                                        <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-1">Telefon</span>
                                        <p className="text-xs font-bold text-foreground truncate">
                                            {newOrderAlert.customer?.phone || newOrderAlert.phone || newOrderAlert.shippingAddress?.phone || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Total Price */}
                                <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/20 flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">Umumiy Summa</span>
                                    <span className="text-xl md:text-2xl font-black text-primary tracking-tight">
                                        {formatPrice(newOrderAlert.totalAmount || newOrderAlert.total || 0, currency, exchangeRate)}
                                    </span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                    <Link
                                        href={`/admin/orders/${newOrderAlert.id}`}
                                        onClick={() => setNewOrderAlert(null)}
                                        className="flex-1 bg-primary text-white text-center font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                                    >
                                        Zakazga o'tish →
                                    </Link>

                                    <Link
                                        href={`/admin/orders?search=${newOrderAlert.id}`}
                                        onClick={() => setNewOrderAlert(null)}
                                        className="flex-1 bg-surface-100 dark:bg-zinc-800 text-foreground font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-surface-200 dark:hover:bg-zinc-700 transition-all border border-surface-200 dark:border-white/10 flex items-center justify-center gap-2 active:scale-95 text-center"
                                    >
                                        Zakazlar ro'yxati
                                    </Link>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </Guard>
    );
}
