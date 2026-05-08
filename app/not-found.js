import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center overflow-hidden selection:bg-primary selection:text-white">
            {/* Custom Styles for Glitch & Noise */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes glitch-anim {
                    0% { clip-path: inset(20% 0 80% 0); transform: translate(-2px, 1px); }
                    20% { clip-path: inset(60% 0 10% 0); transform: translate(2px, -1px); }
                    40% { clip-path: inset(40% 0 50% 0); transform: translate(-2px, 2px); }
                    60% { clip-path: inset(80% 0 5% 0); transform: translate(2px, -2px); }
                    80% { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 1px); }
                    100% { clip-path: inset(30% 0 50% 0); transform: translate(1px, -1px); }
                }
                @keyframes scanline {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100vh); }
                }
                .glitch-text {
                    position: relative;
                }
                .glitch-text::before, .glitch-text::after {
                    content: attr(data-text);
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: transparent;
                }
                .glitch-text::before {
                    left: 2px;
                    text-shadow: -2px 0 #ff003c;
                    animation: glitch-anim 2s infinite linear alternate-reverse;
                }
                .glitch-text::after {
                    left: -2px;
                    text-shadow: -2px 0 #00f0ff;
                    animation: glitch-anim 3s infinite linear alternate-reverse;
                }
                .scanline {
                    background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.05) 50%, rgba(255,255,255,0));
                    animation: scanline 8s linear infinite;
                }
                .noise {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.15;
                }
            `}} />

            {/* Background Effects */}
            <div className="absolute inset-0 noise pointer-events-none" />
            <div className="absolute inset-0 w-full h-[20px] scanline pointer-events-none opacity-50 z-50" />
            
            {/* Vignette / Ambient Dark */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_100%)] opacity-80 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
                
                {/* Error Badge */}
                <div className="border border-red-500/30 bg-red-500/10 text-red-500 px-4 py-1.5 rounded-sm text-[10px] font-mono tracking-[0.3em] uppercase mb-10 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)] backdrop-blur-sm relative overflow-hidden">
                    <span className="relative z-10">⚠️ CRITICAL_SYSTEM_FAILURE</span>
                </div>

                {/* Glitch 404 text */}
                <h1 
                    className="text-8xl sm:text-[14rem] font-black text-white tracking-tighter relative glitch-text select-none leading-none mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                    data-text="404"
                >
                    404
                </h1>

                {/* Status Text */}
                <div className="space-y-3 mb-14">
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-[0.4em] drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        SYSTEM ERROR
                    </h2>
                    <p className="text-surface-400 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em]">
                        PAGE_NOT_FOUND // MEMORY_CORRUPTION_DETECTED
                    </p>
                </div>

                {/* Return Button */}
                <Link 
                    href="/" 
                    className="group relative px-8 sm:px-12 py-4 sm:py-5 bg-transparent text-white font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] overflow-hidden transition-all duration-300 border border-white/20 hover:border-primary hover:shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                >
                    {/* Hover scanner */}
                    <div className="absolute inset-0 w-full h-full bg-primary/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out skew-x-12" />
                    
                    <span className="relative z-10 flex items-center gap-4">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(var(--primary),1)]" />
                        REBOOT_SYSTEM // RETURN_HOME
                    </span>
                    
                    {/* Tech Corners */}
                    <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/40 group-hover:border-primary transition-colors" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/40 group-hover:border-primary transition-colors" />
                </Link>
            </div>
        </div>
    )
}

