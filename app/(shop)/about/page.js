"use client";

import Image from "next/image";

const STORES = [
    {
        city: "Tashkent",
        name: "OnePC Flagship",
        address: "123 Buyuk Ipak Yo'li, Tashkent, Uzbekistan",
        phone: "+998 90 123 45 67",
        hours: "Mon - Sun: 10:00 - 22:00",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80"
    },
    {
        city: "Samarkand",
        name: "OnePC Region Core",
        address: "45 Registry St, Samarkand, Uzbekistan",
        phone: "+998 93 987 65 43",
        hours: "Mon - Sat: 09:00 - 20:00",
        image: "https://images.unsplash.com/photo-1591760972791-70abf246605a?w=800&auto=format&fit=crop&q=80"
    }
];

export default function AboutPage() {
    return (
        <div className="space-y-16 md:space-y-32 py-10 px-4 sm:px-0">
            {/* Hero Section */}
            <section className="relative h-[50vh] md:h-[60vh] rounded-3xl md:rounded-[4rem] overflow-hidden group">
                <Image
                    src="/images/banner_02.png"
                    alt="OnePC Banner"
                    fill
                    priority
                    className="object-cover transition-all duration-1000 scale-110 group-hover:scale-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                        Engineered <br /> <span className="text-primary">Precision</span>
                    </h1>
                    <p className="mt-8 text-foreground/70 font-bold uppercase text-[10px] tracking-[0.5em] max-w-xl leading-loose">
                        We are not just a store. We are the architects of high-performance ecosystems for the modern professional.
                    </p>
                </div>
            </section>

            {/* Core Values */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-12 px-6">
                {[
                    { title: "Military Grade", desc: "Every component undergoes a 48-hour stress test before deployment.", icon: "⚔️" },
                    { title: "Elite Support", desc: "Direct access to our hardware engineers for every OnePC customer.", icon: "🛡️" },
                    { title: "Visual Art", desc: "We believe a workstation should be as beautiful as it is powerful.", icon: "🎨" }
                ].map((val, idx) => (
                    <div key={idx} className="bg-surface/40 p-8 md:p-12 rounded-3xl md:rounded-[3rem] border border-white/5 space-y-6 hover:border-primary/20 transition-all">
                        <div className="text-4xl">{val.icon}</div>
                        <h3 className="text-xl font-black uppercase tracking-tight">{val.title}</h3>
                        <p className="text-foreground/60 text-sm font-medium leading-relaxed">{val.desc}</p>
                    </div>
                ))}
            </section>

            {/* Store Locations */}
            <section className="space-y-16">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Operational Hubs</h2>
                    <p className="text-foreground/50 font-black uppercase text-[10px] tracking-widest">Find your nearest deployment center</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {STORES.map((store, idx) => (
                        <div key={idx} className="group relative bg-surface rounded-3xl md:rounded-[3.5rem] overflow-hidden border border-white/5 hover:border-primary/30 transition-all flex flex-col md:flex-row">
                            <div className="relative w-full md:w-1/2 h-80 md:h-auto">
                                <Image src={store.image} alt={store.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            </div>
                            <div className="p-12 md:w-1/2 space-y-6">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{store.city}</span>
                                    <h3 className="text-2xl font-black uppercase tracking-tight">{store.name}</h3>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex gap-4">
                                        <span className="text-lg opacity-40">📍</span>
                                        <p className="text-xs font-bold text-foreground/70 leading-relaxed">{store.address}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-lg opacity-40">📞</span>
                                        <p className="text-xs font-black text-surface-900 leading-relaxed">{store.phone}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <span className="text-lg opacity-40">🕒</span>
                                        <p className="text-xs font-bold text-foreground/70 leading-relaxed">{store.hours}</p>
                                    </div>
                                </div>
                                <button className="w-full mt-6 bg-surface-100 text-surface-900 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                                    View on Map
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form */}
            <section className="bg-[#0A0A0B] text-white rounded-3xl md:rounded-[4rem] p-8 md:p-24 space-y-8 md:space-y-12 relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 top-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                
                <div className="max-w-2xl space-y-6 relative">
                    <h2 className="text-5xl font-black uppercase tracking-tighter leading-none">Contact the <br /> <span className="text-primary">Core Team</span></h2>
                    <p className="text-zinc-400 font-medium leading-loose">Have a project that requires specialized hardware? Our engineers are ready to architect your solution.</p>
                </div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                    <input type="text" placeholder="FULL NAME" className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <input type="email" placeholder="EMAIL ADDRESS" className="bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <textarea placeholder="PROJECT DETAILS" rows="4" className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 text-[10px] font-black tracking-widest text-white placeholder:text-zinc-600 focus:ring-1 focus:ring-primary outline-none" />
                    <button className="md:col-span-1 bg-primary text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all">
                        Initiate Contact
                    </button>
                </form>
            </section>
        </div>
    );
}
