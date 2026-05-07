"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { auth } from "@/lib/firebase/client"

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newBrand, setNewBrand] = useState({ name: "", logo: "" });

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        const res = await fetch("/api/brands");
        const data = await res.json();
        setBrands(data);
        setLoading(false);
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch("/api/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const data = await res.json();
            if (data.url) {
                setNewBrand({ ...newBrand, logo: data.url });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newBrand.name || !newBrand.logo) return;

        const token = await auth.currentUser?.getIdToken();
        const res = await fetch("/api/brands", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(newBrand)
        });

        if (res.ok) {
            setNewBrand({ name: "", logo: "" });
            fetchBrands();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure?")) return;
        const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
        if (res.ok) fetchBrands();
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Brand_Matrix</span>
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Brand Management</h1>
                <p className="text-white/40 text-xs font-bold uppercase tracking-widest max-w-xl">
                    Deploy brand identities to the global matrix. Maximum capacity: 14 active brands.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Add Brand Form */}
                <div className="bg-[#0A0A0B] border border-white/5 p-10 rounded-[3rem] space-y-10">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">New Deployment</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Brand Name</label>
                            <input 
                                type="text"
                                value={newBrand.name}
                                onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                                placeholder="Enter Brand Name"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all uppercase text-xs tracking-widest"
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-white/40 uppercase tracking-widest">Identity Logo</label>
                            <div className="relative group">
                                <input 
                                    type="file"
                                    onChange={handleUpload}
                                    className="hidden"
                                    id="logo-upload"
                                    accept="image/*"
                                />
                                <label 
                                    htmlFor="logo-upload"
                                    className="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-white/10 rounded-[2rem] p-12 hover:border-primary/40 transition-all cursor-pointer bg-white/[0.02]"
                                >
                                    {newBrand.logo ? (
                                        <div className="relative w-24 h-24">
                                            <img src={newBrand.logo} alt="Preview" className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
                                                {uploading ? (
                                                    <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full" />
                                                ) : (
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                                )}
                                            </div>
                                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Click to Upload Identity</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={brands.length >= 14}
                            className="w-full bg-primary text-white font-black py-5 rounded-2xl uppercase text-[10px] tracking-widest hover:bg-white hover:text-black transition-all shadow-xl shadow-primary/20 disabled:opacity-30 disabled:hover:bg-primary"
                        >
                            {brands.length >= 14 ? "LIMIT REACHED" : "DEPLOY BRAND"}
                        </button>
                    </form>
                </div>

                {/* Brands Grid */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight">Active Matrix</h3>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{brands.length} / 14 DEPLOYED</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {brands.map((brand) => (
                                <motion.div 
                                    key={brand._id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="group relative bg-[#0A0A0B] border border-white/5 p-8 rounded-[2.5rem] flex flex-col items-center gap-6"
                                >
                                    <div className="relative w-20 h-20">
                                        <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest group-hover:text-white transition-colors">{brand.name}</span>
                                    
                                    <button 
                                        onClick={() => handleDelete(brand._id)}
                                        className="absolute -top-2 -right-2 w-10 h-10 bg-red-500 text-white rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-xl shadow-red-500/20"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
