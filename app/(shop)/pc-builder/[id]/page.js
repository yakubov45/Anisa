import { getPreBuiltById } from "@/features/product/api"
import Link from "next/link"

export default async function PreBuiltDetailPage({ params }) {
    const { id } = await params;
    const build = await getPreBuiltById(id);

    if (!build) {
        return <div className="pt-40 text-center">Build topilmadi.</div>;
    }

    return (
        <div className="pt-40 pb-20 space-y-16 animate-fade-in">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Link href="/pc-builder" className="text-[10px] font-black text-surface-400 hover:text-primary uppercase tracking-[0.3em] transition-all">
                    PC_BUILDER
                </Link>
                <div className="w-4 h-[1px] bg-border-alpha" />
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    SYSTEM_DETAILS
                </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-20">
                {/* Left: Visuals */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div className="relative aspect-square bg-surface-50 border border-border-alpha rounded-[3rem] p-12 flex items-center justify-center overflow-hidden shadow-2xl">
                        <img src={build.image} alt={build.name} className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)]" />
                        <div className="absolute top-10 left-10 bg-primary/10 border border-primary/20 text-primary text-[10px] font-black px-6 py-2.5 rounded-full uppercase tracking-widest">
                            Verified_System_v1.2
                        </div>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="w-full lg:w-1/2 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-1 bg-primary rounded-full" />
                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{build.target}</span>
                        </div>
                        <h1 className="text-6xl font-black text-foreground tracking-tighter uppercase leading-none">{build.name}</h1>
                        <p className="text-surface-500 font-medium text-lg leading-relaxed max-w-xl">
                            {build.desc}
                        </p>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xs font-black text-foreground uppercase tracking-[0.3em] border-b border-border-alpha pb-4">Detallar_Ro'yxati</h3>
                        <div className="grid grid-cols-1 gap-4">
                            {build.specs.split(',').map((spec, i) => (
                                <div key={i} className="flex items-center justify-between p-6 bg-surface-50 rounded-2xl border border-border-alpha hover:border-primary/30 transition-all">
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary font-black shadow-sm">0{i+1}</div>
                                        <span className="font-bold text-foreground uppercase tracking-widest text-sm">{spec.trim()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                                        <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">OK</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 border-t border-border-alpha flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-surface-400 uppercase tracking-widest">Umumiy Narx</span>
                            <span className="text-4xl font-black text-foreground tracking-tighter">$ {build.price}</span>
                        </div>
                        <button className="bg-foreground text-background font-black text-xs uppercase tracking-[0.3em] px-12 py-6 rounded-2xl hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl">
                            SAVATCHAGA_QO'SHISH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
