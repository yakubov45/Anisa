"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/lib/UserContext"
import { orderService } from "@/lib/services/order.service"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ORDER_STATUS } from "@/lib/constants"

export default function DeliveryScanner() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [manualId, setManualId] = useState(searchParams.get("id") || "")
    const [status, setStatus] = useState("idle") // idle, scanning, verifying, success, error
    const [message, setMessage] = useState("")

    const handleVerify = async (e) => {
        if (e) e.preventDefault()
        if (!manualId) return

        setStatus("verifying")
        try {
            const order = await orderService.getById(manualId)
            
            if (!order) {
                setStatus("error")
                setMessage("Order manifest not found in central database.")
                return
            }

            if (order.status === ORDER_STATUS.DELIVERED) {
                setStatus("error")
                setMessage("Order already marked as DELIVERED.")
                return
            }

            // Perform verification
            await orderService.updateStatus(manualId, ORDER_STATUS.DELIVERED)
            setStatus("success")
            setMessage("Deployment verified successfully. Unit delivered.")
            
            setTimeout(() => {
                router.push("/delivery/history")
            }, 2000)

        } catch (error) {
            setStatus("error")
            setMessage("Verification failed. Protocol error.")
            console.error(error)
        }
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Biometric Verification</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">QR Scanner</h1>
            </div>

            {/* Scan Area Placeholder */}
            <div className="bg-[#161B22] border-2 border-dashed border-white/10 rounded-[3rem] aspect-square flex flex-col items-center justify-center p-12 space-y-6 relative overflow-hidden group">
                {status === "idle" && (
                    <>
                        <div className="w-24 h-24 border-4 border-primary rounded-2xl relative animate-pulse">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary animate-scan shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Align QR Code with viewport</p>
                        <button 
                            onClick={() => setStatus("scanning")}
                            className="bg-primary/10 border border-primary/20 text-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                            Initialize Camera
                        </button>
                    </>
                )}

                {status === "verifying" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Decrypting Order Data...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-6 text-center animate-pop-in">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl">
                            ✓
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-white uppercase tracking-tight">Verified</p>
                            <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{message}</p>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-6 text-center animate-shake">
                        <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-4xl">
                            !
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-white uppercase tracking-tight">Access Denied</p>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{message}</p>
                        </div>
                        <button 
                            onClick={() => setStatus("idle")}
                            className="text-[9px] font-black text-white/40 uppercase tracking-widest underline underline-offset-4 hover:text-white transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>

            {/* Manual Entry */}
            <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] text-center">Manual Deployment ID</h3>
                <form onSubmit={handleVerify} className="flex gap-4">
                    <input 
                        type="text" 
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder="ORDER-XXXXXXXX"
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-white/10"
                    />
                    <button 
                        type="submit"
                        disabled={!manualId || status === "verifying"}
                        className="bg-white text-black font-black px-8 rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                    >
                        Verify
                    </button>
                </form>
            </div>
        </div>
    )
}
