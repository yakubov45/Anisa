"use client"

import { useState } from "react"
import useBuildStore from "@/store/useBuildStore"
import { getProducts } from "@/features/product/api"

export default function AutoBuilder() {
    const { autoConfigureBuild } = useBuildStore()
    const [loading, setLoading] = useState(false)

    const handleAutoBuild = async (purpose, tier) => {
        setLoading(true)
        try {
            const products = await getProducts()
            autoConfigureBuild(products, purpose, tier)
        } catch (error) {
            console.error("Auto build failed:", error)
        } finally {
            setTimeout(() => setLoading(false), 800) // Small delay for visual effect
        }
    }

    return (
        <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-8 lg:p-12 space-y-10 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
            
            <div className="relative space-y-2">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">AI Optimizer</span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Smart Recommendation</h2>
                <p className="text-zinc-500 font-medium text-sm">Save your time! Tell us what you need your PC for, and our intelligent engine will select the optimal components for your workflow.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { id: 'gaming', name: 'Gaming Elite', icon: '🎮', desc: 'Max FPS and ultra-smooth graphics' },
                    { id: 'office', name: 'Productivity', icon: '💼', desc: 'Fast multitasking and stability' },
                    { id: 'creator', name: 'Design / Render', icon: '🎨', desc: 'Heavy computational power and memory' }
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
                                Entry Tier
                            </button>
                            <button 
                                onClick={() => handleAutoBuild(p.id, 'mid')}
                                className="w-full py-2.5 rounded-xl bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all"
                            >
                                Balanced (Best Value)
                            </button>
                            <button 
                                onClick={() => handleAutoBuild(p.id, 'ultra')}
                                className="w-full py-2.5 rounded-xl bg-primary text-white text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                Ultimate Build
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 rounded-[2.5rem] animate-fade-in">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Assembling system configuration...</span>
                    </div>
                </div>
            )}
        </div>
    )
}
