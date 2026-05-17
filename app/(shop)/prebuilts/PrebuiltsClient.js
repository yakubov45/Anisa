"use client";
import React from "react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import useStore from "@/store/useStore";
import { useTranslation } from "@/lib/LanguageContext";

export default function PrebuiltsClient({ initialData }) {
    const { t } = useTranslation();
    const { currency, exchangeRate } = useStore();

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
    }, [initialData, searchQuery, selectedCpu, selectedGpu, sortBy]);

    return (
        <div className="w-full px-4 md:px-8 xl:px-16 py-8 text-foreground pb-24">
            {/* Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-foreground mb-4 bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent inline-block">
                    {t("nav_prebuilts") || "Tayyor Kompyuterlar"}
                </h1>
                <p className="text-sm md:text-base text-surface-500 dark:text-surface-400 font-medium max-w-3xl">
                    O'zingizga mos kompyuterni tanlang. Har bir qurilma mutaxassislar tomonidan sinovdan o'tgan va kafolatlangan.
                </p>
            </div>

            {/* Filter Bar */}
            <div className="mb-6 w-full flex flex-col sm:flex-row items-center gap-4 bg-surface-50 dark:bg-white/5 p-4 rounded-2xl border border-black/5 dark:border-white/10 relative z-30">
                <div className="flex-1 w-full relative">
                    <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    <input 
                        type="text" 
                        placeholder={t("search_placeholder") || "Kompyuter nomini qidiring..."}
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
                        Filtr
                    </button>
                    <div className="relative flex-1 sm:flex-none">
                        <select 
                            value={sortBy} 
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-6 py-3 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl text-sm font-black uppercase tracking-widest hover:border-primary transition-colors focus:outline-none cursor-pointer appearance-none pr-10 text-foreground"
                        >
                            <option value="newest">Yangi</option>
                            <option value="price_asc">Arzonlari</option>
                            <option value="price_desc">Qimmatlari</option>
                        </select>
                        <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                </div>
            </div>

            {/* Expandable Filter Area */}
            {showFilters && (
                <div className="mb-10 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 bg-surface-50 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/10 animate-in slide-in-from-top-4 fade-in duration-300 relative z-20">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-surface-500 mb-2">Protsessor (CPU)</label>
                        <select className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors text-foreground" value={selectedCpu} onChange={e => setSelectedCpu(e.target.value)}>
                            <option value="">Barchasi</option>
                            {cpus.map((cpu, i) => <option key={i} value={cpu}>{cpu}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-surface-500 mb-2">Videokarta (GPU)</label>
                        <select className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-primary transition-colors text-foreground" value={selectedGpu} onChange={e => setSelectedGpu(e.target.value)}>
                            <option value="">Barchasi</option>
                            {gpus.map((gpu, i) => <option key={i} value={gpu}>{gpu}</option>)}
                        </select>
                    </div>
                </div>
            )}

            {/* Catalog Grid (3 columns layout, full-bleed width) */}
            <div className="w-full relative z-10">
                {filteredData.length === 0 ? (
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-black/5 dark:border-white/10 p-16 text-center">
                        <p className="text-2xl font-black text-surface-400 uppercase tracking-wider">
                            {t("prebuilt_no_pcs_found") || "Kompyuterlar topilmadi 😢"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 w-full items-start">
                        {filteredData.map(pc => (
                            <CatalogCard
                                key={pc.id}
                                pc={pc}
                                currency={currency}
                                exchangeRate={exchangeRate}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export function CatalogCard({ pc, currency = "UZS", exchangeRate }) {
    const { t } = useTranslation();

    const handleAddToCart = () => {
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
        let cleanKey = badge.toLowerCase();
        if (cleanKey.startsWith("badge_")) {
            cleanKey = cleanKey.replace("badge_", "");
        }
        const translationKey = `badge_${cleanKey}`;
        return t(translationKey) || badge;
    };

    return (
        <div className="bg-white dark:bg-[#0c0c0e] rounded-[2rem] border border-black/[0.06] dark:border-white/10 overflow-hidden group hover:border-primary/45 dark:hover:border-primary/45 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col w-full">

            {/* Image (Clean container, no dark borders, beautiful and spacious with Name inside) */}
            <div className="relative aspect-[4/3] bg-surface-50/50 dark:bg-black/30 overflow-hidden flex items-center justify-center p-8 pb-16">
                {pc.badges && (
                    <div className="absolute top-5 left-5 right-5 z-20 flex flex-wrap gap-2">
                        {(Array.isArray(pc.badges) ? pc.badges : [pc.badges]).map((b, i) => (
                            <span key={i} className="bg-primary text-white text-[9px] font-black uppercase tracking-widest px-3.5 py-2 rounded-xl shadow-lg border border-white/10 shrink-0">
                                {getBadgeText(b)}
                            </span>
                        ))}
                    </div>
                )}
                <img
                    src={pc.images?.[0] || 'https://via.placeholder.com/600x400?text=No+Image'}
                    alt={pc.name}
                    className={`max-h-[80%] max-w-full object-contain transition-all duration-700 ease-out z-10 relative ${pc.images?.length > 1 ? 'group-hover:opacity-0 group-hover:scale-95' : 'group-hover:scale-105'}`}
                />
                {pc.images?.length > 1 && (
                    <img
                        src={pc.images[1]}
                        alt={`${pc.name} alternate view`}
                        className="absolute max-h-[80%] max-w-full object-contain transition-all duration-700 ease-out opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100 z-0"
                    />
                )}

                {/* Computer Name Overlay inside the Image Container */}
                <div className="absolute bottom-5 left-0 right-0 text-center px-4">
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 drop-shadow-sm">
                        {pc.name}
                    </h3>
                </div>
            </div>

            {/* PC Price Section (Centered precisely like the design sketch) */}
            <div className="flex flex-col items-center justify-center text-center px-6 py-4.5 border-t border-black/[0.06] dark:border-white/10 bg-surface-50/20 dark:bg-black/20">
                <p className="text-sm md:text-base text-surface-500 dark:text-surface-400 font-bold">
                    {t("prebuilt_from") || "Boshlanish narxi:"} <span className="text-primary font-black ml-1.5 text-lg md:text-xl">{price}</span>
                </p>
            </div>

            {/* Specifications Grid (2x2 divided by lines, matching the reference image) */}
            <div className="grid grid-cols-2 border-t border-black/[0.06] dark:border-white/10 bg-surface-50/20 dark:bg-black/10">

                {/* CPU Spec Box */}
                <div className="p-5 flex items-center gap-4.5 border-r border-b border-black/[0.06] dark:border-white/10">
                    {/* CPU Icon */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white dark:bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src="/cpu-removebg-preview.png" alt="CPU" className="w-full h-full object-contain scale-[1.2]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm md:text-[15px] font-black text-foreground truncate leading-tight">{cpuVal}</span>
                        <span className="text-[9px] font-black uppercase text-surface-400 tracking-wider mt-0.5">CPU</span>
                    </div>
                </div>

                {/* GPU Spec Box */}
                <div className="p-5 flex items-center gap-4.5 border-b border-black/[0.06] dark:border-white/10">
                    {/* GPU Icon */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white dark:bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src="/gpu-removebg-preview.png" alt="GPU" className="w-full h-full object-contain scale-[1]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm md:text-[15px] font-black text-foreground truncate leading-tight">{gpuVal}</span>
                        <span className="text-[9px] font-black uppercase text-surface-400 tracking-wider mt-0.5">GPU</span>
                    </div>
                </div>

                {/* RAM Spec Box */}
                <div className="p-5 flex items-center gap-4.5 border-r border-black/[0.06] dark:border-white/10">
                    {/* RAM Icon */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white dark:bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src="/ram-removebg-preview.png" alt="RAM" className="w-full h-full object-contain scale-[1]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm md:text-[15px] font-black text-foreground truncate leading-tight">{ramVal}</span>
                        <span className="text-[9px] font-black uppercase text-surface-400 tracking-wider mt-0.5">RAM</span>
                    </div>
                </div>

                {/* SSD Spec Box */}
                <div className="p-5 flex items-center gap-4.5">
                    {/* SSD Icon */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-white dark:bg-white rounded-xl overflow-hidden shadow-sm">
                        <img src="/ssd-removebg-preview.png" alt="SSD" className="w-full h-full object-contain scale-[1.4]" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm md:text-[15px] font-black text-foreground truncate leading-tight">{ssdVal}</span>
                        <span className="text-[9px] font-black uppercase text-surface-400 tracking-wider mt-0.5">SSD</span>
                    </div>
                </div>

            </div>

            {/* Actions Bottom Bar (Clean separated button block to buy & check details, made much larger for readability) */}
            <div className="grid grid-cols-2">
                <a
                    href={`/prebuilts/${pc.id}`}
                    className="bg-surface-100/50 hover:bg-surface-200/50 dark:bg-white/5 dark:hover:bg-white/10 text-foreground text-center py-5 text-[13px] md:text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border-t border-r border-transparent"
                >
                    {t("prebuilt_details") || "Batafsil"}
                </a>
                <button
                    onClick={handleAddToCart}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 text-center py-5 text-[13px] md:text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center border-t border-primary relative overflow-hidden"
                >
                    <span className="relative z-10">{t("prebuilt_add_to_cart") || "Savatga"}</span>
                </button>
            </div>

        </div>
    );
}
