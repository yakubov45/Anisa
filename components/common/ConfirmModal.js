"use client"

import { motion, AnimatePresence } from "framer-motion"
import useUIStore from "@/store/useUIStore"
import { useTranslation } from "@/lib/LanguageContext"

export default function ConfirmModal() {
    const { confirmModal, hideConfirm } = useUIStore()
    const { t } = useTranslation()

    const handleConfirm = () => {
        if (confirmModal.onConfirm) confirmModal.onConfirm()
        hideConfirm()
    }

    return (
        <AnimatePresence>
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={hideConfirm}
                        className="absolute inset-0 bg-background/80 backdrop-blur-md"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-md bg-surface border border-surface-200 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{confirmModal.title}</span>
                                <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">{confirmModal.message}</h2>
                            </div>

                            <p className="text-surface-500 text-xs font-bold leading-relaxed uppercase tracking-widest">
                                {t('confirm_desc')}
                            </p>

                            <div className="flex gap-4 pt-4">
                                <button 
                                    onClick={handleConfirm}
                                    className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-primary/20"
                                >
                                    {t('confirm_btn')}
                                </button>
                                <button 
                                    onClick={hideConfirm}
                                    className="px-10 bg-surface-100 text-surface-900 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-200 transition-all"
                                >
                                    {t('confirm_cancel')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
