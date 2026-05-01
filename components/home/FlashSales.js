"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/features/product/ProductCard";

export default function FlashSales({ products }) {
    const [timeLeft, setTimeLeft] = useState({
        hours: 24,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59, hours: prev.hours };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const format = (n) => n.toString().padStart(2, '0');

    return (
        <section className="bg-surface-50 border border-white/5 rounded-[3rem] p-12 md:p-20 overflow-hidden relative group shadow-premium">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[120px] -mr-32 opacity-50 transition-opacity duration-1000" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-20 items-center">

                <div className="lg:w-1/3 space-y-12">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary font-black text-[10px] uppercase tracking-[0.4em]">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                            SYSTEM_SYNC_ACTIVE
                        </div>
                        <h2 className="text-6xl font-black text-foreground tracking-tighter leading-none uppercase">
                            Dynamic <br />
                            <span className="text-primary">Yields.</span>
                        </h2>
                    </div>

                    <div className="flex gap-6">
                        {[
                            { label: "HRS", val: timeLeft.hours },
                            { label: "MIN", val: timeLeft.minutes },
                            { label: "SEC", val: timeLeft.seconds }
                        ].map((t) => (
                            <div key={t.label} className="bg-surface-100 border border-border-alpha rounded-xl p-6 min-w-[100px] text-center shadow-lg transition-colors">
                                <div className="text-4xl font-black text-foreground font-mono tracking-tighter">{format(t.val)}</div>
                                <div className="text-[10px] font-black text-surface-500 mt-2 tracking-[0.3em] uppercase">{t.label}</div>
                            </div>
                        ))}
                    </div>

                    <Link href="/products" className="inline-block bg-foreground text-background font-black px-12 py-5 rounded-xl transition-all hover:bg-primary hover:text-white uppercase text-[10px] tracking-widest active:scale-95 shadow-xl">
                        Full Registry
                    </Link>
                </div>

                <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-10">
                    {products?.slice(0, 2).map((product) => (
                        <div key={product.id} className="transition-transform duration-700 hover:scale-[1.02]">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
