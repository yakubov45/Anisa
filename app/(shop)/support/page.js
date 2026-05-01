"use client";

import { useState } from "react";

const SUPPORT_DATA = {
    warranty: {
        title: "System Warranty",
        icon: "🛡️",
        content: [
            { h: "Standard Deployment", p: "3-year limited warranty covering all mechanical and electronic failures." },
            { h: "Enterprise Suite", p: "5-year onsite support with guaranteed 24-hour hardware replacement." },
            { h: "Elite Coverage", p: "Lifetime support on labor and component consultation for custom liquid-cooled systems." }
        ]
    },
    support: {
        title: "Elite Support",
        icon: "🎧",
        content: [
            { h: "Direct Line", p: "24/7 access to our hardware engineers for critical system diagnosis." },
            { h: "Remote Tuning", p: "Expert optimization of BIOS and software configurations via secure tunnels." },
            { h: "Hardware Refresh", p: "Priority access to new component drops and trade-in programs." }
        ]
    },
    deployments: {
        title: "Deployments",
        icon: "🚀",
        content: [
            { h: "System Staging", p: "Every system undergoes 72 hours of stress testing before final deployment." },
            { h: "White Glove Delivery", p: "Professional onsite installation and cable management for workstation setups." },
            { h: "Global Logistics", p: "Secure, insured transit for all domestic and international shipments." }
        ]
    }
};

export default function SupportPage() {
    const [activeTab, setActiveTab] = useState("warranty");

    return (
        <div className="py-20 space-y-24">
            <div className="text-center space-y-6">
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">Support <span className="text-primary">Ecosystem</span></h1>
                <p className="text-surface-500 font-black uppercase text-[10px] tracking-[0.4em]">Comprehensive infrastructure for your hardware</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-4 px-6">
                {Object.keys(SUPPORT_DATA).map(key => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === key ? "bg-primary text-white shadow-2xl shadow-primary/30" : "bg-surface border border-white/5 text-surface-400 hover:text-surface-900"
                            }`}
                    >
                        {SUPPORT_DATA[key].title}
                    </button>
                ))}
            </div>

            {/* Active Content */}
            <div className="max-w-5xl mx-auto px-6 animate-slide-up">
                <div className="bg-surface/40 rounded-[4rem] border border-white/5 p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute -right-20 -top-20 text-[12rem] opacity-[0.03] rotate-12">{SUPPORT_DATA[activeTab].icon}</div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative">
                        <div className="space-y-8">
                            <div className="text-6xl">{SUPPORT_DATA[activeTab].icon}</div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">{SUPPORT_DATA[activeTab].title}</h2>
                            <p className="text-foreground/70 font-medium leading-loose">
                                At OnePC, our commitment to your performance extends far beyond the point of sale. Our support infrastructure is engineered for maximum reliability and uptime.
                            </p>
                        </div>
                        
                        <div className="space-y-12">
                            {SUPPORT_DATA[activeTab].content.map((item, idx) => (
                                <div key={idx} className="space-y-3 group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1 h-1 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                                        <h4 className="text-sm font-black uppercase tracking-widest">{item.h}</h4>
                                    </div>
                                    <p className="text-xs text-foreground/60 font-medium leading-relaxed pl-5">{item.p}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Preview */}
            <section className="text-center space-y-12 py-20 bg-foreground text-background rounded-[4rem]">
                <h3 className="text-3xl font-black uppercase tracking-tighter">Need Immediate Assistance?</h3>
                <div className="flex flex-wrap justify-center gap-8">
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-2 min-w-[280px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Technical HQ</p>
                        <p className="text-sm font-bold">+998 90 000 00 00</p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-2 min-w-[280px]">
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Email Matrix</p>
                        <p className="text-sm font-bold">support@onepc.uz</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
