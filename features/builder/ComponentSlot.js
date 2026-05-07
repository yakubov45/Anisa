"use client"

import { useTranslation } from "@/lib/LanguageContext"
import ImageWithFallback from "@/components/common/ImageWithFallback"
import PriceDisplay from "@/components/common/PriceDisplay"

export default function ComponentSlot({ category, title, selectedPart, onSelect, onRemove }) {
    const { t } = useTranslation()
    
    const COMPONENT_DESCRIPTIONS = {
        cpu: t('comp_cpu_desc'),
        motherboard: t('comp_mob_desc'),
        ram: t('comp_ram_desc'),
        gpu: t('comp_gpu_desc'),
        storage: t('comp_sto_desc'),
        psu: t('comp_psu_desc'),
        case: t('comp_cas_desc'),
        cooling: t('comp_coo_desc')
    }
    return (
        <div className="bg-surface-50 border border-border-alpha rounded-2xl p-4 md:p-6 transition-all hover:border-primary/30 group">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6">
                <div className="flex items-start sm:items-center gap-4 md:gap-6">
                    {/* Icon/Image Placeholder */}
                    <div className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center transition-all ${selectedPart ? 'bg-white shadow-sm' : 'bg-surface-100 border border-dashed border-border-alpha'}`}>
                        {selectedPart ? (
                            <ImageWithFallback 
                                src={selectedPart.image} 
                                alt={selectedPart.name} 
                                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
                            />
                        ) : (
                            <span className="text-surface-400 font-mono text-[9px] md:text-[10px] uppercase font-black tracking-widest">{category.slice(0, 3)}</span>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex flex-col">
                            <span className="text-[8px] md:text-[9px] font-black text-surface-400 uppercase tracking-[0.4em]">{title}</span>
                            <span className="text-[9px] md:text-[10px] text-surface-500 font-medium line-clamp-1">{COMPONENT_DESCRIPTIONS[category]}</span>
                        </div>
                        {selectedPart ? (
                            <h3 className="text-xs md:text-sm font-black text-foreground tracking-tight uppercase truncate">{selectedPart.name}</h3>
                        ) : (
                            <button 
                                onClick={onSelect}
                                className="text-[10px] md:text-xs font-black text-primary hover:underline uppercase tracking-widest flex items-center gap-2 mt-1 bg-primary/5 px-3 py-1.5 rounded-lg w-fit"
                            >
                                <span className="text-sm">+</span> {t('comp_select')}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 pt-4 sm:pt-0 border-t sm:border-t-0 border-border-alpha">
                    {selectedPart ? (
                        <>
                            <div className="flex flex-col items-start sm:items-end">
                                {selectedPart.discount && (
                                    <PriceDisplay 
                                        price={selectedPart.price / (1 - selectedPart.discount / 100)} 
                                        className="text-[9px] font-mono text-surface-400 line-through opacity-60" 
                                    />
                                )}
                                <PriceDisplay price={selectedPart.price} className="text-base md:text-lg font-black text-foreground tracking-tighter" />
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={onSelect}
                                    title="Edit Selection"
                                    className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-border-alpha"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                </button>
                                <button 
                                    onClick={onRemove}
                                    title="Remove"
                                    className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all border border-border-alpha"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="w-24 h-1.5 bg-surface-100 rounded-full overflow-hidden hidden sm:block">
                            <div className="w-0 h-full bg-primary" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
