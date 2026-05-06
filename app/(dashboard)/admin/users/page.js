"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS, ROLES } from "@/lib/constants";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminUsersPage() {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchUsers = async () => {
        const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
        setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handleUpdateRole = async (userId, newRole) => {
        if (!confirm(t('admin_confirm_role').replace('{role}', newRole.toUpperCase()))) return;

        setUpdating(userId);
        try {
            const userRef = doc(db, COLLECTIONS.USERS, userId);
            await updateDoc(userRef, { role: newRole });
            await fetchUsers(); // Refresh
            alert(t('admin_role_updated'));
        } catch (error) {
            console.error("Failed to update role:", error);
            alert("Role update failed.");
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-1 bg-primary rounded-full" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t('admin_administration')}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter">{t('admin_personnel_control')}</h1>
                </div>

                <div className="relative w-full md:w-96 group">
                    <div className="absolute -inset-0.5 bg-primary/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="relative bg-[#161B22] border border-white/10 rounded-2xl p-1 flex items-center">
                        <div className="pl-4 text-white/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder={t('admin_search_operatives')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-transparent border-none outline-none px-4 py-3 text-xs font-mono tracking-widest text-white placeholder:text-white/20"
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                    [1, 2, 3].map(i => <div key={i} className="animate-pulse bg-[#161B22] h-64 rounded-3xl border border-white/5" />)
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map(u => (
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
                                    <span className={`text-[9px] font-black px-4 py-2 rounded-lg uppercase tracking-widest ${u.role === ROLES.ADMIN ? "bg-red-500/10 text-red-500" :
                                            u.role === ROLES.DELIVERY ? "bg-blue-500/10 text-blue-500" :
                                                "bg-white/10 text-white/60"
                                        }`}>{u.role}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight truncate">{u.name || t('admin_system_operative')}</h3>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest line-clamp-1">{u.email}</p>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex flex-wrap gap-3">
                                <button
                                    onClick={() => handleUpdateRole(u.id, ROLES.DELIVERY)}
                                    className="text-[9px] font-black px-4 py-2 bg-blue-500/10 text-blue-500 rounded-lg uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all"
                                >
                                    {t('admin_make_delivery')}
                                </button>
                                <button
                                    onClick={() => handleUpdateRole(u.id, ROLES.ADMIN)}
                                    className="text-[9px] font-black px-4 py-2 bg-red-500/10 text-red-500 rounded-lg uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                >
                                    {t('admin_make_admin')}
                                </button>
                                <button
                                    onClick={() => handleUpdateRole(u.id, ROLES.USER)}
                                    className="text-[9px] font-black px-4 py-2 bg-white/10 text-white/40 rounded-lg uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                                >
                                    {t('admin_reset_user')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center space-y-6 opacity-30">
                        <div className="flex justify-center text-primary">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197" /></svg>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest">{t('admin_no_operatives')}</h3>
                    </div>
                )}
            </div>
        </div>
    );
}
