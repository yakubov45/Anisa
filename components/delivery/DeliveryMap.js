"use client";

export default function DeliveryMap({ city, street }) {
    return (
        <div className="relative w-full h-[350px] bg-surface-100 rounded-2xl overflow-hidden border border-white/5 group shadow-inner">
            {/* Dark Professional Map Overlay */}
            <div className="absolute inset-0 bg-[url('https://api.maptiler.com/maps/basic-v2-dark/static/69.24,41.31,12/800x400.png?key=get_your_own_key')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000 opacity-40 group-hover:opacity-70" />

            {/* Tech Radar Grid */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />

            {/* Pulsing Tactical Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <div className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-lg shadow-2xl mb-3 z-10 whitespace-nowrap border border-white/20 uppercase tracking-[0.2em]">
                    TARGET_COORD: {city}
                </div>
                <div className="relative">
                    <div className="w-5 h-5 bg-primary rounded-full z-10 relative border-2 border-white shadow-[0_0_15px_rgba(227,30,36,0.8)]" />
                    <div className="absolute inset-0 w-5 h-5 bg-primary rounded-full animate-ping opacity-60 scale-150" />
                </div>
            </div>

            {/* Tactical Display Elements */}
            <div className="absolute top-6 right-6 flex flex-col gap-3">
                <div className="bg-surface-50/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/5">
                    <p className="text-[8px] font-black text-surface-500 uppercase tracking-widest">SIG_STRENGTH</p>
                    <div className="flex gap-1 mt-1">
                        {[1, 1, 1, 0].map((v, i) => <div key={i} className={`w-3 h-1 rounded-sm ${v ? 'bg-primary' : 'bg-surface-200'}`} />)}
                    </div>
                </div>
            </div>

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent h-32" />
        </div>
    );
}
