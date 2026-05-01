"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { userService } from "@/lib/services/user.service";

export default function ProfilePage() {
    const { user } = useUser();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dob: "",
        newPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Sync user data to form
    useEffect(() => {
        if (user) {
            const [first = "", last = ""] = (user.displayName || user.fullName || "").split(" ");
            setFormData(prev => ({
                ...prev,
                firstName: first,
                lastName: last,
                phone: user.phone || user.phoneNumber || "",
                email: user.email || "",
                dob: user.dob || ""
            }));
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            await userService.updateProfile(user.uid, { 
                fullName, 
                displayName: fullName,
                phone: formData.phone,
                dob: formData.dob,
                updatedAt: new Date().toISOString()
            });
            alert("Security clearance updated. Profile synchronized.");
        } catch (err) {
            alert("Error: Protocol update failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-10 animate-fade-in">
            {/* HEADER */}
            <div className="space-y-2 border-l-4 border-primary pl-6">
                <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">Profile Settings</h1>
                <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">Identity & Security Management Protocol</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT: FORM DATA */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-10 border border-surface-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                        
                        <div className="space-y-8 relative z-10">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">Personal Data</h2>
                            
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter First Name"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter Last Name"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Phone Number</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
                                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                            <span className="text-xs font-bold text-surface-400">+</span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input
                                        readOnly
                                        type="email"
                                        value={formData.email}
                                        className="w-full bg-surface-100 dark:bg-black/20 border border-surface-200 dark:border-white/5 rounded-xl px-6 py-4 text-sm text-surface-400 cursor-not-allowed outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({...formData, dob: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">Change Password</label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        value={formData.newPassword}
                                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                        className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                    />
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-primary text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
                                    >
                                        {loading ? "Synchronizing..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* DELETE ACCOUNT */}
                    <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-1 text-center md:text-left">
                            <h3 className="text-lg font-black text-red-500 uppercase tracking-tighter">Terminate Account</h3>
                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">Permanent disposal of all personal data and acquisition history</p>
                        </div>
                        <button 
                            className="bg-white dark:bg-black border border-red-500/30 text-red-500 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* RIGHT: AVATAR MANAGEMENT */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 rounded-[3rem] p-10 flex flex-col items-center gap-8 shadow-xl">
                        <div className="relative group">
                            <div className="w-48 h-48 rounded-[3rem] overflow-hidden bg-surface-100 dark:bg-black border-4 border-white dark:border-zinc-800 shadow-2xl relative z-10 transition-transform group-hover:scale-105 duration-500">
                                <img 
                                    src={user?.photoURL || user?.avatar || `https://api.dicebear.com/7.x/shapes/svg?seed=${user?.uid}`} 
                                    className="w-full h-full object-cover" 
                                    alt="Profile"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </div>
                            </div>
                            <div className="absolute -inset-2 bg-primary/10 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <div className="flex gap-4 w-full">
                            <button className="flex-1 bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all group">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                Upload
                            </button>
                            <button className="w-14 bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 py-4 rounded-xl flex items-center justify-center text-surface-400 hover:text-red-500 hover:border-red-500/30 transition-all">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                            </button>
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{user?.displayName}</p>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-60">Verified {user?.role || 'User'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
