"use client"

import { useState } from "react"
import { useTranslation } from "@/lib/LanguageContext"
import useBuildStore from "@/store/useBuildStore"
import { getProducts } from "@/features/product/api"

export default function AutoBuilder() {
    const { t } = useTranslation()
    const { autoConfigureBuild, buildMode, setBuildMode } = useBuildStore()
    const [loading, setLoading] = useState(false)

    const handleAutoBuild = async (purpose, tier) => {
        setLoading(true)
        try {
            const products = await getProducts()
            autoConfigureBuild(products, purpose, tier, buildMode)
        } catch (error) {
            console.error("Auto build failed:", error)
        } finally {
            setTimeout(() => setLoading(false), 800)
        }
    }

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 space-y-8 md:space-y-10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('pc_builder_ai_title')}</span>
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tighter uppercase">{t('pc_builder_smart_rec')}</h2>
                    <p className="text-zinc-500 font-medium text-sm max-w-xl">{t('pc_builder_ai_desc')}</p>
                </div>

                {/* Build Mode Selector */}
                <div className="bg-black/40 p-1.5 rounded-2xl flex items-center border border-white/5">
                    <button 
                        onClick={() => setBuildMode('case_only')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buildMode === 'case_only' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        {t('pc_builder_mode_case')}
                    </button>
                    <button 
                        onClick={() => setBuildMode('full_set')}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${buildMode === 'full_set' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-zinc-500 hover:text-white'}`}
                    >
                        {t('pc_builder_mode_full')}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'gaming', name: t('pc_builder_gaming'), icon: '🎮', desc: t('pc_builder_gaming_desc') },
                    { id: 'office', name: t('pc_builder_productivity'), icon: '💼', desc: t('pc_builder_productivity_desc') },
                    { id: 'creator', name: t('pc_builder_design'), icon: '🎨', desc: t('pc_builder_design_desc') }
                ].map(p => (
                    <div key={p.id} className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-primary/40 transition-all">
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{p.icon}</span>
                            <div>
                                <h4 className="font-black text-white text-sm uppercase tracking-tight">{p.name}</h4>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase">{p.desc}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => handleAutoBuild(p.id, 'entry')}
                                className="w-full py-2.5 rounded-xl bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all"
                            >
                                {t('pc_builder_tier_entry')}
                            </button>
                            <button 
                                onClick={() => handleAutoBuild(p.id, 'mid')}
                                className="w-full py-2.5 rounded-xl bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                            >
                                {t('pc_builder_tier_mid')}
                            </button>
                            <button 
                                onClick={() => handleAutoBuild(p.id, 'ultra')}
                                className="w-full py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                {t('pc_builder_tier_ultra')}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-[2.5rem] animate-fade-in">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">{t('pc_builder_assembling')}</span>
                    </div>
                </div>
            )}
        </div>
    )
}
