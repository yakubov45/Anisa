"use client";

import { useState, useEffect } from "react";

export default function IntroOverlay() {
    const [isVisible, setIsVisible] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [loadingText, setLoadingText] = useState("SYSTEM BOOT SEQUENCE INITIATED...");

    const texts = [
        "SYSTEM BOOT SEQUENCE INITIATED...",
        "VALIDATING HARDWARE COMPONENTS...",
        "ESTABLISHING SECURE CONNECTION...",
        "LOADING UI PROTOCOLS...",
        "SYSTEM READY."
    ];

    useEffect(() => {
        setIsMounted(true);

        // Check if intro was already shown in this session
        const introShown = sessionStorage.getItem("onepc_intro_shown");
        if (introShown) {
            setIsVisible(false);
            return;
        }
        
        let index = 0;
        const textInterval = setInterval(() => {
            index++;
            if (index < texts.length) {
                setLoadingText(texts[index]);
            }
        }, 600);

        // Automatically hide after 3.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            sessionStorage.setItem("onepc_intro_shown", "true");
        }, 3500);

        return () => {
            clearTimeout(timer);
            clearInterval(textInterval);
        };
    }, []);

    if (!isMounted) return null;

    return (
        <div 
            className={`fixed inset-0 z-[9999] bg-[#050A15] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
                isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none scale-105 blur-md'
            }`}
        >
            {/* Minimalist Tech Spinner */}
            <div className="relative flex items-center justify-center w-40 h-40 mb-8">
                {/* Background Ambient Glow */}
                <div className="absolute inset-0 bg-primary/10 blur-[50px] rounded-full animate-pulse" />

                {/* Outer Ring */}
                <svg className="absolute inset-0 w-full h-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="4 4" />
                </svg>

                {/* Middle Rotating Dash */}
                <svg className="absolute w-32 h-32 animate-[spin_3s_ease-in-out_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className="text-primary/50" strokeWidth="1" strokeDasharray="30 150" strokeLinecap="round" />
                </svg>

                {/* Inner Fast Ring */}
                <svg className="absolute w-24 h-24 animate-[spin_2s_linear_infinite_reverse]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2" strokeDasharray="60 200" strokeLinecap="round" />
                </svg>

                {/* Core Logo */}
                <div className="absolute flex flex-col items-center justify-center animate-pulse">
                    <span className="text-2xl font-black tracking-tighter leading-none">
                        <span className="text-primary">ONE</span>
                        <span className="text-white">PC</span>
                    </span>
                    <span className="text-[6px] text-white/40 tracking-[0.4em] mt-1 font-mono">SYS.CORE</span>
                </div>
            </div>

            {/* Technical Text Container */}
            <div className="flex flex-col items-center gap-4">
                {/* Progress Bar Line */}
                <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 h-full bg-primary transition-all duration-300 ease-out" 
                        style={{ width: `${(texts.indexOf(loadingText) + 1) * 20}%` }} 
                    />
                </div>
                
                {/* Dynamic Status Text */}
                <span className="text-[9px] md:text-[10px] font-mono text-primary uppercase tracking-[0.3em] md:tracking-[0.5em] text-center px-4">
                    {loadingText}
                </span>
            </div>
            
        </div>
    );
}
