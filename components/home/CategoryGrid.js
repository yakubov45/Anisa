"use client";

import Link from 'next/link';
import { useTranslation } from "@/lib/LanguageContext";

const categories = [
    { name: "Laptops", id: "Laptop", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, href: "/products?category=Laptop", color: "from-blue-500/20 to-blue-600/5" },
    { name: "Workstations", id: "PC", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>, href: "/products?category=PC", color: "from-primary/20 to-primary/5" },
    { name: "Displays", id: "Monitor", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, href: "/products?category=Monitor", color: "from-purple-500/20 to-purple-600/5" },
    { name: "Processors", id: "CPU", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>, href: "/products?category=CPU", color: "from-orange-500/20 to-orange-600/5" },
    { name: "Graphics", id: "GPU", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2zM7 7h10M7 11h10M7 15h10"/></svg>, href: "/products?category=GPU", color: "from-red-500/20 to-red-600/5" },
    { name: "Memory", id: "RAM", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"/></svg>, href: "/products?category=RAM", color: "from-cyan-500/20 to-cyan-600/5" },
    { name: "Storage", id: "Storage", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 1.1.9 2 2 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2zm8 4h5m-5 4h5"/></svg>, href: "/products?category=Storage", color: "from-amber-500/20 to-amber-600/5" },
    { name: "Power Units", id: "PSU", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, href: "/products?category=PSU", color: "from-yellow-500/20 to-yellow-600/5" },
    { name: "Cases", id: "Cases", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 7V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m18 0v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7m18 0l-9 4-9-4"/></svg>, href: "/products?category=Cases", color: "from-zinc-500/20 to-zinc-600/5" },
    { name: "Cooling", id: "Cooling", icon: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, href: "/products?category=Cooling", color: "from-teal-500/20 to-teal-600/5" },
];

export default function CategoryGrid() {
    const { t } = useTranslation();

    return (
        <section className="space-y-8 md:space-y-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black text-foreground uppercase tracking-tighter">{t('nav_categories')}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {categories.map((cat) => (
                    <Link 
                        key={cat.id} 
                        href={cat.href}
                        className={`group relative overflow-hidden bg-[#0A0A0B] border border-white/5 p-6 md:p-8 rounded-3xl md:rounded-[2rem] transition-all hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10`}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative z-10 flex flex-col items-center gap-6">
                            <div className="text-white/40 group-hover:text-primary group-hover:scale-110 transition-all duration-500">
                                {cat.icon}
                            </div>
                            <span className="font-black text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-primary transition-colors text-center">{cat.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
