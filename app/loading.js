export default function Loading() {
    return (
        <div className="fixed top-0 left-0 right-0 z-[10000] pointer-events-none">
            {/* Top Red Progress Bar only */}
            <div className="h-[3px] bg-primary w-full shadow-[0_0_10px_rgba(227,30,36,0.5)] animate-progress-loading" />
        </div>
    );
}
