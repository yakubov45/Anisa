"use client";

import { useState } from "react";
import { verifyOrderAction } from "@/lib/actions/order.actions";
import { orderService } from "@/lib/services/order.service";
import Link from "next/link";

export default function DeliveryVerifyPage() {
    const [orderId, setOrderId] = useState("");
    const [token, setToken] = useState("");
    const [otp, setOtp] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [loadedOrder, setLoadedOrder] = useState(null);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Step 1: Fetch order details to see if OTP is required
    const handleLoadOrder = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const data = await orderService.getById(orderId);
            if (!data) throw new Error("Order not found in registry.");
            if (data.verification.token !== token) throw new Error("Invalid security token.");
            if (data.verification.qrUsed) throw new Error("This QR has already been used.");
            
            setLoadedOrder(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Final Verification
    const handleVerify = async (e) => {
        if (e) e.preventDefault();
        setIsVerifying(true);
        setError(null);

        const res = await verifyOrderAction(orderId, token, { otp });

        if (res.success) {
            setResult(res);
        } else {
            setError(res.error);
        }
        setIsVerifying(false);
    };

    if (result) {
        return (
            <div className="max-w-2xl mx-auto space-y-10 animate-fade-in py-10 px-4 md:px-0">
                <div className="bg-green-500 text-white p-10 rounded-[3rem] shadow-2xl text-center space-y-4">
                    <div className="flex justify-center animate-bounce">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    </div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Order Delivered</h1>
                    <p className="font-bold opacity-80 uppercase text-xs tracking-widest">Protocol verified successfully</p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 p-10 rounded-[3rem] shadow-xl space-y-8">
                    <div className="border-b border-surface-100 dark:border-white/5 pb-6 flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">Digital Receipt</h2>
                            <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest mt-1">Proof of hardware deployment</p>
                        </div>
                        <div className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                            AUTH: {result.receipt.authId}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Order ID</span>
                            <span className="text-sm font-black text-foreground uppercase">{result.receipt.id}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Customer</span>
                            <span className="text-sm font-black text-foreground uppercase">{result.receipt.customer}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Items Count</span>
                            <span className="text-sm font-black text-foreground">{result.receipt.items} Units</span>
                        </div>
                        <div className="h-px bg-surface-100 dark:bg-white/5 my-4" />
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Total Value</span>
                            <span className="text-2xl font-black text-primary">${result.receipt.total.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                        <button 
                            onClick={() => {
                                setResult(null);
                                setLoadedOrder(null);
                                setOrderId("");
                                setToken("");
                                setOtp("");
                            }} 
                            className="bg-surface-100 dark:bg-white/5 text-foreground font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-surface-200"
                        >
                            New Deployment
                        </button>
                        <Link 
                            href="/delivery" 
                            className="bg-primary text-white text-center font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-primary-600 shadow-lg shadow-primary/20"
                        >
                            Return to Hub
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10 px-4 md:px-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Deployment Auth</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">Authenticate high-performance hardware handover</p>
                </div>
                {loadedOrder && (
                    <button 
                        onClick={() => setLoadedOrder(null)}
                        className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary"
                    >
                        ← Back to Scanner
                    </button>
                )}
            </div>

            {!loadedOrder ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* QR SCAN PLACEHOLDER */}
                    <div className="bg-surface-900 dark:bg-zinc-950 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[450px] border border-white/5 shadow-2xl relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
                        <div className="w-24 h-24 border-2 border-primary/40 border-dashed rounded-3xl flex items-center justify-center animate-pulse group-hover:scale-110 transition-transform">
                            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m0 11v1m5-12h1m-10 0h1m11 4h1m-12 0h1m12 4h1m-12 0h1M7 8a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H9a2 2 0 01-2-2V8z"/></svg>
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter">Scan QR Pass</h3>
                            <p className="text-surface-400 text-[9px] font-black uppercase tracking-widest leading-loose max-w-[200px]">Present the visual token to the camera for immediate authentication</p>
                        </div>
                        <button className="bg-primary text-white font-black px-10 py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] relative z-10 hover:bg-primary-600 transition-all shadow-xl shadow-primary/20">
                            Initialize Camera
                        </button>
                    </div>

                    {/* MANUAL ENTRY */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-surface-200 dark:border-white/5 shadow-xl flex flex-col justify-center">
                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">Manual Protocol</h3>
                                <p className="text-surface-500 text-[9px] font-black uppercase tracking-widest">Standard fallback for field operations</p>
                            </div>

                            <form onSubmit={handleLoadOrder} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Order Identifier</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={orderId}
                                        onChange={(e) => setOrderId(e.target.value)}
                                        placeholder="ORD-XXXXXX"
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-black text-foreground focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Security Token</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={token}
                                        onChange={(e) => setToken(e.target.value)}
                                        placeholder="PROTOCOL KEY"
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm font-black text-foreground focus:ring-1 focus:ring-primary outline-none transition-all uppercase"
                                    />
                                </div>

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center animate-shake">
                                        <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                        {error}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                                >
                                    {isLoading ? "LOADING MANIFEST..." : "FETCH ORDER DATA"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-slide-up">
                    <div className="lg:col-span-7 space-y-8">
                        <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 rounded-[3rem] p-10 shadow-xl space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tighter">Manifest Details</h3>
                                    <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest">Recipient: {loadedOrder.customer.fullName}</p>
                                </div>
                                <div className="bg-surface-50 dark:bg-black px-4 py-2 rounded-xl border border-surface-200 dark:border-white/5">
                                    <span className="text-lg font-black text-primary">${loadedOrder.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="bg-surface-50 dark:bg-black/40 p-6 rounded-2xl border border-surface-200 dark:border-white/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                    <p className="text-xs font-bold text-foreground uppercase tracking-tight">{loadedOrder.customer.region}</p>
                                </div>
                                <p className="text-[11px] text-surface-500 font-medium ml-8">{loadedOrder.customer.address}</p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Hardware List</p>
                                <div className="space-y-2">
                                    {loadedOrder.items.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center text-xs font-bold uppercase tracking-tight">
                                            <span className="text-surface-500">{item.quantity}x {item.name}</span>
                                            <span className="text-foreground">${(item.price * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-surface-900 text-white rounded-[3rem] p-10 shadow-2xl space-y-8 sticky top-32">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black uppercase tracking-tighter">Final Confirmation</h3>
                                <p className="text-surface-400 text-[10px] font-black uppercase tracking-widest">Complete the deployment handshake</p>
                            </div>

                            <form onSubmit={handleVerify} className="space-y-6">
                                {loadedOrder.delivery.otpRequired && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-orange-400">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 2.944V21m0-18.056c4.722 0 9.006 2.054 12 5.378-2.994 3.324-7.278 5.378-12 5.378-4.722 0-9.006-2.054-12-5.378 2.994-3.324 7.278-5.378 12-5.378z"/></svg>
                                            <span className="text-[10px] font-black uppercase tracking-widest">OTP Required for High-Value</span>
                                        </div>
                                        <input 
                                            required
                                            type="text" 
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="ENTER 6-DIGIT CODE"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-center text-2xl font-black text-white tracking-[0.5em] focus:ring-1 focus:ring-primary outline-none transition-all"
                                        />
                                        <p className="text-[9px] text-surface-400 font-bold text-center uppercase">Ask the customer for their security code</p>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-[9px] font-black uppercase tracking-widest text-center animate-shake">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <button 
                                    type="submit"
                                    disabled={isVerifying}
                                    className="w-full bg-primary text-white font-black py-6 rounded-2xl uppercase text-[11px] tracking-[0.2em] hover:bg-primary-600 transition-all shadow-xl shadow-primary/20 active:scale-95 disabled:opacity-50"
                                >
                                    {isVerifying ? "CONFIRMING..." : "DEPLOY HARDWARE"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
