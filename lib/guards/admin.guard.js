"use client";

import { useUser } from "../UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ROLES } from "../constants";

export function AdminGuard({ children }) {
    const { user, loading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || user.role !== ROLES.ADMIN)) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading || !user || user.role !== ROLES.ADMIN) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return children;
}
