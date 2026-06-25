"use client"

import { useState, useEffect } from "react"
import { getCurrencySettingsAction, updateCurrencyRateAction } from "@/lib/actions/currency.actions"
import toast from "react-hot-toast"

export default function CurrencyAdmin() {
    const [rate, setRate] = useState(12800)
    const [lastUpdated, setLastUpdated] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function load() {
            const data = await getCurrencySettingsAction()
            if (data) {
                setRate(data.rate)
                setLastUpdated(data.lastUpdated)
            }
            setLoading(false)
        }
        load()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const success = await updateCurrencyRateAction(rate)
        if (success) {
            toast.success("Kurs muvaffaqiyatli yangilandi!")
            setLastUpdated(new Date().toISOString())
        } else {
            toast.error("Xatolik yuz berdi")
        }
        setSaving(false)
    }

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-[70vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="p-4 md:p-10 max-w-4xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">Currency & Exchange</h1>
                    <p className="text-surface-500 text-xs font-bold uppercase tracking-widest">Global monetary calibration and UZS valuation</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white font-black px-10 py-4 rounded-2xl hover:bg-white hover:text-black transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? "Synchronizing..." : "Update Rate"}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-surface border border-border-alpha rounded-3xl p-8 space-y-8">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-primary rounded-full" />
                        <h2 className="text-sm font-black text-foreground uppercase tracking-widest">USD to UZS Rate</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-primary text-xs">1 USD =</span>
                            <input
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                className="w-full bg-surface-100 border border-border-alpha rounded-2xl pl-20 pr-16 py-6 text-2xl font-black tracking-tighter outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
                            />
                            <span className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-surface-400 text-xs uppercase tracking-widest">UZS</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border-alpha flex items-center justify-between">
                        <span className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Last Synced</span>
                        <span className="text-[10px] font-black text-foreground uppercase">{new Date(lastUpdated).toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-[#0B0B0C] text-white rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">Rounding Protocol</h3>
                    <div className="space-y-4">
                        <p className="text-xs leading-relaxed opacity-80">
                            The system automatically applies <span className="text-primary font-black">Localized Rounding</span> to all UZS conversions:
                        </p>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                {'>'} 50,000 UZS → Round Up
                            </li>
                            <li className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest">
                                <span className="w-1 h-1 bg-primary rounded-full" />
                                {'<'} 50,000 UZS → Round Down
                            </li>
                        </ul>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-4">
                        <p className="text-[9px] font-mono opacity-60">Example: 1,540,000 UZS will be rounded to 1,500,000 UZS for clean pricing.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
