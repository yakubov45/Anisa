"use client";

import { useState, useEffect } from "react";
import { bannerService } from "@/lib/services/banner.service";
import { useTranslation } from "@/lib/LanguageContext";
import useUIStore from "@/store/useUIStore";
import { auth } from "@/lib/firebase/client";

export default function AdminBanners() {
    const { t } = useTranslation();
    const { addToast, showConfirm } = useUIStore();
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        badge: "",
        description: "",
        image: "",
        link: "/products",
        linkText: "Shop Now",
        type: "hero",
        brand: ""
    });

    useEffect(() => {
        loadBanners();
    }, []);

    const loadBanners = async () => {
        setLoading(true);
        const data = await bannerService.getBanners();
        setBanners(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await bannerService.updateBanner(editing.id, formData);
                addToast("Banner successfully updated");
            } else {
                await bannerService.addBanner(formData);
                addToast("New banner successfully published");
            }
            setEditing(null);
            setFormData({
                title: "",
                subtitle: "",
                badge: "",
                description: "",
                image: "",
                link: "/products",
                linkText: "Shop Now",
                type: "hero",
                brand: ""
            });
            loadBanners();
        } catch (error) {
            addToast(error.message, "error");
        }
    };

    const handleDelete = (id) => {
        showConfirm(
            t('ban_confirm_delete'),
            async () => {
                try {
                    await bannerService.deleteBanner(id);
                    addToast("Banner successfully removed");
                    loadBanners();
                } catch (error) {
                    addToast(error.message, "error");
                }
            },
            "Remove Banner"
        );
    };

    const handleEdit = (banner) => {
        setEditing(banner);
        setFormData({
            title: banner.title,
            subtitle: banner.subtitle,
            badge: banner.badge,
            description: banner.description,
            image: banner.image,
            link: banner.link,
            linkText: banner.linkText,
            type: banner.type || "hero",
            brand: banner.brand || ""
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-black text-surface-900 dark:text-white tracking-tighter uppercase leading-none">{t('ban_management')}</h1>
                    <p className="text-surface-400 dark:text-surface-500 font-bold uppercase text-[10px] tracking-widest">{t('ban_desc')}</p>
                </div>
                <button 
                    onClick={async () => {
                        try {
                            await bannerService.addBanner({
                                title: "DARK PROJECT 87",
                                subtitle: "FUJI",
                                badge: "Limited Edition",
                                description: "Mechanical masterpiece with Fuji-themed aesthetics.",
                                image: "https://firebasestorage.googleapis.com/v0/b/onepc-uz.appspot.com/o/banners%2Fpromo-fuji.png?alt=media",
                                link: "/products",
                                linkText: "Acquire Now",
                                type: "promo",
                                brand: "DARK PROJECT"
                            });
                            addToast("Demo banner seeded successfully");
                            loadBanners();
                        } catch (error) {
                            addToast(error.message, "error");
                        }
                    }}
                    className="bg-magenta-500 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-magenta-600 transition-all shadow-xl shadow-magenta-500/20"
                >
                    {t('ban_seed_demo')}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Form */}
                <div className="xl:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-surface dark:bg-surface-50 p-10 rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-surface-100 dark:border-white/5 space-y-8 sticky top-24">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Protocol</span>
                            <h3 className="text-2xl font-black text-surface-900 dark:text-white uppercase tracking-tight leading-none">
                                {editing ? t('ban_edit_banner') : t('ban_create_banner')}
                            </h3>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_badge_label')}</label>
                                <input 
                                    type="text" 
                                    value={formData.badge}
                                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                                    placeholder="e.g. Ultimate Hardware 2026"
                                    className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_title_label')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. Performance"
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_subtitle_label')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        placeholder="e.g. Defined."
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_desc_label')}</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Brief explanation..."
                                    className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all min-h-[120px]"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_image_label')}</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        placeholder="https://..."
                                        className="flex-1 bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                        required
                                    />
                                    <label className="bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 p-5 rounded-2xl cursor-pointer transition-all border border-surface-200 dark:border-white/20">
                                        <svg className="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const formDataUpload = new FormData();
                                                formDataUpload.append("file", file);
                                                addToast("Initializing secure upload...");
                                                try {
                                                    const token = await auth.currentUser?.getIdToken();
                                                    const res = await fetch("/api/upload", { 
                                                        method: "POST", 
                                                        headers: {
                                                            "Authorization": `Bearer ${token}`
                                                        },
                                                        body: formDataUpload 
                                                    });
                                                    const data = await res.json();
                                                    if (data.url) {
                                                        setFormData({ ...formData, image: data.url });
                                                        addToast("Asset uploaded successfully");
                                                    }
                                                } catch (err) {
                                                    addToast("Secure upload failed", "error");
                                                }
                                            }}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_type_label')}</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="hero">{t('ban_hero_type')}</option>
                                        <option value="promo">{t('ban_promo_type')}</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_brand_label')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.brand}
                                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                        placeholder="e.g. DARK PROJECT"
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_link_label')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.link}
                                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest px-2">{t('ban_link_text_label')}</label>
                                    <input 
                                        type="text" 
                                        value={formData.linkText}
                                        onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 p-5 rounded-2xl font-bold text-sm focus:ring-1 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-primary text-white font-black py-5 rounded-2xl hover:brightness-110 transition-all text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">
                                {editing ? t('ban_save') : t('ban_publish')}
                            </button>
                            {editing && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditing(null);
                                        setFormData({ title: "", subtitle: "", badge: "", description: "", image: "", link: "/products", linkText: "Shop Now", type: "hero", brand: "" });
                                    }}
                                    className="px-8 bg-surface-100 dark:bg-white/10 text-surface-900 dark:text-white font-black rounded-2xl hover:bg-surface-200 dark:hover:bg-white/20 transition-all text-[10px] uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="xl:col-span-2 space-y-6">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-40 space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-surface-400">Syncing Assets...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {banners.map((banner) => (
                                <div key={banner.id} className="bg-surface dark:bg-surface-50 border border-surface-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/5 flex flex-col md:flex-row group hover:border-primary/20 transition-all duration-500">
                                    <div className="relative w-full md:w-80 h-64 md:h-auto bg-surface-50 dark:bg-white/5 overflow-hidden">
                                        <img src={banner.image} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" />
                                        <div className="absolute inset-0 bg-primary/5 mix-blend-overlay" />
                                    </div>
                                    <div className="flex-1 p-10 space-y-6 flex flex-col justify-center">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{banner.badge}</span>
                                                    <span className={`text-[8px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${banner.type === 'promo' ? 'bg-magenta-500 text-white' : 'bg-surface-100 dark:bg-white/10 text-surface-600 dark:text-surface-400'}`}>
                                                        {banner.type === 'promo' ? t('ban_promo_type') : t('ban_hero_type')}
                                                    </span>
                                                </div>
                                                <h4 className="text-2xl font-black text-surface-900 dark:text-white uppercase tracking-tight leading-none">{banner.title} <span className="text-primary">{banner.subtitle}</span></h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(banner)}
                                                    className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 flex items-center justify-center text-surface-400 hover:text-primary hover:border-primary transition-all shadow-xl shadow-black/5"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="w-12 h-12 rounded-2xl bg-surface-50 dark:bg-white/5 border border-surface-100 dark:border-white/10 flex items-center justify-center text-surface-400 hover:text-red-500 hover:border-red-500 transition-all shadow-xl shadow-black/5"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-surface-500 dark:text-surface-400 font-bold leading-relaxed uppercase tracking-widest line-clamp-2 italic">{banner.description}</p>
                                        <div className="pt-6 flex items-center gap-6 border-t border-surface-50 dark:border-white/5">
                                            <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest">
                                                Path: <span className="text-surface-900 dark:text-white font-mono">{banner.link}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-primary rounded-full" />
                                            <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest">
                                                Trigger: <span className="text-surface-900 dark:text-white">{banner.linkText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && !loading && (
                                <div className="text-center py-40 bg-surface-50 dark:bg-surface-50 rounded-[2.5rem] border border-dashed border-surface-200 dark:border-white/10">
                                    <p className="text-surface-400 font-black uppercase tracking-[0.3em] text-xs">{t('ban_no_banners')}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
