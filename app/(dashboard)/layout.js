"use client";
 
import { useState } from "react";

import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import { usePathname } from "next/navigation";
import { AdminGuard } from "@/lib/guards/admin.guard";
import { UserGuard } from "@/lib/guards/user.guard";
import { DeliveryGuard } from "@/lib/guards/delivery.guard";
import { useTranslation } from "@/lib/LanguageContext";

export default function DashboardLayout({ children }) {
    const { t } = useTranslation();
    const { user } = useUser();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isUserRoute = pathname.startsWith("/user");
    const isAdminRoute = pathname.startsWith("/admin");
    const isDeliveryRoute = pathname.startsWith("/delivery");

    const NavItem = ({ href, label, icon }) => {
        const active = pathname === href;
        return (
            <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-surface-500 hover:bg-surface-50 hover:text-surface-900"
                }`}>
                <span className={`w-5 h-5 flex items-center justify-center ${active ? "text-white" : "text-surface-400"}`}>
                    {icon}
                </span>
                {label}
            </Link>
        );
    };

    const Sidebar = ({ isMobile = false }) => (
        <aside className={`${isMobile ? 'w-full h-full' : 'w-72 hidden lg:flex'} bg-surface border-r border-surface-100 flex flex-col h-[calc(100vh-80px)] sticky top-20 p-6`}>
            <div className="flex-1 space-y-2">
                {isAdminRoute && (
                    <>
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-4 pb-2">{t('dash_admin_control')}</p>
                        <NavItem href="/admin" label={t('dash_overview')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>} />
                        <NavItem href="/admin/products" label={t('dash_products')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>} />
                        <NavItem href="/admin/orders" label={t('dash_orders')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>} />
                        {user?.role === 'superadmin' && (
                            <NavItem href="/admin/users" label={t('dash_users')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>} />
                        )}
                        <NavItem href="/admin/categories" label={t('dash_categories')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M17 7h.01M17 11h.01M17 15h.01" /></svg>} />
                        <NavItem href="/admin/analytics" label={t('dash_analytics')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>} />
                        <NavItem href="/admin/banners" label={t('dash_banners')} icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} />
                        <NavItem href="/admin/pc-builder-hero" label="PC Builder Hero" icon={<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>} />
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

            <div className="pt-6 border-t border-surface-100">
                <div className="bg-surface-50 p-4 rounded-2xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary flex items-center justify-center text-white font-black">
                        {(user?.photoURL || user?.avatar) ? (
                            <img src={user.photoURL || user.avatar} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span>{user?.name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}</span>
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-black text-surface-900 truncate">{user?.name || t('dash_guest')}</p>
                        <p className="text-[10px] font-bold text-surface-400 capitalize">{user?.role || "user"}</p>
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
                    className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isSidebarOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                    </svg>
                </button>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}>
                        <div className="w-72 h-full" onClick={e => e.stopPropagation()}>
                            <Sidebar isMobile />
                        </div>
                    </div>
                )}

                <Sidebar />
                <main className="flex-1 min-h-[calc(100vh-120px)] animate-fade-in translate-y-4 opacity-0 [animation-fill-mode:forwards] p-4 lg:p-0">
                    {children}
                </main>
            </div>
        </Guard>
    );
}
