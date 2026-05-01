"use client";

import { useState } from "react";
import Link from "next/link";

const FAQ_DATA = [
    {
        category: "1. Technical (Hardware)",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"/></svg>,
        items: [
            { q: "Is this computer suitable for gaming?", a: "Yes, all our ready-to-ship builds are specifically optimized for gaming performance. Detailed FPS benchmarks and technical specifications are provided on each product page." },
            { q: "Which processor is better – Intel or AMD?", a: "It depends on your specific workflow. Intel Core processors are often preferred for high-frequency gaming, while AMD Ryzen excels in multi-threaded tasks like 3D rendering and professional video editing." },
            { q: "How much RAM do I need?", a: "A minimum of 8GB is required for modern applications. We recommend 16GB for an optimal gaming experience. Professional workloads such as 4K video editing require 32GB or more." },
            { q: "What is the difference between SSD and HDD?", a: "SSDs are significantly faster (10-20x) than traditional HDDs, ensuring the operating system and games load in seconds. HDDs are cost-effective for bulk long-term data storage (2TB+)." },
            { q: "Why do I need a graphics card (GPU)?", a: "The GPU is responsible for generating complex visual data. It is the primary computational unit for gaming, 3D modeling, and professional graphic design." }
        ]
    },
    {
        category: "2. Compatibility",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"/></svg>,
        items: [
            { q: "Are these components compatible with each other?", a: "Our platform features real-time compatibility filters. When utilizing the 'PC Builder' protocol, the system automatically prevents the selection of incompatible hardware." },
            { q: "Is the power supply unit (PSU) sufficient?", a: "PSU requirements are calculated based on high-draw components (CPU and GPU). Each build manifest lists the minimum wattage required for peak operational stability." },
            { q: "How do I check Motherboard and CPU compatibility?", a: "Compatibility is determined by the CPU socket type (e.g., LGA1700, AM5) and chipset. If you require technical verification, our specialists are available for consultation." }
        ]
    },
    {
        category: "3. Build & Integration",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
        items: [
            { q: "Do you offer professional assembly services?", a: "Yes, we provide expert hardware integration. Our technicians perform meticulous cable management and thermal optimization for every custom build." },
            { q: "Do you pre-install the OS and essential software?", a: "Yes, we provide operating system installation and optimization. We also pre-install critical drivers and utility software for immediate use." },
            { q: "Will the hardware drivers be pre-installed?", a: "Every pre-built system undergoes a full driver integration protocol. Your machine will be plug-and-play ready upon delivery." }
        ]
    },
    {
        category: "4. Performance & Usage",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
        items: [
            { q: "What FPS benchmarks can I expect?", a: "FPS performance is dependent on the specific CPU/GPU configuration. Average benchmarks for competitive titles (CS2, Dota 2, Cyberpunk 2077) are detailed on each build page." },
            { q: "Are the systems protected against overheating?", a: "Every build undergoes rigorous thermal stress tests. High-airflow chassis and precision cooling solutions ensure stable temperatures even under extreme workloads." },
            { q: "Should I choose a Gaming Laptop or a Desktop PC?", a: "Select a laptop for portability and mobility. Choose a Desktop PC for maximum raw performance, thermal efficiency, and long-term hardware upgradeability." }
        ]
    },
    {
        category: "5. Future Proofing & Upgrades",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/></svg>,
        items: [
            { q: "Can I upgrade my system in the future?", a: "Absolutely. Our PCs are designed for maximum modularity. You can easily expand RAM, increase storage capacity, or upgrade your GPU without replacing the entire system." },
            { q: "Which components are easiest to upgrade?", a: "RAM expansion and SSD integration are the most straightforward upgrades. Updating the GPU is the most effective way to significantly boost real-time rendering and gaming performance." }
        ]
    },
    {
        category: "6. Logistics & Delivery",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-4 0h4"/></svg>,
        items: [
            { q: "What regions are covered by your delivery network?", a: "We provide nationwide delivery across all regions of Uzbekistan. You can specify your precise target location during the secure checkout process." },
            { q: "Will I be contacted prior to delivery?", a: "Yes, our logistics personnel will contact you at least 30-60 minutes before arrival to confirm the secure handover window." },
            { q: "How can I track my deployment status?", a: "You can monitor the real-time status of your order (Pending, Shipped, Delivered) within the 'Orders' section of your profile dashboard." }
        ]
    },
    {
        category: "7. Security Protocols",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>,
        items: [
            { q: "Is the QR verification code secure?", a: "Yes, the QR code is unique to each manifest and single-use only. It ensures 100% security during the final hardware deployment phase." },
            { q: "Can I share my verification QR code?", a: "Only share the code with a trusted individual authorized to receive the cargo. The QR code serves as the primary digital key for delivery confirmation." },
            { q: "Can a proxy recipient accept my order?", a: "Yes, as long as the recipient possesses the unique QR code or the secondary verification token, they can authorized the delivery handover." }
        ]
    },
    {
        category: "8. Financial Protocols",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>,
        items: [
            { q: "Do you offer flexible installment plans?", a: "Yes, we provide multi-month installment plans (3, 6, and 12 months) via our strategic banking partners. Details are available during checkout." },
            { q: "Is the payment refundable?", a: "In the event of a deployment cancellation or identified manufacturing defect, full refunds are processed according to our enterprise Refund Policy." }
        ]
    },
    {
        category: "9. Warranty & Support",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>,
        items: [
            { q: "What does the hardware warranty cover?", a: "The warranty covers manufacturing defects, technical malfunctions, and hardware component failure. Physical or liquid-based damage is excluded from coverage." },
            { q: "How do I initiate a warranty claim?", a: "Provide your unique Order ID and product certificate. Our technical service center will complete a full diagnostic review within 24-48 hours." }
        ]
    },
    {
        category: "10. General Knowledge",
        icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
        items: [
            { q: "Are the prices listed on the site current?", a: "Yes, all pricing is synchronized in real-time and guaranteed at the moment of secure checkout." },
            { q: "When are promotional discounts available?", a: "Significant discounts are offered during major holidays and strategic 'Flash Sale' events. Follow our official channels for real-time updates." }
        ]
    }
];

export default function FAQPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(FAQ_DATA[0].category);
    const [openItems, setOpenItems] = useState({});

    const toggleItem = (category, index) => {
        const key = `${category}-${index}`;
        setOpenItems(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const filteredData = FAQ_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(item => 
            item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.items.length > 0);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 space-y-16 animate-fade-in">
            {/* HERO */}
            <div className="text-center space-y-4">
                <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter uppercase italic">
                    How can we <span className="text-primary">help?</span>
                </h1>
                <p className="text-surface-500 font-bold uppercase text-xs tracking-[0.3em]">Knowledge Base & Technical Protocol</p>
            </div>

            {/* SEARCH */}
            <div className="max-w-3xl mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-all" />
                <div className="relative bg-white dark:bg-zinc-900 border border-surface-200 dark:border-white/10 rounded-2xl p-2 flex items-center">
                    <span className="pl-6 text-surface-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search for protocols, shipping, builds..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-transparent border-none outline-none px-4 py-4 text-sm font-bold text-foreground placeholder:text-surface-400 placeholder:uppercase"
                    />
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* SIDEBAR: CATEGORIES */}
                <div className="lg:col-span-4 space-y-4 sticky top-32">
                    <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest ml-4">Categories</p>
                    <div className="space-y-1">
                        {FAQ_DATA.map((cat) => (
                            <button
                                key={cat.category}
                                onClick={() => {
                                    setActiveCategory(cat.category);
                                    setSearchQuery("");
                                }}
                                className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center gap-4 ${activeCategory === cat.category ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'text-surface-500 hover:bg-surface-50 dark:hover:bg-white/5'}`}
                            >
                                <span className={activeCategory === cat.category ? "text-white" : "text-primary"}>
                                    {cat.icon}
                                </span>
                                {cat.category}
                            </button>
                        ))}
                    </div>
                    
                    <div className="mt-12 bg-surface-900 text-white p-8 rounded-[2rem] space-y-4">
                        <h4 className="text-sm font-black uppercase tracking-widest">Still curious?</h4>
                        <p className="text-xs text-surface-400 font-medium">If you can't find your answer, our tech command center is standing by.</p>
                        <Link href="https://t.me/onepc_support" target="_blank" className="bg-primary text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest inline-block hover:bg-primary-600 transition-all">
                            Talk to Tech Support
                        </Link>
                    </div>
                </div>

                {/* ACCORDIONS */}
                <div className="lg:col-span-8 space-y-8">
                    {filteredData.map((cat) => (
                        (searchQuery || activeCategory === cat.category) && (
                            <div key={cat.category} className="space-y-4 animate-slide-up">
                                <div className="flex items-center gap-4 border-l-4 border-primary pl-6 mb-6">
                                    <span className="text-primary">{cat.icon}</span>
                                    <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">{cat.category}</h2>
                                </div>

                                <div className="space-y-3">
                                    {cat.items.map((item, idx) => {
                                        const isOpen = openItems[`${cat.category}-${idx}`];
                                        return (
                                            <div 
                                                key={idx}
                                                className={`bg-white dark:bg-zinc-900 border transition-all rounded-3xl overflow-hidden ${isOpen ? 'border-primary shadow-lg' : 'border-surface-200 dark:border-white/5 hover:border-surface-300'}`}
                                            >
                                                <button 
                                                    onClick={() => toggleItem(cat.category, idx)}
                                                    className="w-full text-left p-6 md:p-8 flex justify-between items-center gap-6"
                                                >
                                                    <span className="text-sm md:text-base font-black text-foreground uppercase tracking-tight leading-snug">
                                                        {item.q}
                                                    </span>
                                                    <span className={`transition-transform duration-300 ${isOpen ? 'rotate-45 text-primary' : 'text-surface-300'}`}>
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
                                                    </span>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-8 pb-8 animate-fade-in">
                                                        <div className="h-px bg-surface-100 dark:bg-white/5 mb-6" />
                                                        <p className="text-surface-600 dark:text-surface-400 font-medium leading-relaxed">
                                                            {item.a}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    ))}

                    {filteredData.length === 0 && (
                        <div className="text-center py-20 space-y-4 opacity-50">
                            <div className="flex justify-center text-primary">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-widest">No matching protocols found</h3>
                            <p className="text-xs font-bold uppercase text-surface-500">Try adjusting your search criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
