"use client"

import { useState, useEffect } from "react";
import { productService } from "@/lib/services/product.service";
import { uploadService } from "@/lib/services/upload.service";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { categorySpecs } from "@/lib/data/categorySpecs";

export default function EditProductPage() {
    const { id } = useParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [form, setForm] = useState({ 
        name: "", 
        basePrice: "", 
        category: "mice", 
        brand: "",
        description: "",
        discount: 0,
        etaDays: 0,
        specs: {}
    });

    const [variants, setVariants] = useState([]);
    
    // Variant form state
    const [showVariantForm, setShowVariantForm] = useState(false);
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [variantForm, setVariantForm] = useState({
        colorName: "Standard",
        colorHex: "#000000",
        price: 0,
        stock: 10,
        etaDays: 0,
        sku: "",
        images: []
    });
    
    const [imageUploadProgress, setImageUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    
    const [enableVariants, setEnableVariants] = useState(false);
    const [standardStock, setStandardStock] = useState(0);
    const [standardImages, setStandardImages] = useState([]);
    const [isStandardUploading, setIsStandardUploading] = useState(false);
    const [standardUploadProgress, setStandardUploadProgress] = useState(0);

    const [customSpecName, setCustomSpecName] = useState("");
    const [customSpecValue, setCustomSpecValue] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await productService.getById(id);
                if (product) {
                    if (!product.specs) product.specs = {};
                    
                    if (!categorySpecs[product.category]) {
                        const legacyMap = {
                            "Processors": "Processors",
                            "Motherboards": "Motherboards",
                            "Memory": "Memory",
                            "Graphics": "Graphics",
                            "Storage": "Storage",
                            "PSUs": "PSUs",
                            "Cases": "Cases",
                            "Cooling": "Cooling",
                            "laptops": "laptops",
                            "accessories": "mice"
                        };
                        product.category = legacyMap[product.category] || "mice";
                    }

                    // Backward compatibility: If product has old fields but no variants array
                    if (!product.variants || product.variants.length === 0) {
                        setVariants([]);
                        setEnableVariants(false);
                        setStandardStock(product.countInStock ?? product.stock ?? 0);
                        setStandardImages(product.images || (product.image ? [product.image] : []));
                    } else {
                        setVariants(product.variants);
                        setEnableVariants(true);
                    }

                    setForm({
                        name: product.name || "",
                        basePrice: product.basePrice || product.price || 0,
                        category: product.category,
                        brand: product.brand || "",
                        description: product.description || "",
                        discount: product.discount || 0,
                        etaDays: product.etaDays || 0,
                        specs: product.specs || {}
                    });
                } else {
                    alert("Product not found");
                    router.push("/admin/products");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (enableVariants && variants.length === 0) {
            alert("Iltimos, kamida bitta variant qo'shing yoki variantlarni o'chiring!");
            return;
        }

        if (!enableVariants && standardImages.length === 0) {
            alert("Iltimos, mahsulot uchun kamida bitta rasm yuklang.");
            return;
        }

        setSaving(true);
        try {
            const productData = {
                ...form,
                price: Number(form.basePrice) || 0,
                updatedAt: new Date().toISOString()
            };

            if (enableVariants) {
                productData.variants = variants.map(v => ({
                    ...v,
                    etaDate: v.stock <= 0 && v.etaDays > 0 ? new Date(Date.now() + v.etaDays * 24 * 60 * 60 * 1000).toISOString() : null
                }));
                productData.countInStock = variants.reduce((acc, v) => acc + v.stock, 0); // Aggregate stock
                productData.etaDate = null;
                productData.image = variants[0]?.images[0] || null; // fallback main image
                productData.images = variants[0]?.images || [];
            } else {
                productData.variants = []; // Clear variants if turning off
                productData.countInStock = standardStock;
                productData.etaDate = standardStock <= 0 && form.etaDays > 0 ? new Date(Date.now() + form.etaDays * 24 * 60 * 60 * 1000).toISOString() : null;
                productData.image = standardImages[0] || null;
                productData.images = standardImages;
            }

            await productService.update(id, productData);
            router.push("/admin/products");
        } catch (error) {
            console.error("Failed to update product:", error);
            alert("Error updating product");
        } finally {
            setSaving(false);
        }
    };

    const handleSpecChange = (name, value) => {
        setForm(prev => ({
            ...prev,
            specs: { ...prev.specs, [name]: value }
        }));
    };

    const addCustomSpec = () => {
        if (customSpecName.trim() === "") return;
        handleSpecChange(customSpecName.trim(), customSpecValue);
        setCustomSpecName("");
        setCustomSpecValue("");
    };

    const removeSpec = (name) => {
        const newSpecs = { ...form.specs };
        delete newSpecs[name];
        setForm(prev => ({ ...prev, specs: newSpecs }));
    };

    // Image Upload Handler
    const handleImageUpload = async (e) => {
        const target = e.target;
        const files = Array.from(target.files);
        if (files.length === 0) return;
        
        setIsUploading(true);
        try {
            const urls = await Promise.all(files.map(file => 
                uploadService.uploadImage(file, 'products', (progress) => {
                    setImageUploadProgress(progress);
                })
            ));
            setVariantForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Rasm yuklashda xatolik yuz berdi: " + error.message);
        } finally {
            setIsUploading(false);
            setImageUploadProgress(0);
            target.value = null;
        }
    };

    const removeImage = (index) => {
        setVariantForm(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleStandardImageUpload = async (e) => {
        const target = e.target;
        const files = Array.from(target.files);
        if (files.length === 0) return;
        
        setIsStandardUploading(true);
        setStandardUploadProgress(0);
        try {
            const urls = await Promise.all(files.map(file => 
                uploadService.uploadImage(file, 'products', (progress) => {
                    setStandardUploadProgress(progress);
                })
            ));
            setStandardImages(prev => [...prev, ...urls]);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Rasm yuklashda xatolik yuz berdi: " + (error?.message || error));
        } finally {
            setIsStandardUploading(false);
            setStandardUploadProgress(0);
            target.value = null; // reset input
        }
    };

    const removeStandardImage = (index) => {
        setStandardImages(prev => prev.filter((_, i) => i !== index));
    };

    const openNewVariant = () => {
        setVariantForm({
            colorName: "Standard",
            colorHex: "#000000",
            price: form.basePrice || 0,
            stock: 10,
            etaDays: 0,
            sku: "",
            images: []
        });
        setEditingVariantId(null);
        setShowVariantForm(true);
    };

    const openEditVariant = (variant) => {
        setVariantForm({ ...variant });
        setEditingVariantId(variant.id);
        setShowVariantForm(true);
    };

    const saveVariant = () => {
        if (variantForm.images.length === 0) {
            alert("Kamida bitta rasm yuklashingiz kerak!");
            return;
        }

        if (editingVariantId) {
            setVariants(variants.map(v => v.id === editingVariantId ? { ...variantForm } : v));
        } else {
            setVariants([...variants, { ...variantForm, id: Date.now().toString() }]);
        }
        setShowVariantForm(false);
    };

    const removeVariant = (id) => {
        setVariants(variants.filter(v => v.id !== id));
    };

    const currentCategoryParams = categorySpecs[form.category]?.parameters || [];
    const templateSpecNames = currentCategoryParams.map(p => p.name);
    const customSpecsList = Object.entries(form.specs || {}).filter(([key]) => !templateSpecNames.includes(key));

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );

    return (
        <div className="max-w-6xl space-y-12 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter uppercase">Modify_Hardware</h1>
                    <p className="text-surface-500 font-bold italic">Update technical specifications and variants for this unit.</p>
                </div>
                <Link href="/admin/products" className="text-[10px] font-black text-surface-400 uppercase tracking-widest hover:text-primary transition-colors">
                    ← Back to Inventory
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT COLUMN: Main Info & Specs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Info */}
                    <div className="bg-surface p-10 md:p-14 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Product Designation</label>
                            <input 
                                type="text" 
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                                required 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Full Description</label>
                            <textarea 
                                rows="5"
                                value={form.description}
                                onChange={e => setForm({ ...form, description: e.target.value })} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-primary transition-all resize-none" 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Hardware Brand</label>
                            <input 
                                type="text" 
                                list="brand-options"
                                placeholder="e.g. ASUS"
                                value={form.brand}
                                onChange={e => setForm({ ...form, brand: e.target.value })} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                            />
                            <datalist id="brand-options">
                                <option value="ASUS" />
                                <option value="Razer" />
                                <option value="Logitech" />
                                <option value="Corsair" />
                                <option value="HyperX" />
                                <option value="SteelSeries" />
                                <option value="MSI" />
                                <option value="Gigabyte" />
                                <option value="Samsung" />
                                <option value="LG" />
                                <option value="Apple" />
                                <option value="Dell" />
                                <option value="HP" />
                                <option value="Lenovo" />
                                <option value="Sony" />
                            </datalist>
                        </div>
                    </div>

                    {/* Dynamic Specifications */}
                    <div className="bg-surface p-10 md:p-14 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-8">
                        <div className="flex items-center justify-between border-b border-surface-100 pb-4">
                            <div>
                                <h2 className="text-xl font-black text-surface-900 tracking-tighter uppercase">Texnik parametrlar</h2>
                                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mt-1">Soddalashtirilgan parametrlar ro'yxati</p>
                            </div>
                        </div>

                        {currentCategoryParams.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentCategoryParams.map(param => (
                                    <div key={param.name} className="space-y-2">
                                        <div className="flex justify-between items-end pl-1">
                                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest" title={param.tooltip}>
                                                {param.name}
                                                {param.tooltip && <span className="text-primary ml-1 cursor-help">*</span>}
                                            </label>
                                            {param.unit && (
                                                <span className="text-[9px] font-black text-surface-300 uppercase tracking-widest">
                                                    [{param.unit}]
                                                </span>
                                            )}
                                        </div>

                                        {param.type === 'select' ? (
                                            <select 
                                                value={form.specs?.[param.name] || ""}
                                                onChange={e => handleSpecChange(param.name, e.target.value)}
                                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                                            >
                                                <option value="" disabled>Tanlang...</option>
                                                {param.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : param.type === 'multiselect' ? (
                                            <select 
                                                multiple
                                                value={form.specs?.[param.name] ? form.specs[param.name].split(', ') : []}
                                                onChange={e => {
                                                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                                                    handleSpecChange(param.name, selected.join(', '));
                                                }}
                                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all h-24"
                                            >
                                                {param.options?.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : param.type === 'boolean' ? (
                                            <div className="flex items-center gap-3 bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 h-[44px]">
                                                <input 
                                                    type="checkbox"
                                                    checked={form.specs?.[param.name] === 'Yes'}
                                                    onChange={e => handleSpecChange(param.name, e.target.checked ? 'Yes' : 'No')}
                                                    className="w-5 h-5 text-primary bg-white border border-surface-300 rounded focus:ring-primary transition-all"
                                                />
                                                <span className="text-sm font-bold text-surface-600">{form.specs?.[param.name] === 'Yes' ? 'Yes (Mavjud)' : 'No (Mavjud emas)'}</span>
                                            </div>
                                        ) : (
                                            <input 
                                                type={param.type === 'number' ? 'number' : 'text'}
                                                placeholder={`Enter ${param.name.toLowerCase()}`}
                                                value={form.specs?.[param.name] || ""}
                                                onChange={e => handleSpecChange(param.name, e.target.value)}
                                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-surface-50 rounded-2xl p-6 text-center text-surface-400 text-sm font-bold border border-surface-100 border-dashed">
                                Please select a category to view technical parameters.
                            </div>
                        )}

                        {/* Custom Specs Listing */}
                        {customSpecsList.length > 0 && (
                            <div className="pt-6 border-t border-surface-100 space-y-4">
                                <h3 className="text-xs font-black text-surface-900 uppercase tracking-widest">Qo'shimcha parametrlar</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {customSpecsList.map(([key, val]) => (
                                        <div key={key} className="flex items-center justify-between bg-surface-50 border border-surface-200 p-3 rounded-xl">
                                            <div className="truncate pr-4">
                                                <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest block">{key}</span>
                                                <span className="text-sm font-bold text-surface-900">{val}</span>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeSpec(key)}
                                                className="w-8 h-8 flex-shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Spec Form */}
                        <div className="pt-6 border-t border-surface-100 space-y-4">
                            <h3 className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Yangi parametr qo'shish</h3>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Parametr nomi (Masalan: Esports Mouse)"
                                    value={customSpecName}
                                    onChange={e => setCustomSpecName(e.target.value)}
                                    className="flex-1 bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                />
                                <input 
                                    type="text" 
                                    placeholder="Qiymat (Masalan: Yes)"
                                    value={customSpecValue}
                                    onChange={e => setCustomSpecValue(e.target.value)}
                                    className="flex-1 bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary transition-all"
                                />
                                <button 
                                    type="button"
                                    onClick={addCustomSpec}
                                    className="bg-primary/10 text-primary hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                                >
                                    + Qo'shish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Taxonomy, Pricing & Variants */}
                <div className="space-y-8">
                    <div className="bg-surface p-8 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-6">
                        <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Taxonomy & Base Pricing</p>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Category</label>
                            <select 
                                value={form.category}
                                onChange={e => {
                                    const confirmClear = window.confirm("Kategoriyani o'zgartiryapsiz. Eski texnik xususiyatlar (specs) tozalansinmi?");
                                    setForm({ 
                                        ...form, 
                                        category: e.target.value,
                                        ...(confirmClear ? { specs: {} } : {})
                                    });
                                }} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-black uppercase tracking-widest focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                            >
                                {Object.values(categorySpecs).map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Base Unit Price ($)</label>
                            <input 
                                type="number" 
                                value={form.basePrice}
                                onChange={e => setForm({ ...form, basePrice: Number(e.target.value) })} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-black text-primary focus:ring-2 focus:ring-primary transition-all" 
                                required={!enableVariants} 
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Discount (%)</label>
                            <input 
                                type="number" 
                                value={form.discount}
                                onChange={e => setForm({ ...form, discount: Number(e.target.value) })} 
                                className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary transition-all" 
                            />
                        </div>
                    </div>

                    {/* Product Variants System */}
                    <div className="bg-surface p-8 rounded-[2.5rem] shadow-premium border border-surface-50 space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Rang qo'shish</p>
                                <p className="text-[9px] text-surface-500 font-bold">Agar mahsulotning turli ranglari bo'lsa, buni yoqing (RAM, CPU, GPU da yoqish shart emas).</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={enableVariants} onChange={e => setEnableVariants(e.target.checked)} />
                                <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        {enableVariants ? (
                            <>
                                <div className="space-y-3">
                                    {variants.map((v) => (
                                        <div key={v.id} className="bg-surface-50 border border-surface-200 rounded-2xl p-4 flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-full border border-surface-300 flex-shrink-0" style={{ backgroundColor: v.colorHex }} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-surface-900 truncate">{v.colorName}</p>
                                                <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">${v.price} | Stock: {v.stock}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button type="button" onClick={() => openEditVariant(v)} className="text-[10px] font-black text-blue-500 uppercase hover:underline">Edit</button>
                                                <button type="button" onClick={() => removeVariant(v.id)} className="text-[10px] font-black text-red-500 uppercase hover:underline">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                        {showVariantForm ? (
                            <div className="bg-surface-100/50 dark:bg-black/40 border border-primary/20 rounded-2xl p-4 space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-widest text-primary mb-2">
                                    {editingVariantId ? "Edit Variant" : "New Variant"}
                                </h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Rang nomi</label>
                                        <input type="text" value={variantForm.colorName} onChange={e => setVariantForm({...variantForm, colorName: e.target.value})} className="w-full bg-white/5 dark:bg-black/60 border border-surface-200 dark:border-surface-700 text-foreground rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" placeholder="Masalan: Qora, Oq" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Color HEX</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden flex-shrink-0">
                                                <input type="color" value={variantForm.colorHex} onChange={e => setVariantForm({...variantForm, colorHex: e.target.value})} className="w-12 h-12 -m-2 cursor-pointer" />
                                            </div>
                                            <input type="text" value={variantForm.colorHex} onChange={e => setVariantForm({...variantForm, colorHex: e.target.value})} className="flex-1 bg-white/5 dark:bg-black/60 border border-surface-200 dark:border-surface-700 text-foreground rounded-lg px-3 py-2 text-xs font-bold uppercase focus:ring-1 focus:ring-primary outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Variant Price ($)</label>
                                        <input type="number" value={variantForm.price} onChange={e => setVariantForm({...variantForm, price: Number(e.target.value)})} className="w-full bg-white/5 dark:bg-black/60 border border-surface-200 dark:border-surface-700 text-foreground rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Stock</label>
                                        <input type="number" value={variantForm.stock} onChange={e => setVariantForm({...variantForm, stock: Number(e.target.value)})} className="w-full bg-white/5 dark:bg-black/60 border border-surface-200 dark:border-surface-700 text-foreground rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-primary outline-none" />
                                    </div>
                                    {variantForm.stock <= 0 && (
                                        <div className="space-y-1">
                                            <label className="text-[9px] font-black text-orange-400 uppercase tracking-widest">Necha kunda keladi (kun)</label>
                                            <input type="number" value={variantForm.etaDays || 0} onChange={e => setVariantForm({...variantForm, etaDays: Number(e.target.value)})} className="w-full bg-orange-500/10 border border-orange-500/50 text-orange-400 rounded-lg px-3 py-2 text-xs font-bold focus:ring-1 focus:ring-orange-500 outline-none" placeholder="Masalan: 5" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2 pt-2 border-t border-surface-200">
                                    <label className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Images Gallery ({variantForm.images.length})</label>
                                    
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {variantForm.images.map((img, idx) => (
                                            <div key={idx} className="relative w-16 h-16 rounded-lg border border-surface-200 overflow-hidden group">
                                                <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => removeImage(idx)} className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="relative">
                                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={isUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
                                        <div className="w-full bg-white/5 dark:bg-black/60 border border-surface-200 dark:border-surface-700 border-dashed rounded-lg px-4 py-6 flex flex-col items-center justify-center text-center hover:bg-white/10 transition-colors">
                                            {isUploading ? (
                                                <div className="space-y-2">
                                                    <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                                                    <p className="text-[10px] font-bold text-primary uppercase">Uploading... {Math.round(imageUploadProgress)}%</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-xl mb-1">📸</span>
                                                    <p className="text-[10px] font-bold text-surface-400 uppercase">Click to upload image</p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button type="button" onClick={() => setShowVariantForm(false)} className="flex-1 bg-surface-200 text-surface-600 font-bold py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-surface-300">Cancel</button>
                                    <button type="button" onClick={saveVariant} className="flex-1 bg-primary text-white font-bold py-2 rounded-lg text-xs uppercase tracking-widest hover:bg-primary/90">Save Variant</button>
                                </div>
                            </div>
                        ) : (
                            <button 
                                type="button"
                                onClick={openNewVariant}
                                className="w-full bg-surface-50 border border-primary/20 text-primary border-dashed rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-primary/5 transition-all text-xs font-black uppercase tracking-widest"
                            >
                                <span>+</span> Add Variant
                            </button>
                        )}
                        </>
                        ) : (
                            <div className="space-y-6 pt-4 border-t border-surface-100 dark:border-surface-800">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest pl-1">Total Stock</label>
                                    <input 
                                        type="number" 
                                        value={standardStock}
                                        onChange={e => setStandardStock(Number(e.target.value))} 
                                        className="w-full bg-surface-50 border border-surface-200 dark:border-surface-700 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-primary transition-all" 
                                    />
                                </div>
                                {standardStock <= 0 && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-orange-400 uppercase tracking-widest pl-1">Necha kunda keladi (kun)</label>
                                        <input 
                                            type="number" 
                                            value={form.etaDays || 0}
                                            onChange={e => setForm({ ...form, etaDays: Number(e.target.value) })} 
                                            className="w-full bg-orange-500/10 border border-orange-500/30 text-orange-400 rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-orange-500 transition-all" 
                                            placeholder="Masalan: 5"
                                        />
                                    </div>
                                )}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Product Images</label>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        {standardImages.map((img, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg border border-surface-200 overflow-hidden group">
                                                <img src={img} alt="Product" className="w-full h-full object-cover p-2" />
                                                <button type="button" onClick={() => removeStandardImage(i)} className="absolute top-1 right-1 bg-red-500/80 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                        
                                        <div className="relative aspect-square">
                                            <input type="file" accept="image/*" multiple onChange={handleStandardImageUpload} disabled={isStandardUploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10" />
                                            <div className="absolute inset-0 w-full h-full bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 border-dashed rounded-lg flex flex-col items-center justify-center text-center hover:bg-surface-100 transition-colors pointer-events-none">
                                                {isStandardUploading ? (
                                                    <div className="space-y-2">
                                                        <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                                                        <p className="text-[10px] font-bold text-primary uppercase">Uploading... {Math.round(standardUploadProgress)}%</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">+ ADD</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button 
                        type="submit" 
                        disabled={saving || showVariantForm}
                        className="w-full bg-surface-900 text-white font-black py-6 rounded-[2rem] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 uppercase tracking-[0.2em] text-xs"
                    >
                        {saving ? "Updating..." : "Commit Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}
