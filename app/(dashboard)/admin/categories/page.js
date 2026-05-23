"use client";

import { useState, useEffect } from "react";
import { categoryService } from "@/lib/services/category.service";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminCategoriesPage() {
    const { t, lang } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [formData, setFormData] = useState({ name: "", name_ru: "", name_en: "", slug: "", icon: "🏷️" });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        const data = await categoryService.getAll();
        setCategories(data);
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            await categoryService.update(editing.id, formData);
        } else {
            await categoryService.create(formData);
        }
        setShowModal(false);
        setEditing(null);
        setFormData({ name: "", name_ru: "", name_en: "", slug: "", icon: "🏷️" });
        fetchCategories();
    };

    const handleDelete = async (id) => {
        if (confirm(t('cat_confirm_delete'))) {
            await categoryService.delete(id);
            fetchCategories();
        }
    };

    const openEdit = (cat) => {
        setEditing(cat);
        setFormData({ name: cat.name, name_ru: cat.name_ru || "", name_en: cat.name_en || "", slug: cat.slug, icon: cat.icon || "🏷️" });
        setShowModal(true);
    };

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">{t('cat_taxonomy_control')}</h1>
                    <p className="text-surface-500 font-bold italic">{t('cat_taxonomy_desc')}</p>
                </div>
                <button 
                    onClick={() => { setEditing(null); setFormData({ name: "", name_ru: "", name_en: "", slug: "", icon: "🏷️" }); setShowModal(true); }}
                    className="bg-primary text-white font-black px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 transition-all uppercase tracking-widest text-xs"
                >
                    {t('cat_new_category')}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-surface-300 italic animate-pulse uppercase tracking-widest text-xs">{t('cat_loading_db')}</div>
                ) : (
                    categories.map((cat) => (
                        <div key={cat.id} className="bg-surface p-8 rounded-[2rem] shadow-premium border border-surface-50 group hover:border-primary/20 transition-all relative">
                            <div className="flex justify-between items-start mb-6">
                                <div className="text-4xl bg-surface-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform">{cat.icon || "🏷️"}</div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(cat)} className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-400 hover:text-primary transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                    </button>
                                    <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-lg bg-surface-50 flex items-center justify-center text-surface-400 hover:text-red-500 transition-colors">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-black text-surface-900 capitalize tracking-tight">
                                {lang === 'ru' && cat.name_ru ? cat.name_ru : lang === 'en' && cat.name_en ? cat.name_en : cat.name}
                            </h3>
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-[0.2em] mt-1">ID: {cat.slug}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-surface w-full max-w-md p-10 rounded-[2.5rem] shadow-2xl border border-surface-100 animate-in zoom-in-95 duration-200">
                        <h2 className="text-2xl font-black text-surface-900 uppercase tracking-tight mb-8">
                            {editing ? t('cat_modify_taxonomy') : t('cat_create_taxonomy')}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Kategoriya nomi (O'zbekcha)</label>
                                <input 
                                    type="text" 
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Masalan: Video kartalar"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Категория (Русский)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_ru || ""}
                                    onChange={e => setFormData({...formData, name_ru: e.target.value})}
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="Например: Видеокарты"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Category (English)</label>
                                <input 
                                    type="text" 
                                    value={formData.name_en || ""}
                                    onChange={e => setFormData({...formData, name_en: e.target.value})}
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="e.g. Graphics Cards"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">{t('cat_slug_label')}</label>
                                <input 
                                    type="text" 
                                    value={formData.slug}
                                    onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, "-")})}
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-sm font-mono focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="e.g. graphics-cards"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">{t('cat_icon_label')}</label>
                                <input 
                                    type="text" 
                                    value={formData.icon}
                                    onChange={e => setFormData({...formData, icon: e.target.value})}
                                    className="w-full bg-surface-50 border-none rounded-2xl px-6 py-4 text-2xl text-center focus:ring-2 focus:ring-primary transition-all"
                                    placeholder="🏷️"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="submit"
                                    className="flex-1 bg-primary text-white font-black py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs"
                                >
                                    {editing ? t('cat_update') : t('cat_initialize')}
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-surface-50 text-surface-900 font-black px-8 py-5 rounded-2xl hover:bg-surface-100 transition-all uppercase tracking-widest text-xs"
                                >
                                    {t('cat_cancel')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
