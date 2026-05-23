"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from 'framer-motion';
import useStore from "@/store/useStore";

export default function OrderSuccessPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [orderId, setOrderId] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [isGuideOpen, setIsGuideOpen] = useState(false);
    const { addNotification } = useStore();

    useEffect(() => {
        const newOrderId = `OPC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        setOrderId(newOrderId);
        
        // Add notification for the user
        addNotification({
            id: `order_${newOrderId}`,
            orderId: newOrderId,
            type: 'success',
            title: {
                uz: "Buyurtmangiz qabul qilindi!",
                ru: "Ваш заказ принят!",
                en: "Your order has been received!"
            },
            message: {
                uz: `Buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada operatorlarimiz siz bilan bog'lanishadi.\n\nSiz hozircha profil bo'limiga o'tib, buyurtmangiz holatini kuzatishingiz yoki Telegram botimizdan foydalanishingiz mumkin.`,
                ru: `Ваш заказ успешно оформлен. Скоро наши операторы свяжутся с вами.\n\nВы можете перейти в раздел профиля для отслеживания статуса вашего заказа или воспользоваться нашим Telegram ботом.`,
                en: `Your order has been successfully placed. Our operators will contact you shortly.\n\nYou can go to the profile section to track your order status or use our Telegram bot.`
            }
        });
    }, [addNotification]);

    const handleTelegramClick = (e) => {
        e.preventDefault();
        setIsGuideOpen(true);
        window.open("https://t.me/onepc_uz_bot", "_blank");
    };

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 md:space-y-8 animate-fade-in px-4 relative pt-10">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 animate-pulse" />
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white dark:bg-zinc-900 border-[3px] border-green-500 text-green-500 flex items-center justify-center rounded-[1.5rem] md:rounded-[2rem] text-2xl md:text-4xl shadow-xl">
                    ✓
                </div>
            </div>

            <div className="space-y-3 md:space-y-4">
                <div className="space-y-1.5">
                    <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">
                        {t('order_confirmed')}
                    </h1>
                    <p className="text-surface-500 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.3em]">
                        {t('order_protocol_complete')}
                    </p>
                </div>

                <div className="bg-surface-50 dark:bg-zinc-900 border border-surface-200 dark:border-white/5 px-5 py-3 rounded-xl inline-flex flex-col gap-1">
                    <span className="text-[8px] font-black text-surface-400 uppercase tracking-widest">
                        {t('order_tracking_identity')}
                    </span>
                    <span className="text-sm md:text-base font-mono font-black text-foreground">{orderId || "GENERATING..."}</span>
                </div>

                <p className="text-surface-600 dark:text-surface-400 font-medium max-w-md mx-auto text-sm leading-relaxed mt-2">
                    {t('order_success_desc')}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md mt-4">
                <button onClick={handleTelegramClick} className="flex-1 bg-[#229ED9] text-white font-black px-6 py-4 rounded-xl shadow-[0_10px_20px_rgba(34,158,217,0.3)] hover:bg-[#1c84b5] transition-all uppercase text-[9px] tracking-widest active:scale-95 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram Bot
                </button>
                <Link href="/" className="flex-1 bg-surface-100 dark:bg-zinc-800 text-foreground dark:text-white font-black px-6 py-4 rounded-xl hover:bg-surface-200 dark:hover:bg-zinc-700 transition-all uppercase text-[9px] tracking-widest border border-surface-200 dark:border-white/5 active:scale-95 flex items-center justify-center">
                    {t('order_back_home')}
                </Link>
            </div>


        {/* Premium "We will contact you" Modal */}
        <AnimatePresence>
            {isModalOpen && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center p-4 mt-10">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/90 dark:bg-black/90 backdrop-blur-md"
                        onClick={() => setIsModalOpen(false)}
                    />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 50 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-sm bg-white dark:bg-[#0c0c0e] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden max-h-[90vh]"
                        >
                            {/* Animated Background Rays */}
                            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg_at_50%_50%,rgba(239,68,68,0.1)_0deg,transparent_60deg,transparent_300deg,rgba(239,68,68,0.1)_360deg)]"
                                />
                            </div>

                            {/* Logo Fly Animation */}
                            <motion.div
                                initial={{ scale: 0, y: 100, rotate: -180 }}
                                animate={{ scale: 1, y: 0, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, duration: 0.8 }}
                                className="relative w-20 h-20 md:w-24 md:h-24 mb-5 z-10"
                            >
                                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                                <motion.img
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                    src="/favicon.ico"
                                    alt="OnePC Logo"
                                    className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(239,68,68,0.3)] relative z-10"
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-2 z-10 mb-6"
                            >
                                <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight leading-tight">
                                    Siz bilan tez orada <br/>
                                    <span className="text-primary">aloqaga chiqamiz</span>
                                </h2>
                                <p className="text-xs md:text-sm text-surface-600 dark:text-surface-400 font-medium leading-relaxed max-w-[260px] mx-auto mt-2">
                                    Buyurtmangiz muvaffaqiyatli qabul qilindi. Operatorlarimiz ma'lumotlarni tasdiqlash uchun sizga qo'ng'iroq qilishadi.
                                </p>
                            </motion.div>

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                onClick={() => setIsModalOpen(false)}
                                className="w-full btn-premium btn-premium-red text-white font-black py-3.5 rounded-xl shadow-xl shadow-primary/20 uppercase text-[10px] tracking-widest active:scale-95 relative z-10"
                            >
                                Tushunarli
                            </motion.button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Telegram Bot Guide Modal */}
            <AnimatePresence>
                {isGuideOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/95 dark:bg-black/95 backdrop-blur-xl"
                            onClick={() => setIsGuideOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-lg bg-white dark:bg-[#0c0c0e] border border-black/10 dark:border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl flex flex-col items-center text-center overflow-hidden"
                        >
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-[#229ED9]/10 rounded-[1.5rem] flex items-center justify-center mb-6 text-[#229ED9]">
                                <svg className="w-8 h-8 md:w-10 md:h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                            </div>
                            
                            <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight mb-4">
                                Telegram botdan qanday foydalaniladi?
                            </h2>
                            
                            <div className="space-y-4 w-full text-left bg-surface-50 dark:bg-zinc-900/50 p-5 rounded-2xl border border-surface-200 dark:border-white/5">
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-black shrink-0">1</div>
                                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed pt-1">
                                        Botga kirgach pastdagi <b>"START"</b> tugmasini bosing
                                    </p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-black shrink-0">2</div>
                                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed pt-1">
                                        O'zingizga qulay <b>Tilni</b> tanlang (O'zbek yoki Rus)
                                    </p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-8 h-8 rounded-full bg-[#229ED9]/20 text-[#229ED9] flex items-center justify-center font-black shrink-0">3</div>
                                    <p className="text-sm text-surface-600 dark:text-surface-400 leading-relaxed pt-1">
                                        <b>"Telefon raqamni yuborish"</b> tugmasi orqali raqamingizni tasdiqlang va xaridni boshlang!
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsGuideOpen(false)}
                                className="w-full bg-surface-100 dark:bg-zinc-800 text-foreground dark:text-white font-black py-4 rounded-xl shadow-sm uppercase text-[10px] tracking-widest active:scale-95 mt-6 border border-surface-200 dark:border-white/5 hover:bg-surface-200 dark:hover:bg-zinc-700 transition-all"
                            >
                                Tushundim, yopish
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
