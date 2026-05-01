import Link from 'next/link';

const setups = [
    { 
        name: "Pro Gaming Setup", 
        price: 1250, 
        image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
        items: "RTX 4070 SUPER + i7-14700K + 240Hz Pro Monitor", 
        badge: "ESPORTS READY"
    },
    { 
        name: "Studio Workstation", 
        price: 950, 
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80",
        items: "32GB RAM + 2TB NVMe + 4K Color Accurate Display", 
        badge: "CREATIVE PRO"
    },
    { 
        name: "Elite Streamer Pack", 
        price: 1800, 
        image: "https://images.unsplash.com/photo-1614018424563-29f1bb346b94?w=800&q=80",
        items: "Dual PC Setup + Capture Card + RGB Environment", 
        badge: "CREATOR ELITE"
    },
];

export default function SetupIdeas() {
    return (
        <section className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">Setup Ideas</h2>
                </div>
                <Link href="/pc-builder" className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-white transition-colors">Start Custom Build</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {setups.map((setup) => (
                    <div key={setup.name} className="group bg-surface border border-border-alpha rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-700 flex flex-col h-full">
                        <div className="h-64 relative overflow-hidden flex-shrink-0">
                            <img 
                                src={setup.image} 
                                alt={setup.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                            <div className="absolute top-6 right-6 bg-primary text-white text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest shadow-2xl">
                                $ {setup.price}
                            </div>
                            <div className="absolute bottom-6 left-8 bg-foreground/5 backdrop-blur-md border border-border-alpha text-foreground text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.3em]">
                                {setup.badge}
                            </div>
                        </div>
                        <div className="p-10 flex flex-col flex-grow space-y-8">
                            <div className="space-y-3 flex-grow">
                                <h3 className="text-2xl font-black text-foreground uppercase tracking-tight leading-tight">{setup.name}</h3>
                                <p className="text-surface-500 text-[10px] font-bold uppercase tracking-[0.2em] leading-relaxed">{setup.items}</p>
                            </div>
                            <div className="flex gap-4 mt-auto">
                                <Link href="/pc-builder" className="flex-1 bg-primary text-white text-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-foreground hover:text-background transition-all shadow-xl shadow-primary/20">
                                    Aquire Setup
                                </Link>
                                <button className="w-16 h-16 flex items-center justify-center border border-border-alpha rounded-2xl hover:bg-surface-100 transition-all text-foreground">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
