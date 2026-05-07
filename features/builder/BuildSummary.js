"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import useBuildStore from "@/store/useBuildStore"
import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import PriceDisplay from "@/components/common/PriceDisplay"

export default function BuildSummary() {
    const { t } = useTranslation()
    const { selectedParts, getTotalPrice, getProgress, getCompatibilityIssues, resetBuild } = useBuildStore()
    const addToCart = useStore(state => state.addToCart)
    const { addToast, triggerCartAnimation } = useUIStore()
    const totalPrice = getTotalPrice()
    const progress = getProgress()
    const issues = getCompatibilityIssues()
    const hasErrors = issues.some(i => i.type === 'error')
    const [buildId, setBuildId] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setBuildId(`PC-${Math.random().toString(36).substr(2, 6).toUpperCase()}`)
        setIsMounted(true)
    }, [])

    if (!isMounted) return null;

    const handleAddToCart = () => {
        if (hasErrors) {
            addToast(t('pc_builder_comp_failure'), "error")
            return
        }

        // Add all selected parts to the global cart
        Object.values(selectedParts).forEach(part => {
            if (part) addToCart(part)
        })

        triggerCartAnimation()
        addToast(t('pc_builder_build_sync_msg'))
    }

    return (
        <div className="bg-surface-50 border border-border-alpha rounded-3xl p-8 sticky top-32 space-y-8 animate-fade-in shadow-2xl">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('pc_builder_summary')}</span>
                    <span className="text-[10px] font-mono text-surface-400">ID: {buildId || t('pc_builder_syncing')}</span>
                </div>
                <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">{t('pc_builder_elite_build')}</h3>
            </div>

            {/* Progress */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{t('pc_builder_progress')}</span>
                    <span className="text-[10px] font-mono text-primary font-bold">{progress.count} / {progress.total}</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden border border-border-alpha p-0.5">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(227,30,36,0.5)]"
                        style={{ width: `${progress.percent}%` }}
                    />
                </div>
            </div>

            {/* Price */}
            <div className="bg-zinc-900 rounded-2xl p-6 space-y-4 border border-white/5">
                <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t('pc_builder_total')}</span>
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{t('pc_builder_currency')}</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <PriceDisplay price={totalPrice} className="text-2xl font-black text-white tracking-tighter" />
                    <span className="text-xs font-mono text-zinc-500 font-bold">{t('pc_builder_per_system')}</span>
                </div>
                <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400">{t('pc_builder_installment')}</span>
                        <PriceDisplay price={totalPrice / 12} className="text-[10px] font-black text-primary" />
                    </div>
                </div>
            </div>

            {/* Compatibility Warnings */}
            {issues.length > 0 && (
                <div className="space-y-3">
                    {issues.map((issue, idx) => (
                        <div
                            key={idx}
                            className={`p-4 rounded-xl border flex gap-3 ${issue.type === 'error' ? 'bg-red-500/5 border-red-500/20 text-red-500' : 'bg-yellow-500/5 border-yellow-500/20 text-yellow-500'}`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span className="text-[10px] font-bold uppercase tracking-widest leading-relaxed">{issue.message}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="space-y-3 pt-4">
                <button
                    disabled={progress.count === 0 || hasErrors}
                    onClick={handleAddToCart}
                    className={`w-full font-black text-xs uppercase tracking-[0.2em] py-5 rounded-2xl transition-all ${hasErrors
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30 cursor-not-allowed opacity-50'
                            : 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30'
                        }`}
                >
                    {hasErrors ? t('pc_builder_comp_failure') : t('pc_builder_buy')}
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-surface-100 border border-border-alpha text-foreground font-black text-[9px] uppercase tracking-widest py-4 rounded-xl hover:bg-foreground hover:text-background transition-all">
                        {t('pc_builder_save_build')}
                    </button>
                    <button
                        onClick={resetBuild}
                        className="bg-surface-100 border border-border-alpha text-foreground font-black text-[9px] uppercase tracking-widest py-4 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                        {t('pc_builder_reset_btn')}
                    </button>
                </div>
            </div>
        </div>
    )
}
