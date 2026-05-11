"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@/lib/UserContext";
import { userService } from "@/lib/services/user.service";
import { authService } from "@/lib/services/auth.service";
import { checkEmailExistsAction, updateEmailAdminAction, updatePasswordAdminAction } from "@/lib/actions/user.actions";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/LanguageContext";

export default function ProfilePage() {
    const { t, language } = useTranslation();
    const { user, refreshUser } = useUser();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        dob: "",
        newPassword: ""
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });
    const [verificationSentEmail, setVerificationSentEmail] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('pending_email_update') || "";
        }
        return "";
    });

    // Sync user data to form
    useEffect(() => {
        if (user && !isEditing) {
            // Clear pending if user email is now updated in Firebase
            if (user.email === verificationSentEmail) {
                setVerificationSentEmail("");
                localStorage.removeItem('pending_email_update');
            }

            const nameParts = (user.fullName || user.displayName || "").split(" ");
            const first = nameParts[0] || "";
            const last = nameParts.slice(1).join(" ") || "";
            
            setFormData(prev => ({
                ...prev,
                firstName: first,
                lastName: last,
                phone: user.phone || user.phoneNumber || "",
                email: verificationSentEmail || user.email || "",
                dob: user.dob || ""
            }));
        }
    }, [user, isEditing, verificationSentEmail]);

    // Check for missing critical info
    const isMissingInfo = !user?.fullName || !user?.email;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: "" });

        try {
            const fullName = `${formData.firstName} ${formData.lastName}`.trim();
            
            // 1. Validate Email if changed
            if (isEditing && formData.email !== user.email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    throw new Error("Invalid email format. Please provide a valid protocol address.");
                }

                // Check if email is already taken in DB via Server Action (Bypasses rules)
                const result = await checkEmailExistsAction(formData.email);
                if (result.success && result.exists) {
                    throw new Error("Access Denied: This email address is already linked to another identity in our records.");
                }
                
                // Use Admin Action to bypass "requires-recent-login"
                const updateResult = await updateEmailAdminAction(user.uid, formData.email);
                if (!updateResult.success) {
                    throw new Error(updateResult.error || "Failed to update security email.");
                }

                setVerificationSentEmail(formData.email);
                localStorage.setItem('pending_email_update', formData.email);
                setStatus({ type: "success", message: "Email updated successfully in security records. Please verify to finalize." });
                
                // Still try to send verification if possible, but don't crash if it fails
                try {
                    await authService.updateEmailWithVerification(formData.email);
                } catch (vErr) {
                    console.log("Verification trigger skipped, handled via Admin.");
                }
            }

            const updateData = { 
                fullName, 
                displayName: fullName,
                phone: formData.phone,
                dob: formData.dob,
                // We don't update email in Firestore yet, it's safer to wait for Auth verification
                // but if they are adding it for the first time, we can save it
                ...(user.email ? {} : { email: formData.email })
            };

            await userService.updateProfile(user.uid, updateData);

            // 3. Handle Password Set/Update via Admin (to bypass recent login)
            if (formData.newPassword) {
                if (formData.newPassword !== formData.confirmPassword) {
                    throw new Error("Passwords do not match. Please confirm your password.");
                }
                const updateRes = await updatePasswordAdminAction(user.uid, formData.newPassword);
                if (!updateRes.success) {
                    throw new Error(updateRes.error || "Failed to link security password.");
                }

                // Still update Firestore flag
                await userService.updateProfile(user.uid, { hasPassword: true });
                
                setFormData(prev => ({ ...prev, newPassword: "", confirmPassword: "" }));
                setStatus({ type: "success", message: "Security clearance updated. New password linked via Admin." });
            }

            await refreshUser();
            setIsEditing(false);
            if (!status.message) {
                setStatus({ type: "success", message: "Security clearance updated. Profile synchronized." });
            }
        } catch (err) {
            console.error(err);
            let errorMessage = err.message || "Protocol update failed. Please check your data.";
            
            // Specific handling for sensitive auth actions
            if (err.code === "auth/requires-recent-login") {
                errorMessage = "Security protocol requires re-authentication. Please log out and log back in to change your email address.";
            }

            setStatus({ type: "error", message: errorMessage });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await userService.uploadAvatar(user.uid, file);
            await refreshUser();
            setStatus({ type: "success", message: "Biometric visual updated." });
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", message: "Visual data upload failed." });
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 py-10 animate-fade-in px-4">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-primary pl-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-foreground tracking-tighter uppercase">{t('profile_settings')}</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">{t('profile_security_mgmt')}</p>
                </div>
                
                <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEditing ? 'bg-zinc-800 text-white' : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20'}`}
                >
                    {isEditing ? t('profile_cancel_edit') : t('profile_edit')}
                </button>
            </div>

            {/* NOTIFICATION BANNER */}
            <AnimatePresence>
                {(isMissingInfo || (user?.email && !user?.emailVerified && user?.role === 'user')) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 border border-primary/20 p-6 rounded-[2rem] flex items-center gap-6"
                    >
                        <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-primary uppercase tracking-tighter">
                                {user?.email && !user?.emailVerified ? t('profile_email_pending_title') : t('profile_incomplete_title')}
                            </h3>
                            <p className="text-[10px] font-bold text-surface-500 uppercase tracking-widest">
                                {user?.email && !user?.emailVerified && user?.role === 'user'
                                    ? t('profile_email_pending_desc')
                                    : t('profile_incomplete_desc')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT: FORM DATA */}
                <div className="lg:col-span-8 space-y-10">
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-6 md:p-10 border border-surface-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
                        
                        <div className="space-y-8 relative z-10">
                            <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">{t('profile_personal_data')}</h2>
                            
                            <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_first_name')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('profile_first_name')}
                                        value={formData.firstName}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_last_name')}</label>
                                    <input
                                        type="text"
                                        placeholder={t('profile_last_name')}
                                        value={formData.lastName}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                        required
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_phone')}</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('profile_email')}</label>
                                        {user?.email && (
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${user.emailVerified ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {user.emailVerified ? t('profile_verified') : t('profile_pending')}
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_dob')}</label>
                                    <div className="flex gap-2 w-full">
                                        <select
                                            value={formData.dob ? formData.dob.split('-')[1] : ""}
                                            onChange={(e) => {
                                                const parts = formData.dob ? formData.dob.split('-') : ['2000', '01', '01'];
                                                parts[1] = e.target.value;
                                                setFormData({...formData, dob: parts.join('-')});
                                            }}
                                            className={`flex-[2] ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-3 py-4 text-sm text-foreground outline-none transition-all appearance-none text-center font-bold`}
                                            disabled={!isEditing}
                                        >
                                            <option value="" disabled>{t('profile_month')}</option>
                                            {["01","02","03","04","05","06","07","08","09","10","11","12"].map((m, i) => (
                                                <option key={m} value={m}>{new Date(2000, i).toLocaleString(language || 'en', {month: 'long'})}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.dob ? formData.dob.split('-')[2] : ""}
                                            onChange={(e) => {
                                                const parts = formData.dob ? formData.dob.split('-') : ['2000', '01', '01'];
                                                parts[2] = e.target.value;
                                                setFormData({...formData, dob: parts.join('-')});
                                            }}
                                            className={`flex-1 ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-3 py-4 text-sm text-foreground outline-none transition-all appearance-none text-center font-bold`}
                                            disabled={!isEditing}
                                        >
                                            <option value="" disabled>{t('profile_day')}</option>
                                            {Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0')).map(d => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.dob ? formData.dob.split('-')[0] : ""}
                                            onChange={(e) => {
                                                const parts = formData.dob ? formData.dob.split('-') : ['2000', '01', '01'];
                                                parts[0] = e.target.value;
                                                setFormData({...formData, dob: parts.join('-')});
                                            }}
                                            className={`flex-[1.5] ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-3 py-4 text-sm text-foreground outline-none transition-all appearance-none text-center font-bold`}
                                            disabled={!isEditing}
                                        >
                                            <option value="" disabled>{t('profile_year')}</option>
                                            {Array.from({length: 100}, (_, i) => String(new Date().getFullYear() - i)).map(y => (
                                                <option key={y} value={y}>{y}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_security_update')}</label>
                                    <div className="w-full bg-surface-100 dark:bg-white/5 border border-surface-200 dark:border-white/5 rounded-xl px-6 py-4 text-[10px] text-surface-400 font-bold uppercase tracking-widest">
                                        {t('profile_last_sync')}: {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : t('profile_initial_boot')}
                                    </div>
                                </div>

                                <div className="md:col-span-2 pt-6">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full md:w-auto bg-primary text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 uppercase text-xs tracking-widest"
                                    >
                                        {loading ? t('profile_syncing') : t('profile_save_changes')}
                                    </button>
                                    
                                    {status.message && (
                                        <div className="mt-4 p-4 rounded-xl bg-zinc-900 border border-white/5">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${status.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                                {status.message}
                                            </p>
                                            {status.message.includes("log out") && (
                                                <button
                                                    type="button"
                                                    onClick={() => authService.logout()}
                                                    className="mt-3 w-full bg-red-500/10 text-red-500 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    {t('profile_logout_now')}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* SECURITY PROTOCOL CARD */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-6 md:p-10 border border-surface-200 dark:border-white/5 shadow-2xl relative overflow-hidden">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-black text-foreground uppercase tracking-tighter">{t('profile_security_protocol')}</h2>
                                <div className="px-3 py-1 bg-primary/10 rounded-full text-[8px] font-black text-primary uppercase tracking-widest animate-pulse">
                                    {t('profile_encrypted_conn')}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_new_password')}</label>
                                    <input
                                        type="password"
                                        placeholder={isEditing ? "••••••••" : t('profile_password_protected')}
                                        value={formData.newPassword}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-1">{t('profile_confirm_password')}</label>
                                    <input
                                        type="password"
                                        placeholder={isEditing ? "••••••••" : t('profile_password_protected')}
                                        value={formData.confirmPassword || ""}
                                        readOnly={!isEditing}
                                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                                        className={`w-full ${!isEditing ? 'bg-surface-100 dark:bg-white/5 cursor-not-allowed opacity-60' : 'bg-surface-50 dark:bg-black focus:ring-2 focus:ring-primary'} border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground outline-none transition-all`}
                                    />
                                </div>
                            </div>
                            
                            {!isEditing && (
                                <p className="text-[9px] text-surface-400 font-bold uppercase tracking-widest italic">
                                    {t('profile_click_edit')}
                                </p>
                            )}
                        </div>
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
                                {uploading && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10"
                                >
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                </div>
                            </div>
                            <div className="absolute -inset-2 bg-primary/10 rounded-[3.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleAvatarUpload} 
                            className="hidden" 
                            accept="image/*"
                        />

                        <div className="flex gap-4 w-full">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="flex-1 bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary hover:text-white hover:border-primary transition-all group disabled:opacity-50"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                {uploading ? t('profile_uploading') : t('profile_upload')}
                            </button>
                        </div>

                        <div className="text-center space-y-1">
                            <p className="text-sm font-black text-foreground uppercase tracking-tight">{user?.displayName || t('profile_accessing')}</p>
                            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] opacity-60">
                                {t('profile_verified_role').replace('{role}', user?.role || 'User')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
