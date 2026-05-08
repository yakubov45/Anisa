export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
            {/* Top Red Progress Bar */}
            <div className="h-[3px] bg-primary w-full shadow-[0_0_10px_rgba(var(--primary),0.5)] animate-progress-loading" />
            
            {/* Subtle Overlay to show activity */}
            <div className="fixed inset-0 bg-background/5 backdrop-blur-[2px] animate-pulse pointer-events-none" />
        </div>
    );
}
