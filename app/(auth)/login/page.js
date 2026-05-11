"use client";
// Route fixed for authentication flow

import { useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { useRouter } from "next/navigation";
import AuthContainer from "@/components/auth/AuthContainer";

export default function LoginPage() {
    const router = useRouter();
    const { user, loading: authLoading } = useUser();

    useEffect(() => {
        if (!authLoading && user) {
            router.push("/user");
        }
    }, [user, authLoading, router]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface px-4 py-20">
            <AuthContainer initialMode="login" />
        </div>
    );
}
