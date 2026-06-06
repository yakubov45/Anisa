"use client";

import { motion, AnimatePresence } from "framer-motion";
import useStore from "@/store/useStore";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/LanguageContext";

export default function NotificationsDrawer() {
    const { 
        notificationsDrawerOpen, 
        setNotificationsDrawerOpen,
        notifications,
        markAllNotificationsAsRead,
        markNotificationAsRead
    } = useStore();
    const { t, lang } = useTranslation();
    const [mounted, setMounted] = useState(false);
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent scrolling when drawer is open
    useEffect(() => {
        if (notificationsDrawerOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
            setExpandedId(null);
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [notificationsDrawerOpen]);

    if (!mounted) return null;

    const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

    const texts = {
        title: { uz: 'Xabarnomalar', ru: 'Уведомления', en: 'Notifications' },
        markAllRead: { uz: "Barchasini o'qildi qilish", ru: "Отметить все как прочитанные", en: "Mark all as read" },
        emptyTitle: { uz: "Xabarnomalar yo'q", ru: "Нет уведомлений", en: "No notifications" },
        emptyDesc: { uz: "Hozircha sizda hech qanday yangi xabarnoma mavjud emas.", ru: "На данный момент у вас нет новых уведомлений.", en: "You have no new notifications at the moment." },
        new: { uz: "YANGI", ru: "НОВОЕ", en: "NEW" },
        close: { uz: "Yopish", ru: "Закрыть", en: "Close" }
    };

    const getTimeAgo = (dateString, lang) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);
        
        if (diffInSeconds < 60) {
            if (lang === 'uz') return "Hozirgina";
            if (lang === 'ru') return "Только что";
            return "Just now";
        }
        
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) {
            if (lang === 'uz') return `${diffInMinutes} daqiqa oldin`;
            if (lang === 'ru') return `${diffInMinutes} минут назад`;
            return `${diffInMinutes} min ago`;
        }
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) {
            if (lang === 'uz') return `${diffInHours} soat oldin`;
            if (lang === 'ru') return `${diffInHours} часов назад`;
            return `${diffInHours} hrs ago`;
        }
        
        const diffInDays = Math.floor(diffInHours / 24);
        if (lang === 'uz') return `${diffInDays} kun oldin`;
        if (lang === 'ru') return `${diffInDays} дней назад`;
        return `${diffInDays} days ago`;
    };

    const handleNotificationClick = (id) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            markNotificationAsRead(id);
        }
    };

    return (
        <AnimatePresence>
            {notificationsDrawerOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                        onClick={() => setNotificationsDrawerOpen(false)}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface-50 dark:bg-[#0c0c0e] border-l border-surface-200 dark:border-white/5 shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-surface-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl shrink-0">
                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-foreground">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {texts.title[lang]}
                                {unreadCount > 0 && (
                                    <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-md ml-1">{unreadCount}</span>
                                )}
                            </h2>
                            <button
                                onClick={() => setNotificationsDrawerOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-200 dark:hover:bg-white/10 transition-colors text-foreground"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Actions */}
                        {notifications && notifications.length > 0 && unreadCount > 0 && (
                            <div className="px-4 py-2 border-b border-surface-200 dark:border-white/5 shrink-0 bg-white dark:bg-zinc-900/50">
                                <button 
                                    onClick={markAllNotificationsAsRead}
                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-red-400 transition-colors"
                                >
                                    {texts.markAllRead[lang]}
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar relative bg-surface-50 dark:bg-transparent">
                            {(!notifications || notifications.length === 0) ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                                    <div className="w-16 h-16 bg-surface-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-4 text-surface-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">{texts.emptyTitle[lang]}</h3>
                                    <p className="text-xs text-surface-500 font-medium max-w-[200px] mx-auto">
                                        {texts.emptyDesc[lang]}
                                    </p>
                                </div>
                            ) : (
                                notifications.map(notification => {
                                    const title = typeof notification.title === 'string' ? notification.title : notification.title[lang] || notification.title['uz'];
                                    const message = typeof notification.message === 'string' ? notification.message : notification.message[lang] || notification.message['uz'];
                                    let timeAgo = "";
                                    try {
                                        timeAgo = getTimeAgo(notification.date, lang);
                                    } catch (e) {
                                        console.error(e);
                                    }
                                    const isExpanded = expandedId === notification.id;

                                    return (
                                        <div 
                                            key={notification.id} 
                                            onClick={() => handleNotificationClick(notification.id)}
                                            className={`bg-white dark:bg-zinc-900 border ${notification.isRead ? 'border-surface-200 dark:border-white/5 opacity-70' : 'border-primary/30'} p-4 rounded-xl shadow-sm relative overflow-hidden group cursor-pointer transition-all hover:shadow-md`}
                                        >
                                            {!notification.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-l-xl" />
                                            )}
                                            <div className="flex justify-between items-start mb-2">
                                                {!notification.isRead ? (
                                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                                        {texts.new[lang]}
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                    </span>
                                                )}
                                                <span className="text-[9px] text-surface-500 font-bold uppercase">{timeAgo}</span>
                                            </div>
                                            <h3 className="text-sm font-bold text-foreground mb-1 pr-2">{title}</h3>
                                            
                                            <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                                                <p className="text-xs text-surface-600 dark:text-surface-400 font-medium leading-relaxed whitespace-pre-line">
                                                    {message}
                                                </p>
                                                {notification.orderId && (
                                                    <div className="mt-3 bg-surface-100 dark:bg-zinc-800 p-2 rounded-lg inline-block">
                                                        <span className="text-[9px] font-black uppercase text-surface-500 tracking-widest block mb-1">Buyurtma raqami:</span>
                                                        <span className="text-xs font-mono font-black text-foreground">{notification.orderId}</span>
                                                    </div>
                                                )}
                                                {notification.id === 'welcome_bot' && (
                                                    <div className="mt-4 border-t border-surface-200 dark:border-white/5 pt-3">
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                window.open("https://t.me/onepc_uz_bot", "_blank");
                                                            }}
                                                            className="w-full flex items-center justify-center gap-2 bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9]/20 transition-colors py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                                                            Foydalanish qo'llanmasi
                                                        </button>
                                                    </div>
                                                )}

                                                <button 
                                                    className="w-full mt-3 py-2 bg-surface-100 dark:bg-zinc-800 hover:bg-surface-200 dark:hover:bg-zinc-700 transition-colors text-[10px] uppercase font-black tracking-widest rounded-lg"
                                                    onClick={(e) => { e.stopPropagation(); setExpandedId(null); }}
                                                >
                                                    {texts.close[lang]}
                                                </button>
                                            </div>

                                            {!isExpanded && (
                                                <p className="text-xs text-surface-600 dark:text-surface-400 font-medium leading-relaxed line-clamp-2">
                                                    {message}
                                                </p>
                                            )}
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
