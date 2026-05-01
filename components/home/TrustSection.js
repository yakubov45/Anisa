export default function TrustSection() {
    const features = [
        { 
            title: "Fast delivery", 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, 
            desc: "Safe delivery across the country" 
        },
        { 
            title: "Secure payment", 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, 
            desc: "100% protected transactions" 
        },
        { 
            title: "Warranty", 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/></svg>, 
            desc: "Official warranty for all parts" 
        },
        { 
            title: "Easy return", 
            icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>, 
            desc: "14-day hassle-free returns" 
        },
    ];

    return (
        <section className="bg-surface-50 border border-white/5 rounded-[3rem] p-12 md:p-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {features.map((f) => (
                    <div key={f.title} className="flex flex-col items-center text-center gap-4 group">
                        <div className="w-20 h-20 bg-surface-100 rounded-3xl flex items-center justify-center text-primary shadow-inner group-hover:bg-primary/10 group-hover:scale-110 transition-all">
                            {f.icon}
                        </div>
                        <h3 className="font-black text-foreground uppercase tracking-tight text-lg">{f.title}</h3>
                        <p className="text-surface-600 text-xs font-bold leading-relaxed max-w-[150px]">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
