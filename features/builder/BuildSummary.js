"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import useBuildStore from "@/store/useBuildStore"
import useStore from "@/store/useStore"
import useUIStore from "@/store/useUIStore"
import PriceDisplay from "@/components/common/PriceDisplay"

export default function BuildSummary() {
    const { t, lang } = useTranslation()
    const { selectedParts, getTotalPrice, getProgress, getCompatibilityIssues, resetBuild } = useBuildStore()
    const addToCart = useStore(state => state.addToCart)
    const { addToast, triggerCartAnimation } = useUIStore()
    const totalPrice = getTotalPrice()
    const progress = getProgress()
    const issues = getCompatibilityIssues()
    const hasErrors = issues.some(i => i.type === 'error')
    const [buildId, setBuildId] = useState("")
    const [isMounted, setIsMounted] = useState(false)

    // Helper to estimate TDP of selected parts
    const getEstimatedTDP = () => {
        let tdp = 0;
        let psuCapacity = 0;

        if (selectedParts.cpu) {
            const name = selectedParts.cpu.name.toUpperCase();
            if (name.includes("I9") || name.includes("R9") || name.includes("9900") || name.includes("7900") || name.includes("7950") || name.includes("13900") || name.includes("14900")) tdp += 170;
            else if (name.includes("I7") || name.includes("R7") || name.includes("7700") || name.includes("7800") || name.includes("13700") || name.includes("14700") || name.includes("5800")) tdp += 125;
            else tdp += 65;
        }
        if (selectedParts.gpu) {
            const name = selectedParts.gpu.name.toUpperCase();
            if (name.includes("4090") || name.includes("3090")) tdp += 450;
            else if (name.includes("4080") || name.includes("3080")) tdp += 320;
            else if (name.includes("4070") || name.includes("3070")) tdp += 220;
            else if (name.includes("4060") || name.includes("3060")) tdp += 160;
            else if (name.includes("1660") || name.includes("1650") || name.includes("6600")) tdp += 100;
            else tdp += 75;
        }
        if (selectedParts.motherboard) tdp += 50;
        if (selectedParts.ram) tdp += 10;
        if (selectedParts.ssd || selectedParts.hdd) tdp += 10;
        if (selectedParts.cooler) tdp += 15;
        if (selectedParts.case) tdp += 15;

        if (selectedParts.psu) {
            const name = selectedParts.psu.name.toUpperCase();
            const match = name.match(/(\d+)W/);
            if (match) psuCapacity = parseInt(match[1]);
            else {
                if (name.includes("1000")) psuCapacity = 1000;
                else if (name.includes("850")) psuCapacity = 850;
                else if (name.includes("750")) psuCapacity = 750;
                else if (name.includes("650")) psuCapacity = 650;
                else if (name.includes("550")) psuCapacity = 550;
                else psuCapacity = 600;
            }
        }

        return { tdp, psuCapacity };
    };

    // Helper to calculate Bottleneck percentage
    const getBottleneckInfo = () => {
        if (!selectedParts.cpu || !selectedParts.gpu) return null;

        const cpuName = selectedParts.cpu.name.toUpperCase();
        const gpuName = selectedParts.gpu.name.toUpperCase();

        let cpuTier = 2; // Default mid
        if (cpuName.includes("I9") || cpuName.includes("R9") || cpuName.includes("13900") || cpuName.includes("14900") || cpuName.includes("7950")) cpuTier = 5;
        else if (cpuName.includes("I7") || cpuName.includes("R7") || cpuName.includes("13700") || cpuName.includes("14700") || cpuName.includes("7800")) cpuTier = 4;
        else if (cpuName.includes("I5") || cpuName.includes("R5") || cpuName.includes("13400") || cpuName.includes("12400") || cpuName.includes("5600")) cpuTier = 3;
        else cpuTier = 2;

        let gpuTier = 2;
        if (gpuName.includes("4090") || gpuName.includes("3090") || gpuName.includes("7900XTX")) gpuTier = 5;
        else if (gpuName.includes("4080") || gpuName.includes("3080") || gpuName.includes("4070TI") || gpuName.includes("7900XT")) gpuTier = 4;
        else if (gpuName.includes("4070") || gpuName.includes("3070") || gpuName.includes("4060TI") || gpuName.includes("7700XT")) gpuTier = 3;
        else if (gpuName.includes("4060") || gpuName.includes("3060") || gpuName.includes("7600")) gpuTier = 2;
        else gpuTier = 1;

        const diff = Math.abs(cpuTier - gpuTier);
        let bottleneckPct = 5 + diff * 12;
        if (bottleneckPct > 50) bottleneckPct = 48; // cap it nicely

        let type = "minimal";
        let color = "text-green-500 bg-green-500/10 border-green-500/20 dark:bg-green-500/5";
        let label = "Mukammal moslik";
        if (lang === 'ru') label = "Отличный баланс";
        if (lang === 'en') label = "Perfect balance";

        if (diff >= 2) {
            type = "high";
            color = "text-red-500 bg-red-500/10 border-red-500/20 dark:bg-red-500/5";
            if (cpuTier < gpuTier) {
                label = "CPU Bottleneck (Kuchli)";
                if (lang === 'ru') label = "Бутылочное горлышко CPU";
                if (lang === 'en') label = "High CPU Bottleneck";
            } else {
                label = "GPU Bottleneck (Kuchli)";
                if (lang === 'ru') label = "Бутылочное горлышко GPU";
                if (lang === 'en') label = "High GPU Bottleneck";
            }
        } else if (diff === 1) {
            type = "moderate";
            color = "text-yellow-500 bg-yellow-500/10 border-yellow-500/20 dark:bg-yellow-500/5";
            label = "O'rtacha Bottleneck";
            if (lang === 'ru') label = "Умеренный дисбаланс";
            if (lang === 'en') label = "Moderate Bottleneck";
        }

        return { percentage: bottleneckPct, type, color, label };
    };

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

            {/* TDP and Bottleneck Visualizers */}
            {progress.count > 0 && (
                <div className="space-y-4 pt-4 border-t border-border-alpha">
                    {/* TDP Meter */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-foreground/60">
                                {lang === 'uz' ? "Quvvat sarfi (TDP)" : lang === 'ru' ? "Энергопотребление (TDP)" : "Power Draw (TDP)"}
                            </span>
                            <span className="text-white font-mono">
                                {getEstimatedTDP().tdp} W
                                {getEstimatedTDP().psuCapacity > 0 ? ` / ${getEstimatedTDP().psuCapacity} W` : ""}
                            </span>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                            <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                    getEstimatedTDP().psuCapacity > 0 && getEstimatedTDP().tdp > getEstimatedTDP().psuCapacity
                                        ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                        : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                                }`}
                                style={{
                                    width: `${Math.min(100, getEstimatedTDP().psuCapacity > 0 ? (getEstimatedTDP().tdp / getEstimatedTDP().psuCapacity) * 100 : (getEstimatedTDP().tdp / 800) * 100)}%`
                                }}
                            />
                        </div>
                        {getEstimatedTDP().psuCapacity > 0 && getEstimatedTDP().tdp > getEstimatedTDP().psuCapacity && (
                            <p className="text-[9px] font-black text-red-500 uppercase tracking-wider">
                                {lang === 'uz' ? "⚠️ PSU quvvati yetarli emas! Kattaroq blok tanlang." : lang === 'ru' ? "⚠️ Мощности БП недостаточно! Выберите больше." : "⚠️ Insufficient PSU wattage!"}
                            </p>
                        )}
                        {getEstimatedTDP().psuCapacity === 0 && getEstimatedTDP().tdp > 0 && (
                            <p className="text-[8px] font-bold text-surface-400 uppercase tracking-wider">
                                {lang === 'uz' ? "Tavsiya etilgan blok" : lang === 'ru' ? "Рекомендуемый БП" : "Recommended PSU"}: min {Math.round(getEstimatedTDP().tdp * 1.3 / 50) * 50}W
                            </p>
                        )}
                    </div>

                    {/* Bottleneck Gauge */}
                    {getBottleneckInfo() && (
                        <div className={`p-3 rounded-xl border ${getBottleneckInfo().color} space-y-1.5 transition-all duration-500`}>
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-wider">
                                <span>
                                    {lang === 'uz' ? "Muvozanat (Bottleneck)" : lang === 'ru' ? "Баланс компонентов" : "Bottleneck Index"}
                                </span>
                                <span className="font-mono">{getBottleneckInfo().percentage}%</span>
                            </div>
                            <p className="text-[9px] font-bold uppercase tracking-widest">{getBottleneckInfo().label}</p>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        getBottleneckInfo().type === 'high' ? 'bg-red-500' : getBottleneckInfo().type === 'moderate' ? 'bg-yellow-500' : 'bg-green-500'
                                    }`}
                                    style={{ width: `${getBottleneckInfo().percentage}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

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
