import { getPreBuiltById } from "@/features/product/api"
import Link from "next/link"
import PriceDisplay from "@/components/common/PriceDisplay"
import BuildBuyButton from "@/features/builder/BuildBuyButton"

export default async function PreBuiltDetailPage({ params }) {
    const { id } = await params;
    const build = await getPreBuiltById(id);

    if (!build) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-6">
                    <div className="text-primary font-mono text-sm tracking-[0.5em] animate-pulse">ERROR_404_NOT_FOUND</div>
                    <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase">System Configuration Missing</h2>
                    <p className="text-surface-500 font-medium">The requested hardware assembly registry could not be located in the current sector.</p>
                    <Link href="/pc-builder" className="inline-block bg-primary text-white font-black px-10 py-4 rounded-xl uppercase tracking-widest text-xs hover:scale-105 transition-all">
                        Return to Builder
                    </Link>
                </div>
            </div>
        );
    }

    const specsArray = build.specs ? build.specs.split(',').map(s => s.trim()) : [];

    return (
        <div className="pt-18 pb-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10">
                {/* Header / Breadcrumb */}
                <div className="flex items-center gap-6 mb-12">
                    <Link href="/pc-builder" className="group flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                        </div>
                        <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.3em]">PC_BUILDER_REGISTRY</span>
                    </Link>
                    <div className="w-px h-4 bg-border-alpha" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] font-mono">ID: {id.slice(-8).toUpperCase()}</span>
                </div>

                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center lg:items-start">
                    {/* Left: Hardware Visuals */}
                    <div className="w-full lg:w-5/12 space-y-10">
                        <div className="relative aspect-square border-2 border-surface-200 dark:border-white/10 rounded-[3rem] p-10 flex items-center justify-center overflow-hidden shadow-sm group mx-auto max-w-sm lg:max-w-none bg-transparent">
                            {/* Inner Glow - only in dark mode or subtle */}
                            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <img
                                src={build.image || "https://images.unsplash.com/photo-1587202377405-836165b1040a?q=80&w=1200&auto=format"}
                                alt={build.name}
                                className="w-full h-full object-contain drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-1000 z-10"
                            />
                        </div>

                        {/* Performance Metric - Showing only one relevant category */}
                        <div className="flex justify-center">
                            <div className="bg-transparent border-2 border-surface-200 dark:border-white/10 px-8 py-6 rounded-2xl text-center space-y-1 min-w-[160px]">
                                <div className="text-[9px] font-black text-surface-400 uppercase tracking-widest">
                                    {build.category || 'System'} Class
                                </div>
                                <div className="text-lg font-black text-foreground uppercase tracking-tighter">
                                    {build.category === 'Gaming' ? 'Elite Gaming' :
                                        build.category === 'Work' ? 'Professional' :
                                            build.category === 'Render' ? 'Ultra Render' : 'High Performance'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Technical Blueprint */}
                    <div className="w-full lg:w-7/12 space-y-12">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="flex items-center justify-center lg:justify-start gap-4">
                                <div className="w-12 h-1 bg-primary rounded-full" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] font-mono">
                                    {build.target ? build.target.replace(/_/g, ' ') : 'ELITE DEPLOYMENT'}
                                </span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter uppercase leading-[0.9]">{build.name}</h1>
                            <p className="text-surface-500 font-medium text-lg leading-relaxed max-w-2xl border-l-0 lg:border-l-4 border-surface-200 pl-0 lg:pl-8">
                                {build.desc || "Advanced computing architecture engineered for extreme workloads and high-fidelity operational requirements."}
                            </p>
                        </div>

                        {/* Hardware Component Registry */}
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-border-alpha pb-4">
                                <h3 className="text-xs font-black text-foreground uppercase tracking-[0.4em]">Hardware Components</h3>
                                <span className="text-[9px] font-mono text-surface-400">STATUS: VERIFIED</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {specsArray.map((spec, i) => (
                                    <div key={i} className="flex items-center gap-5 p-5 bg-transparent rounded-2xl border-2 border-surface-200 dark:border-white/10 hover:border-primary/40 transition-all group cursor-default">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-primary font-black shadow-sm group-hover:bg-primary group-hover:text-white transition-all text-xs border-2 border-surface-200 dark:border-white/10">
                                            {i + 1 < 10 ? `0${i + 1}` : i + 1}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <span className="text-[9px] font-black text-surface-400 uppercase tracking-widest">Component {i + 1}</span>
                                            <span className="font-bold text-foreground uppercase tracking-wider text-xs md:text-sm">{spec}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Acquisition Module */}
                        <div className="pt-10 border-t border-border-alpha flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest mb-1">Total Price</span>
                                    <PriceDisplay
                                        price={build.price}
                                        className="text-4xl md:text-5xl font-black text-foreground tracking-tighter"
                                    />
                                </div>
                                <div className="w-px h-12 bg-border-alpha" />
                                <div className="hidden md:flex flex-col">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-1">Status</span>
                                    <span className="text-xs font-bold text-foreground uppercase tracking-widest">Ready to Ship</span>
                                </div>
                            </div>

                            <BuildBuyButton build={build} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}