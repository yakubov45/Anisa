"use client";

import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROLES } from "../constants";

export function DeliveryGuard({ children }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        const allowedRoles = [ROLES.DELIVERY, ROLES.ADMIN, ROLES.SUPERADMIN];
        if (!loading && (!user || !allowedRoles.includes(user.role))) {
            router.push("/");
        }
    }, [user, loading, router]);

    const allowedRoles = [ROLES.DELIVERY, ROLES.ADMIN, ROLES.SUPERADMIN];
    if (loading || !user || !allowedRoles.includes(user.role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            </div>
        );
    }

    return children;
}
