"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { deletePreBuiltSystemAction } from "@/lib/actions/product.actions";
import toast from "react-hot-toast";

export default function PrebuiltsListClient({ initialData }) {
    const [prebuilts, setPrebuilts] = useState(initialData || []);
    const [deletingId, setDeletingId] = useState(null);

    const handleDelete = async (id, name) => {
        if (!confirm(`Haqiqatan ham "${name}" kompyuterini o'chirib tashlamoqchimisiz?`)) {
            return;
        }

        setDeletingId(id);
        const loadingToast = toast.loading("Kompyuter o'chirilmoqda...");

        try {
            const res = await deletePreBuiltSystemAction(id);
            if (res.success) {
                toast.success("Kompyuter muvaffaqiyatli o'chirildi!", { id: loadingToast });
                setPrebuilts(prebuilts.filter(pc => pc.id !== id));
            } else {
                toast.error(`Xatolik yuz berdi: ${res.error}`, { id: loadingToast });
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Tizim xatoligi yuz berdi", { id: loadingToast });
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-fade-in pb-20 px-4 md:px-0 text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-black/5 dark:border-white/5 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                        Tayyor Kompyuterlar
                    </h1>
                    <p className="text-sm text-surface-500 font-medium">
                        Bosh sahifadagi va katalogdagi kompyuterlarni boshqarish hamda o'chirish.
                    </p>
                </div>
                <a 
                    href="/admin/prebuilts/new" 
                    className="self-start md:self-auto bg-gradient-to-r from-primary to-rose-500 text-white px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-98 transition-all text-center flex items-center justify-center gap-2 border border-white/10"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    Yangi Qo'shish
                </a>
            </div>

            {/* Main Cards Wrapper */}
            <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/10 p-6 md:p-10">
                {prebuilts.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                        <div className="w-16 h-16 bg-surface-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-surface-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="space-y-1">
                            <p className="text-base font-black uppercase tracking-wider text-foreground">Hali tayyor kompyuterlar yo'q</p>
                            <p className="text-xs text-surface-400 font-medium">Boshlash uchun yuqoridagi "Yangi Qo'shish" tugmasini bosing.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prebuilts.map(pc => (
                            <div 
                                key={pc.id} 
                                className="group relative border border-black/5 dark:border-white/10 rounded-3xl p-5 flex flex-col bg-surface-50/50 dark:bg-black/20 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                            >
                                {/* Featured Ribbon Badge */}
                                {pc.isFeatured && (
                                    <span className="absolute top-4 left-4 z-10 bg-primary/95 backdrop-blur-sm text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-sm">
                                        Bosh Sahifada
                                    </span>
                                )}

                                {/* Image Box */}
                                <div className="h-44 bg-white dark:bg-black/40 border border-black/5 dark:border-white/5 rounded-2xl mb-4 p-4 flex items-center justify-center overflow-hidden relative">
                                    <img 
                                        src={pc.images?.[0] || 'https://via.placeholder.com/200'} 
                                        alt={pc.name} 
                                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" 
                                    />
                                </div>

                                {/* PC Name (Visible & Clear) */}
                                <h3 className="font-black text-foreground uppercase text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                    {pc.name || "Nomsiz Kompyuter"}
                                </h3>

                                {/* Price */}
                                <p className="text-primary text-lg font-black mb-4 tracking-tight">
                                    {formatPrice(pc.price, 'UZS')}
                                </p>
                                
                                {/* Quick Specs Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {pc.quick_specs?.cpu && (
                                        <span className="text-[9px] font-black bg-primary/5 dark:bg-primary/10 border border-primary/5 px-2.5 py-1.5 rounded-lg text-primary uppercase tracking-wider">
                                            CPU: {pc.quick_specs.cpu}
                                        </span>
                                    )}
                                    {pc.quick_specs?.gpu && (
                                        <span className="text-[9px] font-black bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/5 px-2.5 py-1.5 rounded-lg text-rose-500 uppercase tracking-wider">
                                            GPU: {pc.quick_specs.gpu}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Action Buttons (View public and Delete) */}
                                <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                                    {/* View Public Button */}
                                    <a 
                                        href={`/prebuilts/${pc.id}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex-1 bg-surface-100 hover:bg-surface-200 dark:bg-white/10 dark:hover:bg-white/15 text-foreground text-center py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors border border-black/5 dark:border-white/5"
                                    >
                                        Ko'rish ↗
                                    </a>

                                    {/* Delete Button */}
                                    <button 
                                        type="button" 
                                        disabled={deletingId === pc.id}
                                        onClick={() => handleDelete(pc.id, pc.name)}
                                        className="bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50 border border-rose-500/15"
                                    >
                                        {deletingId === pc.id ? "..." : "O'chirish"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
