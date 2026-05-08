export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center space-y-12 animate-fade-in overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

            {/* Floating Components Container */}
            <div className="relative flex items-end gap-6 sm:gap-10 z-10 h-32">
                
                {/* CPU */}
                <div 
                    className="flex flex-col items-center gap-3 animate-bounce" 
                    style={{ animationDuration: '3s', animationDelay: '0ms' }}
                >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-surface dark:bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)] text-primary">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                            <line x1="20" y1="9" x2="23" y2="9" />
                            <line x1="20" y1="14" x2="23" y2="14" />
                            <line x1="1" y1="9" x2="4" y2="9" />
                            <line x1="1" y1="14" x2="4" y2="14" />
                        </svg>
                    </div>
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-surface-400">CPU</span>
                </div>

                {/* GPU (Center, larger) */}
                <div 
                    className="flex flex-col items-center gap-3 animate-bounce" 
                    style={{ animationDuration: '3s', animationDelay: '500ms' }}
                >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface dark:bg-zinc-900 border border-white/10 rounded-3xl flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)] text-white relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/5 animate-pulse" />
                        <svg className="w-8 h-8 sm:w-10 sm:h-10 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="8" cy="12" r="3" />
                            <circle cx="16" cy="12" r="3" />
                            <line x1="6" y1="18" x2="6" y2="21" />
                            <line x1="10" y1="18" x2="10" y2="21" />
                            <line x1="14" y1="18" x2="14" y2="21" />
                            <line x1="18" y1="18" x2="18" y2="21" />
                        </svg>
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white">GPU</span>
                </div>

                {/* RAM */}
                <div 
                    className="flex flex-col items-center gap-3 animate-bounce" 
                    style={{ animationDuration: '3s', animationDelay: '1000ms' }}
                >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-surface dark:bg-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.2)] text-primary">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="8" width="20" height="8" rx="1" />
                            <line x1="4" y1="16" x2="4" y2="18" />
                            <line x1="8" y1="16" x2="8" y2="18" />
                            <line x1="12" y1="16" x2="12" y2="18" />
                            <line x1="16" y1="16" x2="16" y2="18" />
                            <line x1="20" y1="16" x2="20" y2="18" />
                            <rect x="4" y="10" width="4" height="4" rx="0.5" />
                            <rect x="10" y="10" width="4" height="4" rx="0.5" />
                            <rect x="16" y="10" width="4" height="4" rx="0.5" />
                        </svg>
                    </div>
                    <span className="text-[9px] font-black tracking-[0.2em] uppercase text-surface-400">RAM</span>
                </div>
                
            </div>

            {/* Loading Text */}
            <div className="flex flex-col items-center space-y-5 z-10 relative mt-8">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    <h2 className="text-xs sm:text-sm font-black text-white uppercase tracking-[0.4em]">
                        Loading Components
                    </h2>
                    <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: '200ms' }} />
                </div>
                
                {/* Clean Progress Bar */}
                <div className="w-48 h-1 bg-surface-50 dark:bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-primary animate-progress-loading" />
                </div>
            </div>
        </div>
    )
}

