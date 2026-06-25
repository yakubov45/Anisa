"use client";

import { useUser } from "../UserContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { ROLES } from "../constants";

export function AdminGuard({ children }) {
    const { user, loading } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            const hasAccess = user && (user.role === ROLES.ADMIN || user.role === ROLES.SUPERADMIN);
            if (!hasAccess) {
                router.push("/");
                return;
            }

            // Yordamchi adminni (admin) ayrim joylardan cheklash
            if (user.role === ROLES.ADMIN) {
                if (pathname.includes('/admin/users')) {
                    router.push("/admin"); // Ruxsat etilmagan bo'lsa, asosiy admin panelga qaytaradi
                }
            }
        }
    }, [user, loading, router, pathname]);

    const hasAccess = user && (user.role === ROLES.ADMIN || user.role === ROLES.SUPERADMIN);
    if (loading || !hasAccess) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (user.role === ROLES.ADMIN && pathname.includes('/admin/users')) {
        return null;
    }

    return children;
}
