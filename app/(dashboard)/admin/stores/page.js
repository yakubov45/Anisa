"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { 
    getStoresAction, 
    addStoreAction, 
    deleteStoreAction,
    updateStoreAction 
} from "@/lib/actions/store.actions";
import useUIStore from "@/store/useUIStore";

export default function AdminStoresPage() {
    const { t } = useTranslation();
    const { addToast, showConfirm } = useUIStore();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    
    const [formData, setFormData] = useState({
        city: "",
        name: "",
        address: "",
        phone: "",
        hours: "",
        image: "",
        yandexMapUrl: ""
    });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        setLoading(true);
        const res = await getStoresAction();
        if (res.success) {
            setStores(res.stores);
        } else {
            addToast(res.error, "error");
        }
        setLoading(false);
    };

    const handleEdit = (store) => {
        setFormData({
            city: store.city,
            name: store.name,
            address: store.address,
            phone: store.phone,
            hours: store.hours,
            image: store.image,
            yandexMapUrl: store.yandexMapUrl || ""
        });
        setEditingId(store.id);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({
            city: "",
            name: "",
            address: "",
            phone: "",
            hours: "",
            image: "",
            yandexMapUrl: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        let coordinates = null;
        if (formData.yandexMapUrl.includes("ll=")) {
            const llMatch = formData.yandexMapUrl.match(/ll=([\d.]+)%2C([\d.]+)/);
            if (llMatch) {
                coordinates = {
                    lon: llMatch[1],
                    lat: llMatch[2]
                };
            }
        }

        const dataToSave = {
            ...formData,
            coordinates
        };

        const res = editingId 
            ? await updateStoreAction(editingId, dataToSave)
            : await addStoreAction(dataToSave);

        if (res.success) {
            addToast(editingId ? "Store updated successfully" : "Store added successfully");
            handleCancel();
            fetchStores();
        } else {
            addToast(res.error, "error");
        }
    };

    const handleDelete = (id) => {
        showConfirm(
            "Do you want to delete this store hub?",
            async () => {
                const res = await deleteStoreAction(id);
                if (res.success) {
                    addToast("Store hub successfully decommissioned");
                    fetchStores();
                } else {
                    addToast(res.error, "error");
                }
            },
            "Decommission Hub"
        );
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-8 rounded-[2.5rem] border border-surface-100">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Operational Hubs</h1>
                    <p className="text-surface-400 text-xs font-bold uppercase tracking-widest">Manage physical store locations</p>
                </div>
                <button 
                    onClick={() => isAdding ? handleCancel() : setIsAdding(true)}
                    className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-primary/20 transition-all"
                >
                    {isAdding ? "Cancel" : "+ Add New Store"}
                </button>
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="bg-surface p-8 md:p-12 rounded-[2.5rem] border border-surface-100 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in shadow-2xl shadow-primary/5">
                    <div className="md:col-span-2 pb-4 border-b border-surface-50 mb-4">
                        <h2 className="text-xl font-black uppercase tracking-tighter">
                            {editingId ? "Edit Operational Hub" : "Deploy New Hub"}
                        </h2>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">City</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. Tashkent"
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Store Name</label>
                        <input 
                            required
                            type="text" 
                            placeholder="e.g. OnePC Flagship"
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Full Address</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Full physical address"
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Phone Number</label>
                        <input 
                            required
                            type="text" 
                            placeholder="+998 90 ..."
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Operating Hours</label>
                        <input 
                            required
                            type="text" 
                            placeholder="Mon - Sun: 10:00 - 22:00"
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.hours}
                            onChange={(e) => setFormData({...formData, hours: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Image URL</label>
                        <input 
                            required
                            type="url" 
                            placeholder="https://..."
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.image}
                            onChange={(e) => setFormData({...formData, image: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest px-2">Yandex Maps URL</label>
                        <input 
                            required
                            type="url" 
                            placeholder="https://yandex.uz/maps/..."
                            className="w-full bg-surface-50 border border-surface-100 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-1 focus:ring-primary outline-none transition-all"
                            value={formData.yandexMapUrl}
                            onChange={(e) => setFormData({...formData, yandexMapUrl: e.target.value})}
                        />
                    </div>
                    <div className="md:col-span-2 pt-4 flex gap-4">
                        <button type="submit" className="flex-1 bg-primary text-white py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all">
                            {editingId ? "Update Hub" : "Register Hub"}
                        </button>
                        {editingId && (
                            <button 
                                type="button" 
                                onClick={handleCancel}
                                className="px-10 bg-surface-100 text-surface-900 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-surface-200 transition-all"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center animate-pulse">
                        <p className="text-surface-400 font-black uppercase text-[10px] tracking-[0.3em]">Accessing database...</p>
                    </div>
                ) : stores.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-surface rounded-[2.5rem] border border-dashed border-surface-200">
                        <p className="text-surface-400 font-bold">No stores found. Deploy your first hub.</p>
                    </div>
                ) : (
                    stores.map((store) => (
                        <div key={store.id} className="bg-surface rounded-3xl overflow-hidden border border-surface-100 group relative">
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button 
                                    onClick={() => handleEdit(store)}
                                    className="bg-white/20 hover:bg-primary text-white p-2 rounded-xl transition-all backdrop-blur-md border border-white/20 shadow-xl"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button 
                                    onClick={() => handleDelete(store.id)}
                                    className="bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white p-2 rounded-xl transition-all backdrop-blur-md border border-red-500/20 shadow-xl"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                            <div className="relative h-48">
                                <img src={store.image} alt={store.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-4 left-6">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{store.city}</p>
                                    <h3 className="text-white font-black text-lg uppercase leading-none mt-1">{store.name}</h3>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <div className="flex gap-3 text-[10px] font-bold text-surface-500">
                                        <span className="opacity-40">📍</span>
                                        <p className="flex-1">{store.address}</p>
                                    </div>
                                    <div className="flex gap-3 text-[10px] font-bold text-surface-500">
                                        <span className="opacity-40">🕒</span>
                                        <p className="flex-1">{store.hours}</p>
                                    </div>
                                </div>
                                <a 
                                    href={store.yandexMapUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block w-full text-center py-3 bg-surface-50 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-surface-100 transition-all"
                                >
                                    View on Map
                                </a>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
