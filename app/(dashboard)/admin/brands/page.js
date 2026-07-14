"use client";

import { useState, useEffect } from "react";
import { getBrandsAction, createBrandAction, deleteBrandAction } from "@/lib/actions/product.actions";
import { useTranslation } from "@/lib/LanguageContext";
import useUIStore from "@/store/useUIStore";

export default function AdminBrandsPage() {
    const { t } = useTranslation();
    const { addToast } = useUIStore();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        setLoading(true);
        try {
            const data = await getBrandsAction();
            setBrands(data || []);
        } catch (error) {
            console.error(error);
            addToast("Brendlarni yuklashda xatolik yuz berdi", "error");
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await createBrandAction(formData);
        if (res.success) {
            addToast("Brend muvaffaqiyatli qo'shildi!", "success");
            setShowModal(false);
            setFormData({ name: "" });
            fetchBrands();
        } else {
            addToast(`Xatolik: ${res.error}`, "error");
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (confirm("Haqiqatan ham bu brendni o'chirmoqchimisiz?")) {
            const res = await deleteBrandAction(id);
            if (res.success) {
                addToast("Brend o'chirildi", "success");
                fetchBrands();
            } else {
                addToast(`Xatolik: ${res.error}`, "error");
            }
        }
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in p-4 md:p-10 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter uppercase">Brendlar Boshqaruvi</h1>
                    <p className="text-surface-500 font-bold uppercase tracking-widest text-xs">Do'kondagi brendlarni boshqarish</p>
                </div>
                <button 
                    onClick={() => { setFormData({ name: "" }); setShowModal(true); }}
                    className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs self-start md:self-auto"
                >
                    Yangi Brend
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-surface-300 italic animate-pulse uppercase tracking-widest text-xs">Yuklanmoqda...</div>
                ) : brands.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-surface-400 font-black uppercase tracking-widest text-sm">Hozircha brendlar yo'q</div>
                ) : (
                    brands.map((brand) => (
                        <div key={brand.id} className="bg-surface border border-border-alpha dark:border-white/5 p-8 rounded-[2rem] shadow-premium group hover:border-primary/50 transition-all relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-2xl bg-surface-50 dark:bg-white/5 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform font-black uppercase tracking-tighter text-primary">
                                    {brand.name.charAt(0)}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(brand.id)} className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-white/10 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-foreground capitalize tracking-tight">
                                {brand.name}
                            </h3>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-[0.2em] mt-1">ID: {brand.id}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-surface dark:bg-surface-50 w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-surface-100 dark:border-white/5 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-foreground uppercase tracking-tight mb-8">
                            Yangi Brend Qo'shish
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">Brend Nomi</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-surface-50 dark:bg-white/5 border border-border-alpha dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all text-foreground"
                                    placeholder="Masalan: ASUS"
                                    required
                                    autoFocus
                                />
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                                >
                                    {submitting ? "Saqlanmoqda..." : "Saqlash"}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-surface-50 dark:bg-white/5 text-foreground font-black px-8 py-5 rounded-2xl hover:bg-surface-100 dark:hover:bg-white/10 transition-all uppercase tracking-widest text-xs"
                                >
                                    Bekor qilish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
