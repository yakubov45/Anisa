"use client";

import { useState } from "react";

const LEGAL_DATA = [
    {
        id: "privacy",
        title: "Privacy Protocol",
        content: `Your data integrity is our priority. We implement high-encryption protocols for all user transactions. 
        We do not share your configuration details or purchase history with third-party networks. 
        All telemetry data is anonymized and used solely for hardware optimization purposes.`
    },
    {
        id: "terms",
        title: "Operational Terms",
        content: `By engaging with the OnePC ecosystem, you agree to our deployment protocols. 
        System builds require a 50% deposit before architecture begins. 
        Modifying factory-sealed components may impact your elite support eligibility.`
    },
    {
        id: "registry",
        title: "Registry",
        content: `OnePC Enterprise is a registered hardware architect in the Republic of Uzbekistan. 
        License No: O-123456-X. Registered HQ: Buyuk Ipak Yo'li 123, Tashkent.`
    },
    {
        id: "security",
        title: "Security Audit",
        content: `Our platform undergoes bi-weekly security audits to ensure your payment and identity logs remain secure. 
        We employ zero-trust architecture for all internal system access.`
    }
];

export default function LegalPage() {
    const [active, setActive] = useState("privacy");

    return (
        <div className="py-20 max-w-4xl mx-auto px-6 space-y-16">
            <div className="space-y-4">
                <h1 className="text-5xl font-black uppercase tracking-tighter">Corporate <span className="text-primary">Governance</span></h1>
                <p className="text-surface-500 font-black uppercase text-[10px] tracking-widest">Legal protocols and operational transparency</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {LEGAL_DATA.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className={`p-6 rounded-2xl text-[9px] font-black uppercase tracking-widest text-left border transition-all ${active === item.id ? "bg-primary border-primary text-white shadow-xl shadow-primary/20" : "bg-surface border-white/5 text-surface-400 hover:border-white/10"
                            }`}
                    >
                        {item.title}
                    </button>
                ))}
            </div>

            <div className="bg-surface/40 p-12 md:p-20 rounded-[3rem] border border-white/5 min-h-[400px] animate-fade-in">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-8">{LEGAL_DATA.find(i => i.id === active).title}</h2>
                <div className="space-y-6">
                    {LEGAL_DATA.find(i => i.id === active).content.split('\n').map((line, idx) => (
                        <p key={idx} className="text-foreground/70 font-medium leading-loose">
                            {line.trim()}
                        </p>
                    ))}
                </div>
            </div>

            <div className="pt-10 border-t border-white/5 text-center">
                <p className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Last Updated: April 29, 2026</p>
            </div>
        </div>
    );
}
