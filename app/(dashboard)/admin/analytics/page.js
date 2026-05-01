export default function AdminAnalyticsPage() {
    return (
        <div className="space-y-10">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-surface-900 tracking-tighter">Business Intelligence</h1>
                <p className="text-surface-500 font-medium text-sm font-bold">Deep dives into sales metrics and user behavior.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-premium p-10 min-h-[400px] flex flex-col items-center justify-center space-y-4 border border-surface-50">
                    <div className="text-5xl opacity-10">📊</div>
                    <p className="text-surface-300 font-bold italic">Sales Velocity Graph Placeholder</p>
                </div>
                <div className="bg-surface-900 text-white p-10 rounded-3xl shadow-2xl space-y-6">
                    <h3 className="text-xl font-black">Top Performers</h3>
                    <div className="space-y-4">
                        {[
                            { name: "MacBook Pro", share: "34%" },
                            { name: "RTX 4090", share: "28%" },
                            { name: "Logitech G Pro", share: "15%" },
                        ].map(item => (
                            <div key={item.name} className="space-y-1">
                                <div className="flex justify-between text-xs font-bold"><span className="text-surface-400">{item.name}</span><span>{item.share}</span></div>
                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                    <div className="bg-primary h-full" style={{ width: item.share }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
