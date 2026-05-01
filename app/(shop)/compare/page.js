export default function ComparePage() {
    return (
        <div className="space-y-12 animate-fade-in">
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-surface-900 tracking-tighter">Compare Hardware</h1>
                <p className="text-surface-500 font-medium font-bold italic">Settle the debate. Side-by-side spec comparison.</p>
            </div>

            <div className="bg-surface rounded-3xl shadow-premium border border-surface-50 overflow-hidden">
                <div className="grid grid-cols-4 border-b border-surface-100">
                    <div className="p-8 bg-surface-50 border-r border-surface-100 flex items-center justify-center font-black text-surface-400 text-xs uppercase tracking-widest">Model</div>
                    <div className="p-8 border-r border-surface-100 font-black text-center text-surface-900">MacBook Pro 14</div>
                    <div className="p-8 border-r border-surface-100 font-black text-center text-surface-900">ASUS ROG Strix</div>
                    <div className="p-8 bg-surface-50 flex items-center justify-center text-surface-300 font-bold italic">Empty Slot</div>
                </div>
                <div className="grid grid-cols-4 border-b border-surface-100 text-sm">
                    <div className="p-8 bg-surface-50 border-r border-surface-100 font-bold text-surface-500">Processor</div>
                    <div className="p-8 border-r border-surface-100 text-center font-medium">Apple M3 Pro</div>
                    <div className="p-8 border-r border-surface-100 text-center font-medium">Intel i7-13650HX</div>
                    <div className="p-8" />
                </div>
                <div className="grid grid-cols-4 border-b border-surface-100 text-sm">
                    <div className="p-8 bg-surface-50 border-r border-surface-100 font-bold text-surface-500">Memory</div>
                    <div className="p-8 border-r border-surface-100 text-center font-medium">18GB LPDDR5</div>
                    <div className="p-8 border-r border-surface-100 text-center font-medium">16GB DDR5</div>
                    <div className="p-8" />
                </div>
            </div>
        </div>
    );
}
