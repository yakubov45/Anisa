"use client";
import React from "react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";

import { useSearchParams } from "next/navigation";

export default function PrebuiltsClient({ initialData }) {
    const { t } = useTranslation();
    const { currency, exchangeRate } = useStore();
    const searchParams = useSearchParams();

    const purposeParam = searchParams.get('purpose');
    const budgetParam = searchParams.get('budget');

    // Filtering State
    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("newest");
    const [showFilters, setShowFilters] = React.useState(false);
    const [selectedCpu, setSelectedCpu] = React.useState("");
    const [selectedGpu, setSelectedGpu] = React.useState("");

    // Dynamic Filter Options
    const cpus = React.useMemo(() => {
        const list = initialData.map(pc => pc.specifications?.find(s => s.name?.toUpperCase() === "CPU" || s.name?.toUpperCase() === "PROTSESSOR")?.value).filter(Boolean);
        return [...new Set(list)];
    }, [initialData]);

    const gpus = React.useMemo(() => {
        const list = initialData.map(pc => pc.specifications?.find(s => s.name?.toUpperCase() === "GPU" || s.name?.toUpperCase() === "VIDEOKARTA")?.value).filter(Boolean);
        return [...new Set(list)];
    }, [initialData]);

    // Derived Filtered Data
    const filteredData = React.useMemo(() => {
        let data = [...initialData];

        // Quiz Parameters (Auto-filtering)
        if (budgetParam) {
            const targetBudget = Number(budgetParam);
            let minBudget = 0;
            let maxBudget = Infinity;

            if (targetBudget >= 36000000) { 
                // Agar 3000$ dan katta yozsa, 2500$ (30 mln) dan qimmat barcha PC lar chiqadi
                minBudget = 30000000; 
                maxBudget = Infinity;
            } else if (targetBudget === 24000000) { 
                // Aynan 2000$ tugmasi bosilganda
                minBudget = 20000000;
                maxBudget = 26000000;
            } else if (targetBudget >= 15000000) {
                // 15mln - 36mln orasidagi custom yozishlar
                minBudget = targetBudget - 4000000;
                maxBudget = targetBudget + 2000000;
            } else if (targetBudget >= 10000000) {
                // ~1000$ atrofidagi byudjetlar (masalan 12mln)
                minBudget = targetBudget - 2000000;
                maxBudget = targetBudget + 2000000;
            } else {
                // Arzonroq PC lar (~500$ atrofida)
                minBudget = Math.max(0, targetBudget - 1000000);
                maxBudget = targetBudget + 1500000;
            }

            data = data.filter(pc => pc.price >= minBudget && pc.price <= maxBudget);
        }

        // Search
        if (searchQuery) {
            data = data.filter(pc => pc.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // CPU Filter
        if (selectedCpu) {
            data = data.filter(pc => {
                const cpu = pc.specifications?.find(s => s.name?.toUpperCase() === "CPU" || s.name?.toUpperCase() === "PROTSESSOR")?.value;
                return cpu === selectedCpu;
            });
        }

        // GPU Filter
        if (selectedGpu) {
            data = data.filter(pc => {
                const gpu = pc.specifications?.find(s => s.name?.toUpperCase() === "GPU" || s.name?.toUpperCase() === "VIDEOKARTA")?.value;
                return gpu === selectedGpu;
            });
        }

        // Sorting
        if (sortBy === "price_asc") {
            data.sort((a, b) => a.price - b.price);
        } else if (sortBy === "price_desc") {
            data.sort((a, b) => b.price - a.price);
        }
        
        return data;
    }, [initialData, searchQuery, selectedCpu, selectedGpu, sortBy, budgetParam, purposeParam]);

    // PAGINATION
    const [currentPage, setCurrentPage] = React.useState(1);
    const ITEMS_PER_PAGE = 6;

    // Reset page to 1 when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCpu, selectedGpu, sortBy]);

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const paginatedData = filteredData.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="w-full px-4 md:px-8 xl:px-16 py-8 text-foreground pb-24">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4 bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent inline-block">
                    {t("nav_prebuilts") || "Tayyor Kompyuterlar"}
                </h1>
                <p className="text-sm md:text-base text-surface-500 dark:text-surface-400 font-medium max-w-3xl">
                    {t("prebuilt_desc") || "O'zingizga mos kompyuterni tanlang. Har bir qurilma mutaxassislar tomonidan sinovdan o'tgan va kafolatlangan."}
                </p>
            </div>

            {/* Filter Bar */}
            <div className="mb-6 w-full flex flex-col sm:flex-row items-center gap-4 bg-surface-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 relative z-30">
                <div className="flex-1 w-full relative">
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input 
                        type="text" 
                        placeholder={t("filter_placeholder") || "Kompyuter nomini qidiring..."}
                        className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors text-foreground"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-xl text-sm font-black uppercase tracking-widest transition-all flex-1 sm:flex-none ${showFilters ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-white dark:bg-black/40 border-black/10 dark:border-white/10 text-foreground hover:border-primary'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/></svg>
                        {t("filter_button") || "Filtr"}
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-6 py-3 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl text-sm font-black uppercase tracking-widest hover:border-primary transition-colors focus:outline-none cursor-pointer appearance-none pr-10 text-foreground"
                        >
                            <option value="newest">{t("filter_new") || "Yangi"}</option>
                            <option value="price_asc">{t("filter_cheap") || "Arzonlari"}</option>
                            <option value="price_desc">{t("filter_expensive") || "Qimmatlari"}</option>
                        </select>
                        <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
            </div>

            {/* Expandable Filter Area */}
            {showFilters && (
                <div className="mb-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-surface-50 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 animate-in slide-in-from-top-4 fade-in duration-300 relative z-20">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-surface-500 mb-2">{t("filter_cpu") || "Protsessor (CPU)"}</label>
                        <select className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors text-foreground" value={selectedCpu} onChange={e => setSelectedCpu(e.target.value)}>
                            <option value="">{t("filter_all") || "Barchasi"}</option>
                            {cpus.map((cpu, i) => <option key={i} value={cpu}>{cpu}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-surface-500 mb-2">{t("filter_gpu") || "Videokarta (GPU)"}</label>
                        <select className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors text-foreground" value={selectedGpu} onChange={e => setSelectedGpu(e.target.value)}>
                            <option value="">{t("filter_all") || "Barchasi"}</option>
                            {gpus.map((gpu, i) => <option key={i} value={gpu}>{gpu}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Catalog Grid (3 columns layout, full-bleed width) */}
            <div className="w-full relative z-10">
                {paginatedData.length === 0 ? (
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-16 text-center">
                        <p className="text-2xl font-black text-surface-400 uppercase tracking-wider">
                            {t("prebuilt_no_pcs_found") || "Kompyuterlar topilmadi 😢"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 w-full items-start">
                        {paginatedData.map((pc, idx) => (
                            <CatalogCard
                                key={pc.id}
                                pc={pc}
                                currency={currency}
                                exchangeRate={exchangeRate}
                                delay={idx * 0.05} // Smooth cascade entrance
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => {
                            setCurrentPage(p => p - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 text-foreground hover:bg-surface-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    
                    <div className="flex gap-1.5">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setCurrentPage(i + 1);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all ${currentPage === i + 1 ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' : 'bg-transparent text-surface-500 hover:bg-surface-100 dark:hover:bg-white/5 border border-black/5 dark:border-white/5'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => {
                            setCurrentPage(p => p + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl border border-black/10 dark:border-white/10 text-foreground hover:bg-surface-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            )}
        </div>
    );
}

export function CatalogCard({ pc, currency = "UZS", exchangeRate, layout = "row" }) {
    const { t } = useTranslation();
    const { addToCart, compareList, toggleCompare } = useStore();
    const inCompare = compareList?.some(item => item.id === pc.id);

    const handleAddToCart = () => {
        addToCart({
            id: pc.id,
            name: pc.name,
            price: pc.price,
            image: pc.images?.[0] || '',
            category: 'prebuilt',
            quantity: 1
        });
        toast.success(t("cart_added_msg") ? t("cart_added_msg").replace("{name}", pc.name) : `"${pc.name}" savatga qo'shildi!`);
    };

    const price = formatPrice(pc.price, currency, exchangeRate);

    // Retrieve specifications
    const specifications = pc.specifications || [];

    const getSpecValue = (nameUpper) => {
        const found = specifications.find(s => s.name.toUpperCase() === nameUpper);
        if (found) return found.value;
        if (nameUpper === "CPU") return pc.quick_specs?.cpu;
        if (nameUpper === "GPU") return pc.quick_specs?.gpu;
        if (nameUpper === "RAM") return pc.quick_specs?.ram;
        if (nameUpper === "SSD") return pc.quick_specs?.storage || pc.quick_specs?.ssd;
        return "";
    };

    const cpuVal = getSpecValue("CPU") || "N/A";
    const gpuVal = getSpecValue("GPU") || "N/A";
    const ramVal = getSpecValue("RAM") || "N/A";
    const ssdVal = getSpecValue("SSD") || "N/A";

    const getBadgeText = (badge) => {
        if (!badge) return "";
        let cleanKey = badge.toLowerCase().trim().replace(/\s+/g, '_');
        if (cleanKey.startsWith("badge_")) {
            cleanKey = cleanKey.replace("badge_", "");
        }
        if (cleanKey === 'new' || cleanKey === 'yangi') {
            return t("filter_new") || badge;
        }
        const translationKey = `badge_${cleanKey}`;
        return t(translationKey) || badge;
    };

    return (
        <div className={`bg-white dark:bg-[#0c0c0e] rounded-3xl border border-black/[0.06] dark:border-white/10 p-5 md:p-6 flex ${layout === 'row' ? 'flex-col md:flex-row' : 'flex-col'} gap-5 md:gap-6 group hover:border-primary/45 dark:hover:border-primary/45 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 w-full items-stretch`}>
            
            {/* Image Side */}
            <div className={`relative ${layout === 'row' ? 'w-full md:w-[45%] lg:w-[48%]' : 'w-full aspect-[4/3]'} bg-surface-50/50 dark:bg-black/30 rounded-2xl overflow-hidden flex items-center justify-center p-6 min-h-[220px] md:min-h-[260px] shrink-0`}>
                {pc.badges && (
                    <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 max-w-[70%]">
                        {(Array.isArray(pc.badges) ? pc.badges : [pc.badges]).map((b, i) => (
                            <span key={i} className="bg-primary text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-md border border-white/5 shrink-0">
                                {getBadgeText(b)}
                            </span>
                        ))}
                    </div>
                )}
                
                {/* Compare Button */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleCompare(pc);
                        if (!inCompare) toast.success("Taqqoslashga qo'shildi!");
                    }}
                    className={`absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${inCompare ? 'bg-blue-500 text-white shadow-blue-500/20' : 'bg-white dark:bg-zinc-800 text-foreground hover:bg-blue-500 hover:text-white'}`}
                    title="Taqqoslash"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                </button>
                
                <img
                    src={pc.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={pc.name}
                    className={`max-h-[85%] max-w-full object-contain transition-all duration-700 ease-out z-10 relative ${pc.images?.length > 1 ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'}`}
                />
                {pc.images?.length > 1 && (
                    <img
                        src={pc.images[1]}
                        alt={`${pc.name} alternate view`}
                        className="absolute max-h-[85%] max-w-full object-contain transition-all duration-700 ease-out opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 z-0"
                    />
                )}
            </div>

            {/* Right Side: PC Details (Extremely clean, modern store styling) */}
            <div className="flex-1 flex flex-col justify-between py-2 min-w-0 gap-4">
                
                {/* Header & Title */}
                <div>
                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300">
                        {pc.name}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-2xl font-black text-foreground tracking-tight">{price}</span>
                    </div>
                </div>

                {/* Specs block (Modern rounded chips) */}
                <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                        {gpuVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/gpu-removebg-preview.png" alt="GPU" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{gpuVal}</span>
                            </span>
                        )}
                        {cpuVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/cpu-removebg-preview.png" alt="CPU" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{cpuVal}</span>
                            </span>
                        )}
                        {ramVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/ram-removebg-preview.png" alt="RAM" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{ramVal}</span>
                            </span>
                        )}
                        {ssdVal !== "N/A" && (
                            <span className="max-w-full bg-surface-100 dark:bg-white/5 text-foreground pl-2 pr-4 py-2 rounded-2xl text-xs md:text-sm font-semibold tracking-tight border border-black/5 dark:border-white/10 flex items-center gap-3">
                                <div className="w-8 h-8 shrink-0 flex items-center justify-center bg-white dark:bg-white/95 rounded-full p-1.5 shadow-sm border border-black/5">
                                    <img src="/ssd-removebg-preview.png" alt="SSD" className="w-full h-full object-contain" />
                                </div>
                                <span className="truncate">{ssdVal}</span>
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Bottom Bar (Details & Buy Now matching the spec) */}
                <div className="flex items-center gap-3 mt-2">
                    <a
                        href={`/prebuilts/${pc.id}`}
                        className="flex-1 bg-transparent hover:bg-surface-100 dark:hover:bg-white/5 text-foreground text-center py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border border-surface-200 dark:border-white/10"
                    >
                        {t("prebuilt_details") || "Batafsil"}
                    </a>
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/10 hover:shadow-primary/25 text-center py-3.5 px-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border border-transparent"
                    >
                        {t("prebuilt_add_to_cart") || "Savatga"}
                    </button>
                </div>

            </div>

        </div>
    );
}
