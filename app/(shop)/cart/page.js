"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import useStore from "@/store/useStore";
import Link from "next/link";

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity } = useStore();
    const { t } = useTranslation();
    const subtotal = cart?.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0) || 0;

    if (!cart || cart.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8 animate-fade-in pt-20">
                <div className="w-24 h-24 bg-surface-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-4xl grayscale opacity-50">🛒</div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black text-foreground tracking-tighter uppercase whitespace-nowrap">Cart is Empty</h2>
                    <p className="text-surface-500 font-bold uppercase text-[9px] tracking-[0.3em]">Choose some hardware to get started</p>
                </div>
                <Link href="/products" className="bg-primary text-white px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-foreground transition-all shadow-xl shadow-primary/20">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 animate-fade-in pt-10 pb-20">
            <div className="flex items-end justify-between border-l-4 border-primary pl-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-black text-foreground tracking-tighter uppercase">Shopping Cart</h1>
                    <p className="text-surface-500 font-bold uppercase text-[9px] tracking-[0.2em]">Hardware selection manifest</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-6">
                    {cart.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-zinc-900 p-6 md:p-8 rounded-2xl shadow-sm border border-surface-200 dark:border-white/5 flex flex-col md:flex-row items-center gap-8 group hover:border-primary/20 transition-all relative overflow-hidden">
                            <div className="w-24 h-24 bg-surface-50 dark:bg-black rounded-xl overflow-hidden shrink-0 border border-surface-200 dark:border-white/5 grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700 p-2">
                                <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                            </div>

                            <div className="flex-1 space-y-2 relative z-10 w-full">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] font-mono">{item.brand || 'Brand'}</span>
                                    <h3 className="text-base font-black text-foreground uppercase tracking-tight line-clamp-1">{item.name}</h3>
                                </div>
                                <div className="pt-2 flex items-center gap-4">
                                    <div className="bg-surface-50 dark:bg-black/40 border border-surface-200 dark:border-white/10 p-0.5 rounded-lg flex items-center gap-2">
                                        <button 
                                            onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))} 
                                            className="w-8 h-8 flex items-center justify-center font-black text-surface-500 hover:text-foreground hover:bg-surface-200 dark:hover:bg-zinc-800 rounded-md transition-all text-xs"
                                        >-</button>
                                        <span className="font-mono font-black text-xs w-4 text-center text-foreground">{item.quantity || 1}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)} 
                                            className="w-8 h-8 flex items-center justify-center font-black text-surface-500 hover:text-foreground hover:bg-surface-200 dark:hover:bg-zinc-800 rounded-md transition-all text-xs"
                                        >+</button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)} 
                                        className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                                        title="Remove item"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="text-right w-full md:w-auto relative z-10">
                                <p className="text-xl font-black text-foreground tracking-tighter">${(item.price * (item.quantity || 1)).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/5 p-8 rounded-3xl shadow-2xl h-fit space-y-8 sticky top-36 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                    <div className="space-y-6 relative z-10">
                        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">Order Summary</h3>
                        <div className="space-y-4 text-[9px] font-black text-surface-500 uppercase tracking-[0.2em]">
                            <div className="flex justify-between"><span>Subtotal</span><span className="text-foreground">${subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Shipping</span><span className="text-green-500">Free</span></div>
                            <div className="flex justify-between"><span>Tax</span><span className="text-foreground">Included</span></div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-surface-200 dark:border-white/5 space-y-6 relative z-10">
                        <div className="flex justify-between items-end">
                            <span className="text-surface-500 font-black uppercase text-[8px] tracking-[0.3em]">Total Amount</span>
                            <span className="text-3xl font-black text-foreground tracking-tighter">${subtotal.toLocaleString()}</span>
                        </div>
                        <Link href="/checkout" className="block w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-5 rounded-xl text-center shadow-lg hover:bg-primary hover:text-white transition-all uppercase text-[10px] tracking-widest active:scale-95">
                            Checkout Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
