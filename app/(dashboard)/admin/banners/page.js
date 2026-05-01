"use client";

import { useState, useEffect } from "react";
import { bannerService } from "@/lib/services/banner.service";

export default function AdminBanners() {
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
        if (editing) {
            await bannerService.updateBanner(editing.id, formData);
        } else {
            await bannerService.addBanner(formData);
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
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this banner?")) {
            await bannerService.deleteBanner(id);
            loadBanners();
        }
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
    };

    return (
        <div className="space-y-10 pb-20">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">Banner Management</h1>
                    <p className="text-surface-500 font-bold">Control the homepage hero slider content.</p>
                </div>
                <button 
                    onClick={async () => {
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
                        loadBanners();
                    }}
                    className="bg-magenta-500 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-magenta-600 transition-all shadow-lg shadow-magenta-500/20"
                >
                    Seed Fuji Demo
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Form */}
                <div className="xl:col-span-1">
                    <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-3xl shadow-premium border border-surface-100 space-y-6 sticky top-24">
                        <h3 className="text-xl font-black text-surface-900 uppercase tracking-tight">
                            {editing ? "Edit Banner" : "Create New Banner"}
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Badge Text</label>
                                <input 
                                    type="text" 
                                    value={formData.badge}
                                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                                    placeholder="e.g. Ultimate Hardware 2026"
                                    className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Main Title</label>
                                    <input 
                                        type="text" 
                                        value={formData.title}
                                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        placeholder="e.g. Performance"
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Subtitle</label>
                                    <input 
                                        type="text" 
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                                        placeholder="e.g. Defined."
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Description</label>
                                <textarea 
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Brief explanation of the banner..."
                                    className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all min-h-[100px]"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Image Asset</label>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                        placeholder="https://... or upload below"
                                        className="flex-1 bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                        required
                                    />
                                    <label className="bg-surface-100 hover:bg-surface-200 p-4 rounded-xl cursor-pointer transition-all border border-surface-200">
                                        <svg className="w-5 h-5 text-surface-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        <input 
                                            type="file" 
                                            className="hidden" 
                                            onChange={async (e) => {
                                                const file = e.target.files[0];
                                                if (!file) return;
                                                const formDataUpload = new FormData();
                                                formDataUpload.append("file", file);
                                                const res = await fetch("/api/upload", { method: "POST", body: formDataUpload });
                                                const data = await res.json();
                                                if (data.url) setFormData({ ...formData, image: data.url });
                                            }}
                                            accept="image/*"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Banner Type</label>
                                    <select 
                                        value={formData.type}
                                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all appearance-none"
                                    >
                                        <option value="hero">Hero Slider (Top)</option>
                                        <option value="promo">Promotion (Mid-Page)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Brand (Promo only)</label>
                                    <input 
                                        type="text" 
                                        value={formData.brand}
                                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                                        placeholder="e.g. DARK PROJECT"
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Link</label>
                                    <input 
                                        type="text" 
                                        value={formData.link}
                                        onChange={(e) => setFormData({...formData, link: e.target.value})}
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-surface-400 tracking-widest block mb-2">Link Text</label>
                                    <input 
                                        type="text" 
                                        value={formData.linkText}
                                        onChange={(e) => setFormData({...formData, linkText: e.target.value})}
                                        className="w-full bg-surface-50 border border-surface-100 p-4 rounded-xl font-bold text-sm focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <button type="submit" className="flex-1 bg-primary text-white font-black py-4 rounded-xl hover:bg-primary-600 transition-all text-xs uppercase tracking-widest">
                                {editing ? "Save Changes" : "Publish Banner"}
                            </button>
                            {editing && (
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setEditing(null);
                                        setFormData({ title: "", subtitle: "", badge: "", description: "", image: "", link: "/products", linkText: "Shop Now" });
                                    }}
                                    className="bg-surface-100 text-surface-900 font-black px-6 rounded-xl hover:bg-surface-200 transition-all text-xs uppercase"
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
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {banners.map((banner) => (
                                <div key={banner.id} className="bg-surface border border-surface-100 rounded-3xl overflow-hidden shadow-premium flex flex-col md:flex-row group">
                                    <div className="relative w-full md:w-64 h-48 md:h-auto bg-surface-50">
                                        <img src={banner.image} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="flex-1 p-8 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{banner.badge}</span>
                                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${banner.type === 'promo' ? 'bg-magenta-500 text-white' : 'bg-surface-200 text-surface-600'}`}>
                                                        {banner.type || 'hero'}
                                                    </span>
                                                </div>
                                                <h4 className="text-xl font-black text-surface-900 uppercase">{banner.title} {banner.subtitle}</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(banner)}
                                                    className="w-10 h-10 rounded-xl bg-surface-50 border border-surface-100 flex items-center justify-center text-surface-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(banner.id)}
                                                    className="w-10 h-10 rounded-xl bg-surface-50 border border-surface-100 flex items-center justify-center text-surface-400 hover:text-red-500 hover:border-red-500 transition-all shadow-sm"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-surface-500 font-medium line-clamp-2">{banner.description}</p>
                                        <div className="pt-4 flex items-center gap-4 border-t border-surface-50">
                                            <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest">
                                                Link: <span className="text-surface-900">{banner.link}</span>
                                            </div>
                                            <div className="w-1 h-1 bg-surface-200 rounded-full" />
                                            <div className="text-[10px] font-black uppercase text-surface-400 tracking-widest">
                                                Text: <span className="text-surface-900">{banner.linkText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {banners.length === 0 && !loading && (
                                <div className="text-center py-20 bg-surface-50 rounded-3xl border border-dashed border-surface-200">
                                    <p className="text-surface-400 font-bold">No custom banners yet. Using default placeholders.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
