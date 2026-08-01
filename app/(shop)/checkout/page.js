"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import useStore from "@/store/useStore";
import PriceDisplay from "@/components/common/PriceDisplay";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/lib/actions/order.actions";
import { useUser } from "@/lib/UserContext";
import { REGIONS, getRegionDisplayName } from "@/lib/constants";
import { useTranslation } from "@/lib/LanguageContext";

export default function CheckoutPage() {
    const { t, lang } = useTranslation();
    const { cart, clearCart, removeFromCart } = useStore();
    const { user, loading: userLoading } = useUser();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        region: "Tashkent City"
    });

    const [isChangingRegion, setIsChangingRegion] = useState(false);

    // Pre-fill user data
    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.displayName || user.fullName || "",
                email: user.email || "",
                phone: user.phone || ""
            }));
        }
    }, [user]);

    const subtotal = cart.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
    const shipping = 0; 
    const total = subtotal + shipping;

    const handleCheckout = async (e) => {
        e.preventDefault();
        if (!user) {
            setError(t('auth_identity_required'));
            return;
        }

        if (!formData.phone || formData.phone.length < 9) {
            setError(t('auth_invalid_phone'));
            return;
        }

        if (!formData.address.trim()) {
            setError(t('checkout_address_required') || "Please enter your address");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const orderPayload = {
            ...formData,
            userId: user.uid,
            paymentMethod,
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        };

        const result = await createOrderAction(orderPayload, cart);

        if (result.success) {
            clearCart(); 
            if (typeof window !== 'undefined') {
                localStorage.removeItem('onepc-storage'); 
            }
            router.push("/checkout/success");
        } else {
            let errorMsg = result.error || t('ord_no_found');
            if (errorMsg.includes('|')) {
                const [key, param] = errorMsg.split('|');
                const translationKey = key.toLowerCase();
                errorMsg = t(translationKey).replace('{name}', param);
            }
            setError(errorMsg);
            setIsSubmitting(false);
        }
    };

    if (userLoading) return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-surface-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-primary grayscale opacity-50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">{t('auth_identity_required')}</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">{t('auth_sign_in_proceed')}</p>
                </div>
                <Link href="/login" className="bg-primary text-white font-black px-10 py-5 rounded-xl uppercase text-xs tracking-widest hover:bg-foreground transition-all shadow-xl shadow-primary/20">
                    {t('auth_sign_in')}
                </Link>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-8 animate-fade-in">
                <div className="w-24 h-24 bg-surface-50 dark:bg-zinc-900 rounded-full flex items-center justify-center text-primary grayscale opacity-50">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
                </div>
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-black text-foreground uppercase tracking-tighter">{t('cart_empty')}</h1>
                    <p className="text-surface-500 font-bold uppercase text-[10px] tracking-widest">{t('cart_empty_desc')}</p>
                </div>
                <Link href="/products" className="bg-primary text-white font-black px-10 py-5 rounded-xl uppercase text-xs tracking-widest hover:bg-foreground transition-all shadow-xl shadow-primary/20">
                    {t('nav_products')}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-0 pb-20 pt-6 md:pt-10 space-y-12 animate-fade-in">
            <div className="flex items-center justify-center gap-4 md:gap-10 text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] text-surface-400">
                <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : ""}`}>
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step >= 1 ? "border-primary bg-primary/10" : "border-surface-200"}`}>1</span>
                    <span className="hidden sm:inline">{t('admin_general_info')}</span>
                </div>
                <div className="w-8 md:w-16 h-px bg-surface-200 dark:bg-white/10" />
                <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : ""}`}>
                    <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${step >= 2 ? "border-primary bg-primary/10" : "border-surface-200"}`}>2</span>
                    <span className="hidden sm:inline">{t('det_total_valuation')}</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-500 text-xs font-black uppercase tracking-widest text-center animate-shake">
                    <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
                <div className="lg:col-span-7 space-y-10">
                    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 border border-surface-200 dark:border-white/5 shadow-xl">
                        <form onSubmit={handleCheckout} className="space-y-10 md:space-y-12">
                            <div className="space-y-8">
                                <div className="border-l-4 border-primary pl-6">
                                    <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter">{t('ord_shipping_address')}</h2>
                                    <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest mt-1">{t('admin_registered_clients')}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">{t('auth_fullname')}</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                                            className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all" 
                                            placeholder={t('checkout_enter_name') || "ENTER NAME"} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">{t('auth_phone')}</label>
                                        <input 
                                            required
                                            type="tel" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all" 
                                            placeholder="+998 -- --- -- --" 
                                        />
                                    </div>

                                    <div className="space-y-4 md:col-span-2 bg-surface-50 dark:bg-black/40 p-6 rounded-2xl border border-surface-200 dark:border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-black text-surface-400 uppercase tracking-widest">{t('ord_region')}</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-primary">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                                                    </span>
                                                    <span className="text-sm font-black text-foreground uppercase tracking-tight">
                                                        {getRegionDisplayName(formData.region, lang)}
                                                    </span>
                                                    <span className="text-[8px] bg-primary/10 text-primary px-2 py-0.5 rounded font-black uppercase tracking-widest ml-2">
                                                        {t('checkout_auto_detected') || "Auto-Detected"}
                                                    </span>
                                                </div>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setIsChangingRegion(!isChangingRegion)}
                                                className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                                            >
                                                {isChangingRegion ? `[ ${t('btn_close') || 'Close'} ]` : `[ ${t('btn_change') || 'Change'} ]`}
                                            </button>
                                        </div>

                                        {isChangingRegion && (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-4 animate-slide-down">
                                                {REGIONS.map(r => (
                                                    <button
                                                        key={r}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({...formData, region: r});
                                                            setIsChangingRegion(false);
                                                        }}
                                                        className={`text-[9px] font-black uppercase p-3 rounded-lg border transition-all ${formData.region === r ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-zinc-900 border-surface-200 dark:border-white/10 text-surface-500 hover:border-primary'}`}
                                                    >
                                                        {getRegionDisplayName(r, lang)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4 md:col-span-2">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest ml-1">{t('checkout_street_name')}</label>
                                            <textarea 
                                                required
                                                rows="3"
                                                value={formData.address}
                                                onChange={(e) => setFormData({...formData, address: e.target.value})}
                                                className="w-full bg-surface-50 dark:bg-black border border-surface-200 dark:border-white/10 rounded-xl px-6 py-4 text-sm text-foreground focus:ring-1 focus:ring-primary outline-none transition-all resize-none" 
                                                placeholder={t('checkout_address_placeholder')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="hidden border-l-4 border-primary pl-6">
                                    <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter">{t('det_payment_method')}</h2>
                                    <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest mt-1">{t('det_cargo_manifest')}</p>
                                </div>

                                <div className="hidden grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {[
                                        { id: 'payme', name: 'Payme', icon: '/icons/main-payme.webp' },
                                        { id: 'click', name: 'Click', icon: '/icons/main-click.webp' },
                                        { id: 'cash', name: t('det_cash_on_delivery'), icon: null }
                                    ].map((method) => (
                                        <div 
                                            key={method.id}
                                            onClick={() => setPaymentMethod(method.id)}
                                            className={`cursor-pointer p-6 rounded-2xl border transition-all flex flex-col items-center justify-center gap-3 text-center ${paymentMethod === method.id ? 'border-primary bg-primary/5' : 'border-surface-200 dark:border-white/10 bg-surface-50 dark:bg-black/40 hover:border-surface-400'}`}
                                        >
                                            {method.icon ? (
                                                <img src={method.icon} className="h-6 w-auto grayscale brightness-150" alt={method.name} />
                                            ) : (
                                                <div className="w-6 h-6 flex items-center justify-center text-primary">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{method.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-foreground dark:bg-white text-background dark:text-black font-black py-6 rounded-2xl shadow-2xl hover:bg-primary hover:text-white transition-all uppercase text-xs tracking-[0.2em] active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? t('admin_updating') + '...' : t('det_confirm_order')}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-5 space-y-8 sticky top-32">
                    <div className="bg-surface-50 dark:bg-zinc-900 rounded-[2rem] border border-surface-200 dark:border-white/5 overflow-hidden shadow-xl">
                        <div className="p-8 border-b border-surface-200 dark:border-white/5 bg-white dark:bg-zinc-800/50">
                            <h3 className="text-xl font-black text-foreground uppercase tracking-tighter">{t('cart_summary')}</h3>
                            <p className="text-surface-500 font-bold uppercase text-[9px] tracking-widest mt-1">{t('det_manifest')}</p>
                        </div>
                        
                        <div className="p-8 space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-white dark:bg-black rounded-xl border border-surface-200 dark:border-white/5 overflow-hidden p-2 flex-shrink-0">
                                        <img src={item.image} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[11px] font-black text-foreground uppercase tracking-tight truncate">{item.name}</p>
                                        <p className="text-[10px] text-surface-500 font-bold uppercase tracking-widest">{t('det_qty')}: {item.quantity || 1}</p>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-2">
                                        <PriceDisplay price={item.price * (item.quantity || 1)} className="text-sm font-black text-foreground tracking-tight" />
                                        <button 
                                            type="button"
                                            onClick={() => removeFromCart(item.id)} 
                                            className="text-surface-400 hover:text-red-500 transition-colors p-1"
                                            title="Remove item"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-8 bg-white dark:bg-zinc-800/30 border-t border-surface-200 dark:border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-surface-500">
                                <span>{t('det_subtotal')}</span>
                                <PriceDisplay price={subtotal} className="text-foreground" />
                            </div>
                            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-widest text-surface-500">
                                <span>{t('det_delivery')}</span>
                                <span className="text-green-500">{t('det_free')}</span>
                            </div>
                            <div className="h-px bg-surface-200 dark:bg-white/10 my-2" />
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em]">{t('det_total_valuation')}</span>
                                    <p className="text-xs text-surface-500 font-bold uppercase">{t('det_tax_included')}</p>
                                </div>
                                <PriceDisplay price={total} className="text-3xl font-black text-foreground tracking-tighter" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}