"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
    const [orderId, setOrderId] = useState("");

    useEffect(() => {
        // Generate a pseudo-random order ID for visual effect
        setOrderId(`OPC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
    }, []);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-10 md:space-y-12 animate-fade-in px-4">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white dark:bg-zinc-900 border-4 border-green-500 text-green-500 flex items-center justify-center rounded-[2rem] md:rounded-[3rem] text-4xl md:text-6xl shadow-2xl">
                    ✓
                </div>
            </div>

            <div className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter uppercase leading-none">Order Confirmed</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] md:text-xs tracking-[0.4em]">Protocol sequence complete</p>
                </div>
                
                <div className="bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-white/5 px-6 py-4 rounded-xl inline-flex flex-col gap-1">
                    <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Tracking Identity</span>
                    <span className="text-sm md:text-lg font-mono font-black text-foreground">{orderId || "GENERATING..."}</span>
                </div>

                <p className="text-surface-600 dark:text-surface-400 font-medium max-w-md mx-auto text-sm md:text-lg leading-relaxed">
                    Your premium setup is now entering the preparation phase. We've sent a detailed manifest to your identity email.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full max-w-md">
                <Link href="/dashboard" className="flex-1 bg-foreground dark:bg-white text-background dark:text-black font-black px-8 py-5 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95">
                    View Orders
                </Link>
                <Link href="/" className="flex-1 bg-surface-100 dark:bg-zinc-800 text-foreground dark:text-white font-black px-8 py-5 rounded-2xl hover:bg-surface-200 dark:hover:bg-zinc-700 transition-all uppercase text-[10px] tracking-widest border border-surface-200 dark:border-white/5 active:scale-95">
                    Back to Home
                </Link>
            </div>
            
            <div className="pt-8 opacity-40">
                <p className="text-[9px] font-black text-surface-400 uppercase tracking-[0.5em]">System Status: Operational</p>
            </div>
        </div>
    );
}
