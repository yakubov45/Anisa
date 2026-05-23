"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";
import useStore from "@/store/useStore";
import Link from "next/link";
import PriceDisplay from "@/components/common/PriceDisplay";

export default function CartDrawer() {
    const { cart, cartDrawerOpen, setCartDrawerOpen, removeFromCart, updateQuantity } = useStore();
    const { t } = useTranslation();
    const drawerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (drawerRef.current && !drawerRef.current.contains(event.target)) {
                setCartDrawerOpen(false);
            }
        };

        if (cartDrawerOpen) {
            document.body.style.overflow = "hidden";
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.body.style.overflow = "unset";
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [cartDrawerOpen, setCartDrawerOpen]);

    const calculateItemTotal = (item) => {
        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        return price * quantity;
    };

    const subtotal = cart?.reduce((acc, item) => acc + calculateItemTotal(item), 0) || 0;

    return (
        <AnimatePresence>
            {cartDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setCartDrawerOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    />

                    {/* Drawer container */}
                    <motion.div
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-screen w-full sm:w-[480px] bg-[#0d1117]/95 backdrop-blur-2xl border-l border-white/10 z-[1000] shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-white tracking-tighter uppercase">{t('cart_title') || "SAVATCHA"}</h2>
                                <p className="text-[9px] font-black text-surface-500 uppercase tracking-widest">{cart.length} {t('cart_items_count') || "MAHSULOTLAR"}</p>
                            </div>
                            <button
                                onClick={() => setCartDrawerOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-500 transition-all duration-300"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-primary scrollbar-track-transparent">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="text-4xl">🛒</div>
                                    <p className="text-sm font-bold text-white/50 uppercase tracking-widest">{t('cart_empty') || "Savatchangiz bo'sh"}</p>
                                    <Link
                                        href="/products"
                                        onClick={() => setCartDrawerOpen(false)}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/40 text-white text-[10px] font-black px-6 py-3 rounded-lg uppercase tracking-widest transition-all"
                                    >
                                        {t('cart_browse') || "MAHSULOTLARNI KO'RISH"}
                                    </Link>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-4 flex items-center gap-4 transition-all duration-300 relative group overflow-hidden"
                                    >
                                        {/* Glow effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                        {/* Image wrapper */}
                                        <div className="w-16 h-16 bg-white dark:bg-black rounded-lg overflow-hidden shrink-0 border border-white/10 p-1 flex items-center justify-center">
                                            <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 space-y-1 relative">
                                            <span className="text-[8px] font-black text-primary uppercase tracking-widest block">{item.brand || "Brand"}</span>
                                            <h4 className="text-xs font-bold text-white uppercase tracking-tight truncate">{item.name}</h4>
                                            <div className="flex items-center gap-3 mt-1.5">
                                                {/* Counter */}
                                                <div className="bg-black/40 border border-white/10 rounded-md p-0.5 flex items-center gap-1.5">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, Math.max(1, (item.quantity || 1) - 1))}
                                                        className="w-5 h-5 flex items-center justify-center font-bold text-white/50 hover:text-white hover:bg-white/10 rounded transition-all text-xs"
                                                    >-</button>
                                                    <span className="font-mono font-black text-[10px] w-3 text-center text-white">{item.quantity || 1}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                        className="w-5 h-5 flex items-center justify-center font-bold text-white/50 hover:text-white hover:bg-white/10 rounded transition-all text-xs"
                                                    >+</button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-white/40 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Price */}
                                        <div className="text-right shrink-0">
                                            <PriceDisplay price={calculateItemTotal(item)} className="text-xs font-black text-white tracking-tighter" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer Summary & Action Buttons */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-[#070a0f] space-y-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-black text-surface-500 uppercase tracking-wider">
                                        <span>{t('cart_subtotal') || "ORALIQ SUMMA"}</span>
                                        <PriceDisplay price={subtotal} className="text-white font-mono text-sm" />
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-black text-surface-500 uppercase tracking-wider">
                                        <span>{t('cart_shipping') || "YETKAZIB BERISH"}</span>
                                        <span className="text-green-500">{t('cart_shipping_free') || "BEPUL"}</span>
                                    </div>
                                    <div className="h-px bg-white/5 my-2" />
                                    <div className="flex justify-between items-end">
                                        <span className="text-xs font-black text-white uppercase tracking-wider">{t('cart_total') || "JAMI SUMMA"}</span>
                                        <PriceDisplay price={subtotal} className="text-xl font-black text-primary tracking-tighter" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        href="/cart"
                                        onClick={() => setCartDrawerOpen(false)}
                                        className="border border-white/10 hover:bg-white/5 hover:border-white/20 text-white text-[9px] font-black py-4 rounded-xl text-center uppercase tracking-widest transition-all duration-300 flex items-center justify-center"
                                    >
                                        {t('cart_title')?.toUpperCase() || "SAVATCHA"}
                                    </Link>
                                    <Link
                                        href="/checkout"
                                        onClick={() => setCartDrawerOpen(false)}
                                        className="bg-primary hover:bg-primary/90 text-white text-[9px] font-black py-4 rounded-xl text-center uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center"
                                    >
                                        {t('cart_checkout_btn')?.toUpperCase() || "XARID QILISH"}
                                    </Link>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
