"use client"

import { useState, useEffect, useCallback } from "react"
import { getFlashDealsSettingsAction, updateFlashDealsSettingsAction } from "@/lib/actions/flash-deals.actions"
import { getAdminProductsAction, getSearchProductsAction, getProductsByIdsAction } from "@/lib/actions/product.actions"
import { categoryService } from "@/lib/services/category.service"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/LanguageContext"
import useUIStore from "@/store/useUIStore"

export default function FlashDealsAdmin() {
    const { t } = useTranslation();
    const { addToast } = useUIStore();
    const [settings, setSettings] = useState({ endTime: "", productIds: [], discountPercentage: 15 })
    const [allProducts, setAllProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // Filtering States
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")
    
    const router = useRouter()

    const loadProducts = useCallback(async (currentPage, query, cat) => {
        setLoading(true);
        try {
            let p = [];
            if (query) {
                p = await getSearchProductsAction(query, 50); // limit search to 50
                if (cat !== "all") p = p.filter(prod => prod.category === cat);
                setHasMore(false);
            } else {
                const res = await getAdminProductsAction(currentPage, 10);
                p = res.products || [];
                if (p.length < 10) setHasMore(false);
                else setHasMore(true);
            }
            setAllProducts(p);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        async function initData() {
            setLoading(true);
            const [s, c] = await Promise.all([
                getFlashDealsSettingsAction(),
                categoryService.getAll()
            ]);
            if (s) {
                setSettings(s);
            }
            setCategories(c);
            await loadProducts(1, "", "all");
        }
        initData();
    }, [loadProducts]);

    // Handle search/category filter with debouncing
    useEffect(() => {
        setPage(1);
        const timer = setTimeout(() => {
            loadProducts(1, searchQuery, selectedCategory);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, loadProducts]);

    const handleSave = async () => {
        setSaving(true)
        const success = await updateFlashDealsSettingsAction(settings)
        if (success) {
            addToast(t('flash_updated_success'))
        } else {
            addToast("Failed to update flash settings", "error")
        }
        setSaving(false)
    }

    const toggleProduct = (id) => {
        setSettings(prev => ({
            ...prev,
            productIds: prev.productIds.includes(id)
                ? prev.productIds.filter(pid => pid !== id)
                : [...prev.productIds, id]
        }))
    }

    // Filter Logic
    const filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    if (loading) return (
        <div className="p-8 flex items-center justify-center h-[70vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    )

    return (
        <div className="p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-foreground dark:text-white uppercase tracking-tighter">{t('flash_management')}</h1>
                    <p className="text-surface-400 dark:text-surface-500 text-xs font-bold uppercase tracking-widest">{t('flash_configure')}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white font-black px-10 py-4 rounded-2xl hover:bg-white hover:text-black dark:hover:bg-primary-dark dark:hover:text-white transition-all uppercase tracking-widest text-xs shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                    {saving ? t('flash_syncing') : t('flash_save')}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Global Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-surface dark:bg-surface-50 border border-border-alpha dark:border-white/5 rounded-3xl p-8 space-y-8">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full" />
                            <h2 className="text-sm font-black text-foreground dark:text-white uppercase tracking-widest">{t('flash_protocol')}</h2>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Timer */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest">{t('flash_expiration')}</label>
                                <input
                                    type="datetime-local"
                                    value={settings.endTime ? new Date(settings.endTime).toISOString().slice(0, 16) : ""}
                                    onChange={(e) => setSettings({ ...settings, endTime: new Date(e.target.value).toISOString() })}
                                    className="w-full bg-surface-100 dark:bg-surface-100 border border-border-alpha dark:border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-widest outline-none focus:ring-1 focus:ring-primary/40 text-foreground dark:text-white"
                                />
                            </div>

                            {/* Discount Percentage */}
                            <div className="space-y-3">
                                <label className="block text-[10px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest">{t('flash_global_discount')}</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={settings.discountPercentage}
                                        onChange={(e) => setSettings({ ...settings, discountPercentage: parseInt(e.target.value) || 0 })}
                                        className="w-full bg-surface-100 dark:bg-surface-100 border border-border-alpha dark:border-white/10 rounded-xl px-4 py-4 text-xs font-mono tracking-widest outline-none focus:ring-1 focus:ring-primary/40 text-foreground dark:text-white"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-primary text-xs">%</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-[9px] text-zinc-500 dark:text-zinc-400 italic leading-relaxed">{t('flash_warning')}</p>
                    </div>

                    <div className="bg-surface-900 dark:bg-black text-white rounded-3xl p-8 space-y-4 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-widest opacity-40">{t('flash_status_check')}</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-xs font-black uppercase tracking-widest text-white">{t('flash_operational')}</span>
                        </div>
                        <div className="pt-4 border-t border-white/5 space-y-2">
                            <div className="flex justify-between text-[10px]">
                                <span className="opacity-40 uppercase font-bold">{t('flash_assigned_units')}</span>
                                <span className="font-black text-primary">{settings.productIds.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product Selection */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface dark:bg-surface-50 border border-border-alpha dark:border-white/5 rounded-3xl p-8 space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <span className="w-2 h-2 bg-primary rounded-full" />
                                <h2 className="text-sm font-black text-foreground dark:text-white uppercase tracking-widest">{t('flash_hardware_cluster')}</h2>
                            </div>

                            {/* Filters UI */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder={t('flash_search_placeholder')}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-surface-100 dark:bg-surface-100 border border-border-alpha dark:border-white/10 rounded-xl px-4 py-2 text-[9px] font-mono tracking-widest outline-none focus:ring-1 focus:ring-primary/40 w-full sm:w-40 text-foreground dark:text-white"
                                    />
                                </div>
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="bg-surface-100 dark:bg-surface-200 border border-border-alpha dark:border-white/10 rounded-xl px-4 py-2 text-[9px] font-mono tracking-widest outline-none focus:ring-1 focus:ring-primary/40 text-foreground dark:text-white"
                                >
                                    <option value="all">{t('flash_all_categories')}</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.slug || cat.id}>{cat.name.toUpperCase()}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
                            {allProducts.length > 0 ? (
                                allProducts.map((product) => {
                                    const isSelected = settings.productIds.includes(product.id)
                                    return (
                                        <div
                                            key={product.id}
                                            onClick={() => toggleProduct(product.id)}
                                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 group ${
                                                isSelected 
                                                    ? 'bg-primary/5 border-primary shadow-lg shadow-primary/5' 
                                                    : 'bg-surface-100/50 dark:bg-surface-100 border-border-alpha dark:border-white/10 hover:border-surface-300 dark:hover:border-surface-400'
                                            }`}
                                        >
                                            <div className="w-16 h-16 bg-surface-200 dark:bg-surface-200 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                                                <img src={product.image} alt="" className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] font-black text-foreground dark:text-white uppercase tracking-tight truncate">{product.name}</p>
                                                <p className="text-[9px] font-bold text-primary mt-1">${product.price}</p>
                                            </div>
                                            <div className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                                                isSelected ? 'bg-primary border-primary text-white' : 'border-border-alpha dark:border-white/20 text-transparent group-hover:border-surface-400'
                                            }`}>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="col-span-full py-20 text-center space-y-4 opacity-50">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] dark:text-white">{t('flash_no_units')}</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {!searchQuery && (
                            <div className="flex justify-center items-center gap-4 pt-4 border-t border-black/5 dark:border-white/5">
                                <button
                                    onClick={() => {
                                        const newPage = Math.max(1, page - 1);
                                        setPage(newPage);
                                        loadProducts(newPage, "", selectedCategory);
                                    }}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-surface-100 dark:bg-surface-200 rounded-lg text-xs font-bold disabled:opacity-50 text-foreground dark:text-white"
                                >
                                    Oldingi
                                </button>
                                <span className="text-xs font-black text-foreground dark:text-white">Sahifa {page}</span>
                                <button
                                    onClick={() => {
                                        const newPage = page + 1;
                                        setPage(newPage);
                                        loadProducts(newPage, "", selectedCategory);
                                    }}
                                    disabled={!hasMore}
                                    className="px-4 py-2 bg-surface-100 dark:bg-surface-200 rounded-lg text-xs font-bold disabled:opacity-50 text-foreground dark:text-white"
                                >
                                    Keyingi
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
