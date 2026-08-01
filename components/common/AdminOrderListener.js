"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@/lib/UserContext";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import useStore from "@/store/useStore";

export default function AdminOrderListener() {
    const { user } = useUser();
    const [newOrderAlert, setNewOrderAlert] = useState(null);
    const [copiedId, setCopiedId] = useState(false);
    const { currency, exchangeRate } = useStore();
    const knownOrderIdsRef = useRef(null);

    // Audio chime synthesis
    const playNotificationSound = () => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const playTone = (freq, startTime, duration) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.15, startTime);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
                osc.start(startTime);
                osc.stop(startTime + duration);
            };
            const now = audioCtx.currentTime;
            playTone(523.25, now, 0.2);       // C5
            playTone(659.25, now + 0.08, 0.2);  // E5
            playTone(783.99, now + 0.16, 0.4);  // G5
        } catch (e) {
            console.error("Audio synthesis failed:", e);
        }
    };

    // Body scroll locking
    useEffect(() => {
        if (newOrderAlert) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [newOrderAlert]);

    // Real-time Firestore snapshot listener using docChanges()
    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            knownOrderIdsRef.current = null;
            setNewOrderAlert(null);
            return;
        }

        const q = collection(db, COLLECTIONS.ORDERS);

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                try {
                    // Initial load: collect existing IDs
                    if (!knownOrderIdsRef.current) {
                        const initialSet = new Set();
                        snapshot.docs.forEach(doc => initialSet.add(doc.id));
                        knownOrderIdsRef.current = initialSet;
                        return;
                    }

                    // Look for newly added order documents
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === "added" && !knownOrderIdsRef.current.has(change.doc.id)) {
                            knownOrderIdsRef.current.add(change.doc.id);
                            const order = { id: change.doc.id, ...change.doc.data() };
                            setNewOrderAlert(order);
                            playNotificationSound();
                        }
                    });
                } catch (err) {
                    console.error("Order snapshot listener error:", err);
                }
            },
            (error) => {
                console.error("Order snapshot subscription failed:", error);
            }
        );

        return () => unsubscribe();
    }, [user]);

    const handleCopyId = (id) => {
        if (!id) return;
        try {
            navigator.clipboard.writeText(id);
            setCopiedId(true);
            setTimeout(() => setCopiedId(false), 2000);
        } catch (e) {
            console.error("Failed to copy ID:", e);
        }
    };

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        return null;
    }

    return (
        <AnimatePresence>
            {newOrderAlert && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.85, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 30 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] border border-red-500/30 rounded-[2.5rem] p-6 md:p-8 shadow-[0_25px_70px_rgba(239,68,68,0.3)] text-foreground space-y-6 z-10 my-auto overflow-hidden"
                    >
                        {/* Background glow accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-surface-200 dark:border-white/10 pb-5">
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-black uppercase tracking-wider text-red-500">🚨 YANGI BUYURTMA KELDI!</h3>
                                    <p className="text-[10px] font-bold uppercase text-surface-400 tracking-widest">Yangi xarid tizimga tushdi</p>
                                </div>
                            </div>

                            {/* Exit X Button */}
                            <button
                                onClick={() => setNewOrderAlert(null)}
                                className="w-10 h-10 rounded-full bg-surface-100 dark:bg-white/10 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-foreground font-black text-lg shadow-sm active:scale-95"
                                title="Yopish"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order ID Box with Copy Action */}
                        <div className="bg-surface-50 dark:bg-zinc-900/90 border border-surface-200 dark:border-white/10 p-4 rounded-2xl flex items-center justify-between gap-3">
                            <div className="overflow-hidden">
                                <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-0.5">BUYURTMA ID (SEARCH UCHUN)</span>
                                <span className="text-sm md:text-base font-mono font-black text-foreground truncate block">
                                    #{newOrderAlert.id}
                                </span>
                            </div>
                            <button
                                onClick={() => handleCopyId(newOrderAlert.id)}
                                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-1.5 shrink-0 ${
                                    copiedId 
                                        ? "bg-green-500 text-white shadow-lg shadow-green-500/20" 
                                        : "bg-primary text-white hover:bg-primary-600 shadow-md shadow-primary/20"
                                }`}
                            >
                                {copiedId ? (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                                        Nusxalandi!
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                        Nusxalash
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-surface-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-surface-200 dark:border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-1">Mijoz Ismi</span>
                                <p className="text-xs font-bold text-foreground truncate">
                                    {newOrderAlert.customer?.fullName || newOrderAlert.fullName || newOrderAlert.shippingAddress?.fullName || "Mehmon"}
                                </p>
                            </div>

                            <div className="bg-surface-50 dark:bg-zinc-900/50 p-4 rounded-2xl border border-surface-200 dark:border-white/5">
                                <span className="text-[9px] font-black uppercase tracking-widest text-surface-400 block mb-1">Telefon</span>
                                <p className="text-xs font-bold text-foreground truncate">
                                    {newOrderAlert.customer?.phone || newOrderAlert.phone || newOrderAlert.shippingAddress?.phone || "N/A"}
                                </p>
                            </div>
                        </div>

                        {/* Total Price */}
                        <div className="bg-primary/5 dark:bg-primary/10 p-5 rounded-2xl border border-primary/20 flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-surface-500 dark:text-surface-400">Umumiy Summa</span>
                            <span className="text-xl md:text-2xl font-black text-primary tracking-tight">
                                {formatPrice(newOrderAlert.totalAmount || newOrderAlert.total || 0, currency, exchangeRate)}
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Link
                                href={`/admin/orders/${newOrderAlert.id}`}
                                onClick={() => setNewOrderAlert(null)}
                                className="flex-1 bg-primary text-white text-center font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                Zakazga o'tish →
                            </Link>

                            <Link
                                href={`/admin/orders?search=${newOrderAlert.id}`}
                                onClick={() => setNewOrderAlert(null)}
                                className="flex-1 bg-surface-100 dark:bg-zinc-800 text-foreground font-black py-4 px-6 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-surface-200 dark:hover:bg-zinc-700 transition-all border border-surface-200 dark:border-white/10 flex items-center justify-center gap-2 active:scale-95 text-center"
                            >
                                Zakazlar ro'yxati
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
