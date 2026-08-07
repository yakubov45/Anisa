"use client";

import { useState, useEffect, useRef } from "react";
import { getBrandsAction, createBrandAction, deleteBrandAction, updateBrandAction } from "@/lib/actions/product.actions";
import useUIStore from "@/store/useUIStore";
import { auth } from "@/lib/firebase/client";

export default function AdminBrandsPage() {
    const { addToast } = useUIStore();
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ name: "" });
    const [submitting, setSubmitting] = useState(false);
    const [uploadingId, setUploadingId] = useState(null);
    const fileInputRefs = useRef({});

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

    const handleImageUpload = async (brandId, file) => {
        if (!file) return;
        setUploadingId(brandId);
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('brandId', brandId);
            
            const token = await auth.currentUser?.getIdToken();

            const res = await fetch('/api/upload-brand-image', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: fd,
            });
            const data = await res.json();

            if (!res.ok || !data.url) {
                throw new Error(data.error || 'Upload failed');
            }

            // Save the image URL to Firestore
            const updateRes = await updateBrandAction(brandId, { logo: data.url });
            if (updateRes.success) {
                addToast("Rasm muvaffaqiyatli yuklandi!", "success");
                fetchBrands();
            } else {
                throw new Error(updateRes.error);
            }
        } catch (error) {
            addToast(`Rasm yuklashda xatolik: ${error.message}`, "error");
        } finally {
            setUploadingId(null);
            // Reset file input
            if (fileInputRefs.current[brandId]) {
                fileInputRefs.current[brandId].value = '';
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
                        <div key={brand.id} className="bg-surface border border-border-alpha dark:border-white/5 p-6 rounded-[2rem] shadow-premium group hover:border-primary/50 transition-all relative">
                            {/* Header actions */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1" />
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDelete(brand.id)}
                                        className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-white/10 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors"
                                        title="O'chirish"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Logo Area */}
                            <div
                                className="relative w-full aspect-square rounded-2xl bg-surface-50 dark:bg-white/5 flex items-center justify-center mb-4 overflow-hidden border border-dashed border-surface-200 dark:border-white/10 hover:border-primary/50 transition-all cursor-pointer group/logo"
                                onClick={() => fileInputRefs.current[brand.id]?.click()}
                            >
                                {uploadingId === brand.id ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">Yuklanmoqda...</span>
                                    </div>
                                ) : brand.logo ? (
                                    <>
                                        <img
                                            src={brand.logo}
                                            alt={brand.name}
                                            className="w-full h-full object-contain p-4"
                                        />
                                        {/* Overlay on hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                                            <div className="flex flex-col items-center gap-1">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                                </svg>
                                                <span className="text-white text-[9px] font-black uppercase tracking-widest">Rasm almashtirish</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-surface-400">
                                        <svg className="w-10 h-10 group-hover/logo:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-[9px] font-black uppercase tracking-widest group-hover/logo:text-primary transition-colors">Rasm qo'shish</span>
                                    </div>
                                )}

                                {/* Hidden file input */}
                                <input
                                    ref={el => fileInputRefs.current[brand.id] = el}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={e => handleImageUpload(brand.id, e.target.files[0])}
                                    onClick={e => e.stopPropagation()}
                                />
                            </div>

                            {/* Brand name */}
                            <h3 className="text-base font-black text-foreground capitalize tracking-tight text-center">{brand.name}</h3>
                            <p className="text-[9px] text-surface-400 font-bold uppercase tracking-[0.2em] mt-1 text-center">ID: {brand.id.slice(0, 8)}...</p>

                            {/* Upload button */}
                            <button
                                onClick={() => fileInputRefs.current[brand.id]?.click()}
                                disabled={uploadingId === brand.id}
                                className="mt-3 w-full bg-surface-50 dark:bg-white/5 border border-surface-200 dark:border-white/10 text-foreground font-black py-2.5 rounded-xl text-[9px] uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all disabled:opacity-50"
                            >
                                {brand.logo ? 'Rasmni Almashtirish' : 'Rasm Yuklash'}
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Add Brand Modal */}
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
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-surface-50 dark:bg-white/5 border border-border-alpha dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none transition-all text-foreground"
                                    placeholder="Masalan: ASUS"
                                    required
                                    autoFocus
                                />
                            </div>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-widest">
                                * Brendni qo'shgandan so'ng rasm yuklashingiz mumkin
                            </p>
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
