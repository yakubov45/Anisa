import { useTranslation } from "@/lib/LanguageContext"
import Link from "next/link"

export default function BuilderGuide() {
    const { t } = useTranslation()
    
    const steps = [
        {
            title: t('kb_step1_title'),
            desc: t('kb_step1_desc'),
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        },
        {
            title: t('kb_step2_title'),
            desc: t('kb_step2_desc'),
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
        },
        {
            title: t('kb_step3_title'),
            desc: t('kb_step3_desc'),
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
        },
        {
            title: t('kb_step4_title'),
            desc: t('kb_step4_desc'),
            icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
        }
    ]

    return (
        <div className="bg-surface-50 border border-border-alpha rounded-[3rem] p-6 lg:p-20 space-y-12">
            <div className="max-w-2xl space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('kb_title')}</span>
                </div>
                <h2 className="text-2xl lg:text-4xl font-black text-foreground tracking-tighter uppercase">{t('kb_subtitle')}</h2>
                <p className="text-surface-500 text-xs font-medium">{t('kb_desc')}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {steps.map((step, idx) => (
                    <div key={idx} className="bg-surface rounded-3xl p-4 md:p-8 border border-border-alpha hover:border-primary/30 transition-all space-y-4 group">
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-surface-100 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            {step.icon}
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <h4 className="text-[10px] md:text-sm font-black text-foreground tracking-tight uppercase leading-tight">{step.title}</h4>
                            <p className="text-[9px] md:text-[11px] text-surface-500 font-medium leading-relaxed line-clamp-2 md:line-clamp-none">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-8 border-t border-border-alpha flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <div>
                        <h5 className="text-xs font-black text-foreground uppercase tracking-widest">{t('pc_builder_compatibility')}</h5>
                        <p className="text-[10px] text-surface-400 font-medium">{t('pc_builder_compatibility_desc')}</p>
                    </div>
                </div>
                <Link href="/faq">
                    <button className="bg-primary text-white font-black text-[10px] px-8 py-4 rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                        {t('pc_builder_support')}
                    </button>
                </Link>
            </div>
        </div>
    )
}
