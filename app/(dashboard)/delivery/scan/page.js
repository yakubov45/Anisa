"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/lib/UserContext"
import { getOrderByIdAction, updateOrderAction } from "@/lib/actions/order.actions"
import { useRouter, useSearchParams } from "next/navigation"
import { ORDER_STATUS } from "@/lib/constants"
import { useTranslation } from "@/lib/LanguageContext"
import Script from "next/script"

export default function DeliveryScanner() {
    const { t } = useTranslation();
    const searchParams = useSearchParams()
    const router = useRouter()
    const [manualId, setManualId] = useState(searchParams.get("id") || "")
    const [status, setStatus] = useState("idle") // idle, scanning, verifying, success, error
    const [message, setMessage] = useState("")
    const [scriptLoaded, setScriptLoaded] = useState(false)

    useEffect(() => {
        if (status === "scanning" && scriptLoaded && window.Html5QrcodeScanner) {
            const scanner = new window.Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
            });

            scanner.render(onScanSuccess, onScanFailure);

            function onScanSuccess(decodedText) {
                scanner.clear().catch(err => console.error("Scanner clear error:", err));
                setManualId(decodedText);
                handleVerify(null, decodedText);
            }

            function onScanFailure(error) {
                // Ignore failure
            }

            return () => {
                scanner.clear().catch(err => console.error("Scanner clear error during cleanup:", err));
            };
        }
    }, [status, scriptLoaded]);

    const handleVerify = async (e, id = manualId) => {
        if (e) e.preventDefault()
        if (!id) return

        setStatus("verifying")
        try {
            const result = await getOrderByIdAction(id)

            if (!result.success || !result.order) {
                setStatus("error")
                setMessage(t('scan_error_not_found'))
                return
            }

            const order = result.order

            if (order.status === ORDER_STATUS.DELIVERED) {
                setStatus("error")
                setMessage(t('scan_error_delivered'))
                return
            }

            await updateOrderAction(id, { status: ORDER_STATUS.DELIVERED })
            setStatus("success")
            setMessage(t('scan_success_msg'))

            setTimeout(() => {
                router.push("/delivery/history")
            }, 2000)

        } catch (error) {
            setStatus("error")
            setMessage(t('scan_access_denied'))
            console.error(error)
        }
    }

    return (
        <div className="space-y-10 animate-fade-in max-w-xl mx-auto pb-20">
            <Script 
                src="https://unpkg.com/html5-qrcode" 
                strategy="afterInteractive"
                onLoad={() => setScriptLoaded(true)}
                onError={() => console.error("Failed to load QR scanner script")}
            />

            {/* Header */}
            <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-3">
                    <div className="w-8 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('scan_biometric')}</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t('scan_qr_scanner')}</h1>
            </div>

            {/* Scan Area */}
            <div className="bg-[#161B22] border-2 border-dashed border-white/10 rounded-[3rem] min-h-[400px] flex flex-col items-center justify-center p-6 space-y-6 relative overflow-hidden group">
                {status === "idle" && (
                    <>
                        <div className="w-24 h-24 border-4 border-primary rounded-2xl relative animate-pulse flex items-center justify-center">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-primary animate-scan shadow-[0_0_15px_rgba(var(--primary-rgb),0.8)]" />
                            <span className="text-4xl">📷</span>
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">{t('scan_align')}</p>
                        <button 
                            onClick={() => setStatus("scanning")}
                            className="bg-primary/10 border border-primary/20 text-primary px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                        >
                            {t('scan_init')}
                        </button>
                    </>
                )}

                {status === "scanning" && (
                    <div className="w-full h-full overflow-hidden rounded-2xl">
                        {!scriptLoaded && (
                            <div className="flex flex-col items-center gap-4 py-10">
                                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Loading Scanner Engine...</p>
                            </div>
                        )}
                        <div id="reader" className="w-full"></div>
                        <button 
                            onClick={() => setStatus("idle")}
                            className="w-full mt-4 bg-white/5 text-white/40 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            Cancel Scanning
                        </button>
                    </div>
                )}

                {status === "verifying" && (
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{t('scan_decrypting')}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center gap-6 text-center animate-pop-in">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl">
                            ✓
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl font-black text-white uppercase tracking-tight">{t('scan_verified')}</p>
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
                            <p className="text-xl font-black text-white uppercase tracking-tight">{t('scan_access_denied')}</p>
                            <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{message}</p>
                        </div>
                        <button 
                            onClick={() => setStatus("idle")}
                            className="text-[9px] font-black text-white/40 uppercase tracking-widest underline underline-offset-4 hover:text-white transition-colors"
                        >
                            {t('scan_try_again')}
                        </button>
                    </div>
                )}
            </div>

            {/* Manual Entry */}
            <div className="bg-[#161B22] border border-white/5 rounded-[2.5rem] p-10 space-y-6">
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] text-center">{t('scan_manual_id')}</h3>
                <form onSubmit={handleVerify} className="flex gap-4">
                    <input 
                        type="text" 
                        value={manualId}
                        onChange={(e) => setManualId(e.target.value)}
                        placeholder={t('scan_placeholder')}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white font-mono text-sm focus:border-primary outline-none transition-all placeholder:text-white/10"
                    />
                    <button 
                        type="submit"
                        disabled={!manualId || status === "verifying"}
                        className="bg-white text-black font-black px-8 rounded-xl uppercase text-[10px] tracking-widest hover:bg-primary hover:text-white transition-all disabled:opacity-20"
                    >
                        {t('scan_verify_btn')}
                    </button>
                </form>
            </div>
        </div>
    )
}
