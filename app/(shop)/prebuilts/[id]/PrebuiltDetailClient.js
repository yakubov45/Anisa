"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import useStore from "@/store/useStore";
import { CatalogCard } from "../PrebuiltsClient";
import { useTranslation } from "@/lib/LanguageContext";
import { translateSpec } from "@/lib/utils/translateSpec";
import { getSpecExplanation } from "@/lib/utils/specExplanations";

export default function PrebuiltDetailClient({ pc, otherPrebuilts = [] }) {
    const { t, lang } = useTranslation();
    const [activeImage, setActiveImage] = useState(0);
    const [ramUpgrade, setRamUpgrade] = useState(0);
    const [storageUpgrade, setStorageUpgrade] = useState(0);
    const [activeModal, setActiveModal] = useState(null);

    useEffect(() => {
        if (!pc.images || pc.images.length <= 1) return;
        const interval = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % pc.images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [pc.images]);
    const [quantity, setQuantity] = useState(1);
    const { currency, exchangeRate, addToCart } = useStore();
    
    // Fix hydration issue for currency
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Calculate total price including upgrades
    const isDbPriceInUZS = pc.price > 100000;
    const ramCost = isDbPriceInUZS ? (ramUpgrade > 0 ? ramUpgrade * exchangeRate : 0) : ramUpgrade;
    const storageCost = isDbPriceInUZS ? (storageUpgrade > 0 ? storageUpgrade * exchangeRate : 0) : storageUpgrade;
    const totalPrice = pc.price + ramCost + storageCost;
    const price = mounted ? formatPrice(totalPrice, currency || "UZS", exchangeRate) : formatPrice(totalPrice, "UZS", exchangeRate);

    const handleAddToCart = () => {
        let upgradeText = [];
        if (ramUpgrade > 0) upgradeText.push("32GB RAM");
        if (storageUpgrade > 0) upgradeText.push("1TB SSD");
        
        const finalName = upgradeText.length > 0 
            ? `${pc.name} (+${upgradeText.join(", ")})` 
            : pc.name;

        addToCart({
            id: pc.id + (ramUpgrade > 0 ? "-ram" : "") + (storageUpgrade > 0 ? "-ssd" : ""), // Unique ID for cart
            name: finalName,
            price: totalPrice,
            image: pc.images?.[0] || 'https://via.placeholder.com/400x300',
            category: 'prebuilt',
            quantity: quantity
        });
        toast.success(`${finalName} savatchaga qo'shildi!`);
    };

    const specifications = pc.specifications || [];

    const specsList = specifications.length > 0
        ? specifications.map(s => ({ label: s.name, value: s.value }))
        : [
            { label: "CPU", value: pc.quick_specs?.cpu },
            { label: "GPU", value: pc.quick_specs?.gpu },
            { label: "RAM", value: pc.quick_specs?.ram },
            { label: "Mobo", value: pc.quick_specs?.motherboard },
            { label: "PSU", value: pc.quick_specs?.psu },
            { label: "SSD", value: pc.quick_specs?.storage || pc.quick_specs?.ssd },
            { label: "Cooling", value: pc.quick_specs?.cooling },
            { label: "Case", value: pc.quick_specs?.case },
        ].filter(s => s.value);

    const featuredChips = specifications.length > 0
        ? specifications.filter(s => s.isFeatured)
        : [
            { name: "CPU", value: pc.quick_specs?.cpu },
            { name: "GPU", value: pc.quick_specs?.gpu },
            { name: "RAM", value: pc.quick_specs?.ram },
            { name: "SSD", value: pc.quick_specs?.storage || pc.quick_specs?.ssd }
        ].filter(s => s.value);

    const hasFpsTests = pc.fps_tests && pc.fps_tests.length > 0;

    return (
        <div className="w-full py-6">
            <div className="max-w-7xl mx-auto">

                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-24">
                    {/* LEFT: Images */}
                    <div className="space-y-6">
                        <motion.div
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="aspect-square sm:aspect-[4/3] bg-surface-50 dark:bg-black/40 rounded-3xl overflow-hidden flex items-center justify-center p-8 relative border border-black/5 dark:border-white/5"
                        >
                            <img
                                src={pc.images?.[activeImage] || "https://via.placeholder.com/800x800?text=No+Image"}
                                alt={pc.name}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        {pc.images && pc.images.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                {pc.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all bg-surface-50 dark:bg-black/40 ${i === activeImage ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* CONFIGURATOR (Small Upgrades) */}
                        {pc.allow_upgrades !== false && (
                            <div className="pt-6 border-t border-black/5 dark:border-white/5 space-y-4">
                                <h3 className="font-black uppercase tracking-widest text-sm text-foreground">{t("comp_upgrade") || "Kompyuterni kuchaytirish"}</h3>
                                
                                {/* RAM Upgrade */}
                                <div>
                                    <label className="block text-xs font-bold text-surface-500 mb-2">{t("category_ram") || "Operativ Xotira (RAM)"}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => setRamUpgrade(0)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${ramUpgrade === 0 ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 hover:border-black/20'}`}
                                        >
                                            <div className="font-black text-sm text-foreground">{t("comp_standart") || "Standart"}</div>
                                            <div className="text-xs text-surface-500 font-bold">+ {mounted ? formatPrice(0, currency || "UZS", exchangeRate) : "..."}</div>
                                        </button>
                                        <button 
                                            onClick={() => setRamUpgrade(45)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${ramUpgrade === 45 ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 hover:border-black/20'}`}
                                        >
                                            <div className="font-black text-sm text-foreground">{t("comp_upgrade_32") || "32GB ga oshirish"}</div>
                                            <div className="text-xs text-primary font-bold">+ {mounted ? formatPrice(isDbPriceInUZS ? 45 * exchangeRate : 45, currency || "UZS", exchangeRate) : "..."}</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Storage Upgrade */}
                                <div>
                                    <label className="block text-xs font-bold text-surface-500 mb-2">{t("category_storage") || "Xotira (SSD)"}</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => setStorageUpgrade(0)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${storageUpgrade === 0 ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 hover:border-black/20'}`}
                                        >
                                            <div className="font-black text-sm text-foreground">{t("comp_standart") || "Standart"}</div>
                                            <div className="text-xs text-surface-500 font-bold">+ {mounted ? formatPrice(0, currency || "UZS", exchangeRate) : "..."}</div>
                                        </button>
                                        <button 
                                            onClick={() => setStorageUpgrade(35)}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${storageUpgrade === 35 ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 hover:border-black/20'}`}
                                        >
                                            <div className="font-black text-sm text-foreground">{t("comp_upgrade_1tb") || "1TB ga oshirish"}</div>
                                            <div className="text-xs text-primary font-bold">+ {mounted ? formatPrice(isDbPriceInUZS ? 35 * exchangeRate : 35, currency || "UZS", exchangeRate) : "..."}</div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4">
                                {pc.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-6">
                                <span className="text-3xl md:text-4xl font-black text-primary" suppressHydrationWarning>{price}</span>
                                <div className="flex items-center gap-2">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <span className="text-sm font-bold text-surface-400">5.0 (8 sharh)</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-surface-600 dark:text-surface-300 text-lg leading-relaxed font-medium">
                            {pc.description || "Maksimal unumdorlik va mukammal dizaynga ega tayyor kompyuter. Eng zamonaviy o'yinlar va og'ir dasturlarda muammosiz ishlash uchun maxsus yig'ilgan."}
                        </div>

                        <div className="space-y-2.5">
                            {specsList.map((spec, i) => (
                                <div key={i} className="flex gap-2 text-sm items-center py-1 border-b border-black/5 dark:border-white/5">
                                    <span className="font-black text-surface-400 dark:text-surface-500 uppercase tracking-wider w-24 shrink-0">
                                        <div className="flex flex-col">
                                            <span>{translateSpec(spec.label, lang)}</span>
                                            <button 
                                                onClick={() => setActiveModal({ name: spec.label })}
                                                className="text-[8px] md:text-[9px] text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold uppercase tracking-wider mt-0.5 hover:underline transition-colors text-left flex items-center gap-1"
                                            >
                                                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                {lang === 'uz' ? "Nima bu?" : lang === 'ru' ? "Что это?" : "What is this?"}
                                            </button>
                                        </div>
                                    </span>
                                    <span className="font-bold text-foreground">
                                        {translateSpec(spec.value, lang)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* 4 Big Spec Chips */}
                        {featuredChips.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                                {featuredChips.slice(0, 4).map((spec, i) => {
                                    let icon = <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
                                    const name = spec.name?.toUpperCase() || spec.label?.toUpperCase();
                                    if (name === "CPU" || name === "PROTSESSOR") {
                                        icon = <img src="/cpu-removebg-preview.png" alt="CPU" className="w-8 h-8 object-contain scale-[1.8]" />;
                                    } else if (name === "GPU" || name === "VIDEOKARTA") {
                                        icon = <img src="/gpu-removebg-preview.png" alt="GPU" className="w-8 h-8 object-contain scale-[1.8]" />;
                                    } else if (name === "RAM" || name === "OPERATIV XOTIRA") {
                                        icon = <img src="/ram-removebg-preview.png" alt="RAM" className="w-8 h-8 object-contain scale-[1.8]" />;
                                    } else if (["SSD", "STORAGE", "XOTIRA"].includes(name)) {
                                        icon = <img src="/ssd-removebg-preview.png" alt="SSD" className="w-8 h-8 object-contain scale-[1.8]" />;
                                    }
                                    return (
                                        <SpecChip key={i} icon={icon} value={translateSpec(spec.value, lang)} label={translateSpec(spec.name || spec.label, lang)} />
                                    );
                                })}
                            </div>
                        )}



                        {/* Add to Cart Area */}
                        <div className="pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row gap-4 items-end">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-surface-400 mb-2">{t("qty_label") || "Miqdor"}</label>
                                <div className="flex items-center bg-surface-50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5 p-1">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors font-black text-xl">-</button>
                                    <span className="w-12 text-center font-black text-lg">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors font-black text-xl">+</button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-primary hover:bg-primary-600 text-white font-black py-4 px-8 rounded-xl uppercase tracking-widest text-sm transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/20 h-[52px] flex items-center justify-center"
                            >
                                {t("prebuilt_add_to_cart") || "Savatga Qo'shish"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Marketing Section: Performance */}
                {hasFpsTests && (
                    <div className="py-24 border-t border-black/5 dark:border-white/5">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-foreground">
                                {t("perf_title") || t("prebuilt_game_fps_title") || "O'YINLARDAGI KUCHI (FPS)"}
                            </h2>
                            <p className="text-xl text-surface-500 font-medium">
                                {t("prebuilt_game_fps_desc") || "Ushbu kompyuter bilan siz yoqtirgan o'yinlarda qanday natija olishingizni ko'ring."}
                            </p>
                        </div>

                        <div className="bg-surface-50 dark:bg-white/5 rounded-[2.5rem] border border-black/5 dark:border-white/10 p-8 md:p-12">
                            <FPSCalculator fpsTests={pc.fps_tests} t={t} />
                        </div>
                    </div>
                )}

                {/* Marketing Section: What's Included */}
                <div className="py-24 border-t border-black/5 dark:border-white/5">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-center text-foreground">
                        {t("prebuilt_box_title")}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { 
                                icon: (
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                ), 
                                title: t("prebuilt_box_pc") 
                            },
                            { 
                                icon: (
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ), 
                                title: t("prebuilt_box_warranty") 
                            },
                            { 
                                icon: (
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                ), 
                                title: t("prebuilt_box_manual") 
                            },
                            { 
                                icon: (
                                    <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ), 
                                title: t("prebuilt_box_cable") 
                            }
                        ].map((item, i) => (
                            <div key={i} className="bg-surface-50 dark:bg-white/5 rounded-2xl p-6 border border-black/5 dark:border-white/5 text-center flex flex-col items-center justify-center gap-4 hover:-translate-y-1 transition-transform">
                                {item.icon}
                                <h4 className="font-black uppercase tracking-widest text-sm text-foreground">{item.title}</h4>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Related Products Section (Other Prebuilts) */}
                {otherPrebuilts && otherPrebuilts.length > 0 && (
                    <div className="py-24 border-t border-black/5 dark:border-white/5">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-12 text-left text-foreground">
                            {t("prebuilt_other_computers")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                            {otherPrebuilts.map((item) => (
                                <CatalogCard
                                    key={item.id}
                                    pc={item}
                                    currency={currency}
                                    exchangeRate={exchangeRate}
                                    layout="col"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Explanation Modal */}
                {activeModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setActiveModal(null)}>
                        <div 
                            className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative"
                            onClick={e => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 transition-colors text-foreground"
                            >
                                ✕
                            </button>
                            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-3">
                                {translateSpec(activeModal.name, lang)}
                            </h3>
                            <p className="text-sm text-surface-600 dark:text-surface-300 font-medium leading-relaxed">
                                {getSpecExplanation(activeModal.name)[lang] || getSpecExplanation(activeModal.name)['en']}
                            </p>
                            <button 
                                onClick={() => setActiveModal(null)}
                                className="w-full mt-6 bg-surface-100 dark:bg-white/5 hover:bg-surface-200 dark:hover:bg-white/10 text-foreground font-black uppercase tracking-wider text-xs py-3 rounded-xl transition-colors"
                            >
                                {lang === 'uz' ? "Tushunarli" : lang === 'ru' ? "Понятно" : "Got it"}
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}

function SpecChip({ icon, value, label }) {
    if (!value) return null;
    return (
        <div className="bg-surface-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-4 flex flex-col items-center text-center gap-2 group hover:border-primary/30 transition-all">
            <div className="w-12 h-12 flex items-center justify-center bg-white dark:bg-white rounded-xl shadow-sm mb-1">
                <span className="text-primary">{icon}</span>
            </div>
            <span className="text-sm font-black text-foreground line-clamp-2 leading-tight">{value}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-surface-400 mt-auto">{label}</span>
        </div>
    );
}

function FPSCalculator({ fpsTests, t }) {
    const gameImages = {
        "CS2": "https://preview.redd.it/today-marks-1-year-since-cs2-official-release-heres-to-10-v0-5227y6wa0frd1.png?auto=webp&s=a18f71a876dcf99bf418b3c191e8c267134aaa1b",
        "Valorant": "https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt7270e5b7fbca5eb8/623277908b982e0e5aee08e6/VALORANT_Episode4_Act2_Press_KeyArt.png",
        "GTA V": "https://media-rockstargames-com.akamaized.net/rockstargames-newsite/global/23fbdd3d-f21d-4006-a83a-867df3c9c614.jpg",
        "Cyberpunk": "https://mms.businesswire.com/media/20201209005953/en/845688/5/Cyberpunk_2077_Key_Art.jpg",
        "PUBG": "https://wstatic-prod-boc.krafton.com/common/bg/pubg-bg.jpg"
    };

    const games = fpsTests.map(test => ({
        name: test.name,
        fps: parseInt(test.fps) || 60,
        img: gameImages[test.name] || gameImages["CS2"]
    }));

    const resolutions = ["1080p", "1440p", "4K"];
    const [selectedGame, setSelectedGame] = useState(games[0]);
    const [selectedRes, setSelectedRes] = useState("1080p");

    const getResMultiplier = (res) => res === "1080p" ? 1.0 : res === "1440p" ? 0.75 : 0.5;
    
    const calculatedFps = Math.round(selectedGame.fps * getResMultiplier(selectedRes));
    
    // Animate numbers smoothly
    const [displayFps, setDisplayFps] = useState(0);
    useEffect(() => {
        let start = displayFps;
        const end = calculatedFps;
        const duration = 500;
        const startTime = performance.now();

        const animate = (time) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = progress * (2 - progress);
            setDisplayFps(Math.round(start + (end - start) * easeProgress));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [calculatedFps]);

    return (
        <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Controls */}
            <div className="w-full lg:w-1/2 space-y-8">
                <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-surface-400 mb-4">{t?.("perf_select_game") || "O'yinni tanlang"}</label>
                    <div className="flex flex-wrap gap-3">
                        {games.map((g, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedGame(g)}
                                className={`px-5 py-3 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${selectedGame.name === g.name ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105' : 'bg-white dark:bg-white/5 text-foreground hover:bg-surface-100 dark:hover:bg-white/10'}`}
                            >
                                {g.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-black uppercase tracking-widest text-surface-400 mb-4">{t?.("perf_resolution") || "Grafika (Rezolyutsiya)"}</label>
                    <div className="flex gap-3 bg-white dark:bg-black/30 p-2 rounded-2xl border border-black/5 dark:border-white/5">
                        {resolutions.map(res => (
                            <button
                                key={res}
                                onClick={() => setSelectedRes(res)}
                                className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${selectedRes === res ? 'bg-surface-100 dark:bg-white/10 text-primary shadow-sm' : 'text-surface-500 hover:text-foreground'}`}
                            >
                                {res}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Visualizer */}
            <div className="w-full lg:w-1/2 relative">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[16/10] shadow-2xl border border-black/10 dark:border-white/10 group">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={selectedGame.name}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4 }}
                            src={selectedGame.img}
                            alt={selectedGame.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                        <div>
                            <div className="text-white/80 font-black uppercase tracking-widest text-xs mb-1">{selectedRes} | Ultra Settings</div>
                            <div className="text-3xl font-black text-white drop-shadow-md">{selectedGame.name}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-primary font-black uppercase tracking-widest text-xs mb-1">Kutilayotgan</div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-6xl font-black text-white drop-shadow-lg tabular-nums">{displayFps}</span>
                                <span className="text-xl font-bold text-primary">FPS</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
