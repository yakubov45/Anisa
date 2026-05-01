export default function Loading() {
    return (
        <div className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center space-y-8 animate-fade-in">
            <div className="relative">
                {/* Outer Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
                
                {/* Logo Container */}
                <div className="relative bg-surface-50 border border-border-alpha p-8 rounded-3xl shadow-2xl overflow-hidden group">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]" />
                    
                    {/* The Logo */}
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-primary/30 relative z-10 animate-bounce-slow">
                        1
                    </div>
                    
                    {/* Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan" />
                </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
                <h2 className="text-[10px] font-black text-foreground uppercase tracking-[0.6em] animate-pulse">
                    Initializing_System
                </h2>
                <div className="w-48 h-1 bg-surface-100 rounded-full overflow-hidden border border-border-alpha">
                    <div className="h-full bg-primary animate-progress-loading" />
                </div>
                <p className="text-surface-500 text-[8px] font-bold uppercase tracking-widest font-mono">
                    Hardware_Check_In_Progress...
                </p>
            </div>
        </div>
    )
}
