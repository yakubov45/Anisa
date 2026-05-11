"use client";

import Link from 'next/link';
import { useTranslation } from "@/lib/LanguageContext";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center relative overflow-hidden selection:bg-primary selection:text-white rounded-[3rem] bg-black/40 border border-white/5 backdrop-blur-xl">
            {/* Custom Styles for Glitch & Noise */}
            <style dangerouslySetInnerHTML={{
                __html: `
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
                    100% { transform: translateY(500px); }
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
                    opacity: 0.05;
                }
            `}} />

            {/* Background Effects */}
            <div className="absolute inset-0 noise pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[40px] scanline pointer-events-none opacity-30 z-10" />

            {/* Vignette / Ambient Dark */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#000000_100%)] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-20">

                {/* Error Badge */}
                <div className="border border-primary/30 bg-primary/10 text-primary px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.3em] uppercase mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)] backdrop-blur-md">
                    {t('error_404_title')}
                </div>

                {/* Glitch 404 text */}
                <h1
                    className="text-7xl sm:text-9xl md:text-[12rem] font-black text-white tracking-tighter relative glitch-text select-none leading-none mb-8 drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]"
                    data-text="404"
                >
                    404
                </h1>

                {/* Status Text */}
                <div className="space-y-4 mb-12 max-w-md">
                    <h2 className="text-xl sm:text-3xl font-black text-white uppercase tracking-[0.3em] leading-tight">
                        {t('error_404_subtitle')}
                    </h2>
                    <p className="text-white/40 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] leading-relaxed">
                        {t('error_404_desc')}
                    </p>
                </div>

                {/* Return Button */}
                <Link
                    href="/"
                    className="group relative px-10 sm:px-16 py-5 bg-primary text-white font-black text-[11px] uppercase tracking-[0.3em] overflow-hidden transition-all duration-500 rounded-2xl shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:shadow-primary/50 hover:scale-[1.02] active:scale-95"
                >
                    <span className="relative z-10 flex items-center gap-3">
                        {t('error_404_return')}
                        <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </span>

                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
            </div>
        </div>
    )
}