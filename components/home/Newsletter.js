export default function Newsletter() {
    return (
        <section className="bg-primary rounded-[3rem] p-12 md:p-24 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="space-y-4 text-center md:text-left">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">Stay Connected.</h2>
                    <p className="text-white/70 font-bold uppercase text-xs tracking-widest">Get exclusive hardware drops and deals.</p>
                </div>
                <div className="w-full max-w-md flex flex-col sm:flex-row gap-4">
                    <input 
                        type="email" 
                        placeholder="your@email.com"
                        className="flex-1 bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-white placeholder:text-white/40 focus:bg-white/20 outline-none font-bold text-sm text-center sm:text-left"
                    />
                    <button className="bg-white text-primary font-black px-8 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all uppercase text-[10px] tracking-widest shadow-2xl">
                        Subscribe
                    </button>
                </div>
            </div>
        </section>
    );
}
