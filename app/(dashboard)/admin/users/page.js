"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS, ROLES } from "@/lib/constants";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateRole = async (userId, newRole) => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
        
        setUpdating(userId);
        try {
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            await updateDoc(userRef, { role: newRole });
            await fetchUsers(); // Refresh
            alert("User role updated successfully.");
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Role update failed.");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Administration</span>
                </div>
                <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Personnel Control</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="animate-pulse bg-[#161B22] h-64 rounded-3xl border border-white/5" />)
                ) : (
                    users.map(u => (
                        <div key={u.id} className="bg-[#161B22] p-8 rounded-[2.5rem] border border-white/5 space-y-8 group hover:border-primary/30 transition-all relative overflow-hidden">
                            {updating === u.id && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
                                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                                </div>
                            )}
                            
                            <div className="flex justify-between items-start">
                                <div className="w-20 h-20 rounded-2xl bg-white/5 overflow-hidden border border-white/10">
                                    <img src={u.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + (u.name || u.id)} alt="" />
                                </div>
                                <div className="text-right">
                                    <span className={`text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest ${
                                        u.role === ROLES.ADMIN ? "bg-red-500/10 text-red-500" : 
                                        u.role === ROLES.DELIVERY ? "bg-blue-500/10 text-blue-500" : 
                                        "bg-white/10 text-white/60"
                                    }`}>{u.role}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight truncate">{u.name || "System Operative"}</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{u.email}</p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
                                <button 
                                    onClick={() => handleUpdateRole(u.id, ROLES.DELIVERY)}
                                    className="text-[9px] font-black px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    Make Delivery
                                </button>
                                <button 
                                    onClick={() => handleUpdateRole(u.id, ROLES.ADMIN)}
                                    className="text-[9px] font-black px-4 py-2 bg-red-500/10 text-red-500 rounded-lg uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    Make Admin
                                </button>
                                <button 
                                    onClick={() => handleUpdateRole(u.id, ROLES.USER)}
                                    className="text-[9px] font-black px-4 py-2 bg-white/10 text-white/40 rounded-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    Reset to User
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
