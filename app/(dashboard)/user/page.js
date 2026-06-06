"use client";

import { useUser } from "@/lib/UserContext";
import { useTranslation } from "@/lib/LanguageContext";

export default function UserOverview() {
    const { user } = useUser();
    const { t } = useTranslation();

    const firstName = user?.name?.split(' ')[0] || t("user_friend") || "Friend";

    return (
        <div className="space-y-10">
            <div className="bg-primary rounded-3xl p-12 text-white relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative z-10 space-y-4">
                    <h1 className="text-4xl font-black tracking-tighter">{t("user_hello")} {firstName}!</h1>
                    <p className="font-medium opacity-90 max-w-sm">{t("user_dashboard_desc") || "From your dashboard you can view your recent orders, manage your shipping addresses, and edit your profile details."}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center font-bold">
                <div className="bg-surface p-10 rounded-3xl shadow-premium border border-surface-50 space-y-4 group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 mx-auto text-primary group-hover:scale-110 transition-transform">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                    </div>
                    <p className="text-surface-900">{t("user_recent_orders") || "Recent Orders"}</p>
                </div>
                <div className="bg-surface p-10 rounded-3xl shadow-premium border border-surface-50 space-y-4 group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 mx-auto text-primary group-hover:scale-110 transition-transform">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <p className="text-surface-900">{t("user_account_settings") || "Account Settings"}</p>
                </div>
                <div className="bg-surface p-10 rounded-3xl shadow-premium border border-surface-50 space-y-4 group cursor-pointer hover:-translate-y-1 transition-all">
                    <div className="w-12 h-12 mx-auto text-primary group-hover:scale-110 transition-transform">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
                    </div>
                    <p className="text-surface-900">{t("user_wishlist") || "Your Wishlist"}</p>
                </div>
            </div>
        </div>
    );
}
