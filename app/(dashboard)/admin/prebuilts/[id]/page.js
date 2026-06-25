"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPreBuiltByIdAction, updatePreBuiltSystemAction } from "@/lib/actions/product.actions";
import toast from "react-hot-toast";

export default function EditPrebuiltPage({ params }) {
    const { id } = params;
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [file, setFile] = useState(null);
    const [existingImage, setExistingImage] = useState("");
    const [form, setForm] = useState({ 
        name: "", 
        price: "", 
        badges: "New",
        isFeatured: true
    });
    const [specs, setSpecs] = useState([
        { name: "CPU", value: "", isFeatured: true },
        { name: "GPU", value: "", isFeatured: true },
        { name: "RAM", value: "", isFeatured: true },
        { name: "SSD", value: "", isFeatured: true },
    ]);
    const [fpsGames, setFpsGames] = useState([
        { name: "CS2", fps: "", isTested: false },
        { name: "Valorant", fps: "", isTested: false },
        { name: "GTA V", fps: "", isTested: false },
        { name: "Cyberpunk", fps: "", isTested: false },
        { name: "PUBG", fps: "", isTested: false }
    ]);
    const router = useRouter();

    useEffect(() => {
        async function loadData() {
            const data = await getPreBuiltByIdAction(id);
            if (data) {
                setForm({
                    name: data.name || "",
                    price: data.price || "",
                    badges: data.badges?.[0] || "New",
                    isFeatured: data.isFeatured ?? true
                });
                if (data.specifications && data.specifications.length > 0) {
                    setSpecs(data.specifications);
                }
                if (data.fps_tests && data.fps_tests.length > 0) {
                    const mergedFps = fpsGames.map(game => {
                        const found = data.fps_tests.find(g => g.name === game.name);
                        if (found) {
                            return { ...game, ...found, isTested: true };
                        }
                        return game;
                    });
                    setFpsGames(mergedFps);
                }
                if (data.images && data.images.length > 0) {
                    setExistingImage(data.images[0]);
                }
            } else {
                toast.error("Topilmadi!");
            }
            setFetching(false);
        }
        loadData();
    }, [id]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const addSpecRow = () => {
        setSpecs([...specs, { name: "", value: "", isFeatured: false }]);
    };

    const removeSpecRow = (index) => {
        setSpecs(specs.filter((_, i) => i !== index));
    };

    const handleSpecChange = (index, field, val) => {
        const updated = [...specs];
        updated[index][field] = val;
        setSpecs(updated);
    };

    const handleFpsChange = (index, field, val) => {
        const updated = [...fpsGames];
        updated[index][field] = val;
        setFpsGames(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            let imageUrl = existingImage;

            if (file) {
                const authRes = await fetch('/api/imagekit/auth');
                if (!authRes.ok) throw new Error("ImageKit auth xatosi");
                const { signature, expire, token } = await authRes.json();

                const formData = new FormData();
                formData.append("file", file);
                formData.append("fileName", `${Date.now()}_${file.name}`);
                formData.append("folder", "/prebuilts");
                formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
                formData.append("signature", signature);
                formData.append("expire", expire);
                formData.append("token", token);

                const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.message || "Rasm yuklashda xato");
                }

                const uploadData = await uploadRes.json();
                imageUrl = uploadData.url;
            }

            const cpuVal = specs.find(s => s.name.toUpperCase() === "CPU")?.value || "";
            const gpuVal = specs.find(s => s.name.toUpperCase() === "GPU")?.value || "";
            const ramVal = specs.find(s => s.name.toUpperCase() === "RAM")?.value || "";
            const ssdVal = specs.find(s => ["SSD", "STORAGE", "XOTIRA"].includes(s.name.toUpperCase()))?.value || "";

            const data = {
                name: form.name,
                price: Number(form.price),
                images: imageUrl ? [imageUrl] : [],
                quick_specs: {
                    cpu: cpuVal,
                    gpu: gpuVal,
                    ram: ramVal,
                    storage: ssdVal
                },
                specifications: specs,
                fps_tests: fpsGames.filter(g => g.isTested),
                badges: [form.badges],
                isFeatured: form.isFeatured
            };

            const res = await updatePreBuiltSystemAction(id, data);
            
            if (res.success) {
                toast.success("Tayyor kompyuter muvaffaqiyatli saqlandi!");
                router.push("/admin/prebuilts");
            } else {
                toast.error("Xatolik: " + res.error);
            }

        } catch (error) {
            console.error("Failed to update prebuilt:", error);
            toast.error("Xatolik yuz berdi");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center">Yuklanmoqda...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-24 px-4 md:px-0 text-foreground">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/5 dark:border-white/5 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase bg-gradient-to-r from-primary to-rose-500 bg-clip-text text-transparent">
                        Tahrirlash: {form.name}
                    </h1>
                    <p className="text-sm text-surface-500 font-medium">
                        Tayyor kompyuterni tahrirlash
                    </p>
                </div>
                <a 
                    href="/admin/prebuilts" 
                    className="self-start md:self-auto bg-surface-100 dark:bg-white/10 hover:bg-surface-200 dark:hover:bg-white/20 text-foreground px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 border border-black/5 dark:border-white/5"
                >
                    Orqaga
                </a>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Card: Core Details & Dynamic Specs */}
                <div className="lg:col-span-2 space-y-8 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 md:p-10 rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/10">
                    <div className="space-y-6">
                        {/* PC Name */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">
                                Kompyuter nomi
                            </label>
                            <input 
                                type="text" 
                                value={form.name}
                                placeholder="Masalan: ZTT War Machine v1"
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full bg-surface-50 dark:bg-black/30 border border-black/10 dark:border-white/10 text-foreground rounded-2xl px-5 py-4 text-sm font-bold focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-surface-400" 
                                required 
                            />
                        </div>

                        {/* File Upload Dropzone */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">
                                Rasm yuklash (Ixtiyoriy)
                            </label>
                            <div className="relative group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleFileChange} 
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                                />
                                <div className="border-2 border-dashed border-black/10 dark:border-white/15 rounded-2xl p-8 text-center group-hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-3 bg-surface-50 dark:bg-black/20">
                                    <div className="space-y-1">
                                        <span className="block text-xs font-black uppercase tracking-wider text-foreground">
                                            {file ? file.name : (existingImage ? "Yangi rasm tanlash" : "Rasm tanlash uchun bosing")}
                                        </span>
                                    </div>
                                    {existingImage && !file && (
                                        <img src={existingImage} className="h-20 object-contain rounded-xl" alt="Mavjud rasm" />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Specifications */}
                        <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/10">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">
                                    Texnik Parametrlar
                                </label>
                                <button 
                                    type="button" 
                                    onClick={addSpecRow}
                                    className="bg-primary/10 dark:bg-primary/25 hover:bg-primary/20 text-primary text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all hover:scale-102 flex items-center gap-1.5"
                                >
                                    Parametr Qo'shish
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {specs.map((spec, i) => (
                                    <div 
                                        key={i} 
                                        className="grid grid-cols-12 gap-3 items-center bg-surface-50 dark:bg-black/20 p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner"
                                    >
                                        <div className="col-span-4">
                                            <input 
                                                type="text" 
                                                placeholder="Masalan: CPU" 
                                                value={spec.name}
                                                onChange={e => handleSpecChange(i, "name", e.target.value)}
                                                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all placeholder:text-surface-400 text-foreground"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="col-span-5">
                                            <input 
                                                type="text" 
                                                placeholder="Masalan: AMD Ryzen 7" 
                                                value={spec.value}
                                                onChange={e => handleSpecChange(i, "value", e.target.value)}
                                                className="w-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all placeholder:text-surface-400 text-foreground"
                                                required
                                            />
                                        </div>

                                        <div className="col-span-2 flex justify-center">
                                            <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                                <input 
                                                    type="checkbox" 
                                                    checked={spec.isFeatured}
                                                    onChange={e => handleSpecChange(i, "isFeatured", e.target.checked)}
                                                    className="w-4 h-4 accent-primary rounded cursor-pointer border-black/10 dark:border-white/10"
                                                />
                                                <span className="text-[9px] font-black text-surface-500 uppercase tracking-wider">Asosiy</span>
                                            </label>
                                        </div>

                                        <div className="col-span-1 flex justify-end">
                                            <button 
                                                type="button" 
                                                onClick={() => removeSpecRow(i)}
                                                className="text-surface-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all p-2 rounded-lg"
                                                title="O'chirish"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FPS Games Section */}
                    <div className="bg-surface border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                            <h2 className="text-lg font-black uppercase tracking-widest text-foreground">O'yin FPS Natijalari (Ixtiyoriy)</h2>
                        </div>
                        <p className="text-[11px] font-bold text-surface-400">Kompyuter ushbu o'yinlarda o'rtacha qancha FPS ko'rsatishini kiriting. O'yinni faollashtirish uchun belgilang.</p>
                        
                        <div className="space-y-4">
                            {fpsGames.map((game, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${game.isTested ? 'bg-primary/5 border-primary shadow-sm' : 'bg-surface-50 dark:bg-white/5 border-black/5 dark:border-white/5 opacity-80'}`}>
                                    <label className="flex items-center gap-3 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={game.isTested}
                                            onChange={e => handleFpsChange(i, "isTested", e.target.checked)}
                                            className="w-5 h-5 accent-primary rounded cursor-pointer"
                                        />
                                        <span className="font-black uppercase tracking-widest text-sm text-foreground w-24">{game.name}</span>
                                    </label>
                                    <input 
                                        type="number" 
                                        placeholder="FPS" 
                                        value={game.fps}
                                        onChange={e => handleFpsChange(i, "fps", e.target.value)}
                                        disabled={!game.isTested}
                                        className="flex-1 bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-xl px-4 py-2.5 text-xs font-bold focus:border-primary outline-none transition-all placeholder:text-surface-400 text-foreground disabled:opacity-50"
                                    />
                                    <span className="font-bold text-[10px] text-surface-400 uppercase">FPS</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Card: Price, Settings & Submit Button */}
                <div className="space-y-6">
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-black/5 dark:border-white/10 space-y-6">
                        <p className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest border-b border-black/5 dark:border-white/5 pb-3">
                            Narx va Sozlamalar
                        </p>
                        
                        {/* Price (UZS) */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">
                                Narxi (UZS)
                            </label>
                            <input 
                                type="number" 
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })} 
                                className="w-full bg-surface-50 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-black text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-surface-400" 
                                placeholder="0"
                                required 
                            />
                        </div>

                        {/* Badge Selection */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-surface-400 dark:text-surface-500 uppercase tracking-widest pl-1">
                                Nishon (Badge)
                            </label>
                            <select 
                                value={form.badges}
                                onChange={e => setForm({ ...form, badges: e.target.value })} 
                                className="w-full bg-surface-50 dark:bg-black/30 border border-black/10 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-black uppercase tracking-widest focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer text-foreground"
                            >
                                <option value="Bestseller" className="dark:bg-zinc-900">Bestseller</option>
                                <option value="New" className="dark:bg-zinc-900">New</option>
                                <option value="Limited" className="dark:bg-zinc-900">Limited</option>
                            </select>
                        </div>

                        {/* Show on Home (Featured) */}
                        <div className="flex items-center gap-3.5 bg-surface-50 dark:bg-black/20 p-4 rounded-2xl border border-black/5 dark:border-white/5 cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                id="isFeatured"
                                checked={form.isFeatured}
                                onChange={e => setForm({ ...form, isFeatured: e.target.checked })}
                                className="w-5 h-5 accent-primary rounded cursor-pointer shrink-0"
                            />
                            <label htmlFor="isFeatured" className="text-xs font-black text-surface-600 dark:text-surface-300 cursor-pointer uppercase tracking-wider leading-none">
                                Bosh sahifada ko'rsatish
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-primary to-rose-500 text-white font-black py-5 rounded-[2rem] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 active:scale-98 transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-2 border border-white/10"
                    >
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </form>
        </div>
    );
}
