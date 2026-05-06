"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useTranslation } from "@/lib/LanguageContext";
import Link from "next/link";

function ResetPasswordForm() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [status, setStatus] = useState("verifying"); // verifying, ready, success, error
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [oobCode, setOobCode] = useState("");

    useEffect(() => {
        const code = searchParams.get("oobCode");
        if (!code) {
            setStatus("error");
            setError("Invalid or missing recovery code.");
            return;
        }
        setOobCode(code);

        // Verify the code is still valid
        verifyPasswordResetCode(auth, code)
            .then(() => setStatus("ready"))
            .catch((err) => {
                console.error(err);
                setStatus("error");
                setError("Recovery code has expired or has already been used.");
            });
    }, [searchParams]);

    const handleReset = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            setStatus("success");
            setTimeout(() => router.push("/login"), 3000);
        } catch (err) {
            console.error(err);
            setError("Failed to reset password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 p-10 md:p-14 rounded-[3rem] shadow-2xl border border-surface-200 dark:border-white/10 space-y-10 animate-slide-up relative overflow-hidden">
            
            {/* Decorative Elements */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />

            <div className="text-center space-y-3 relative">
                <div className="text-4xl mb-4">🛡️</div>
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase leading-tight">
                    {status === "success" ? "Access Restored" : "Reset Password"}
                </h1>
                <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">
                    {status === "success" ? "Security protocol complete" : "Update your security credentials"}
                </p>
            </div>

            {status === "verifying" && (
                <div className="text-center py-10">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-surface-500">Verifying Security Code...</p>
                </div>
            )}

            {status === "error" && (
                <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-pop-in">
                    <p className="text-red-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                        {error}
                    </p>
                    <Link href="/forgot-password" size="sm" className="block text-primary font-black text-[10px] uppercase tracking-widest hover:underline">
                        Request New Link
                    </Link>
                </div>
            )}

            {status === "success" && (
                <div className="bg-green-500/10 border border-green-500/20 p-8 rounded-[2rem] text-center space-y-6 animate-pop-in">
                    <p className="text-green-500 font-black text-[10px] uppercase tracking-widest leading-relaxed">
                        Password updated successfully. Redirecting to login portal...
                    </p>
                </div>
            )}

            {status === "ready" && (
                <form onSubmit={handleReset} className="space-y-8 relative">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-500 text-[10px] font-black uppercase text-center">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">New Password</label>
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-400 text-foreground font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-2">Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-primary/40 outline-none transition-all placeholder:text-surface-400 text-foreground font-bold"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-[0.2em]"
                    >
                        {loading ? "Syncing..." : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-surface to-surface px-4 py-20">
            <Suspense fallback={
                <div className="w-full max-w-[480px] bg-white dark:bg-zinc-900 p-20 rounded-[3rem] shadow-2xl border border-surface-200 dark:border-white/10 text-center">
                    <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto" />
                </div>
            }>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
