export default function ReviewSection() {
    const reviews = [
        { name: "Alex Johnson", rating: 5, text: "The best PC I've ever owned. Performance is top-notch!" },
        { name: "Maria Silva", rating: 5, text: "Fast delivery and everything was well-packed. Recommended!" },
        { name: "Kevin Lee", rating: 4, text: "Great build quality, though the shipping took a day longer than expected." },
    ];

    return (
        <section className="space-y-12">
            <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">Reviews</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((r, i) => (
                    <div key={i} className="bg-surface-50 border border-white/5 p-8 rounded-[2rem] space-y-4 hover:bg-surface-100 transition-colors">
                        <div className="flex text-yellow-500 gap-1 text-xs">
                            {[...Array(r.rating)].map((_, i) => (
                                <span key={i}>★</span>
                            ))}
                        </div>
                        <p className="text-foreground/80 font-medium text-sm italic">"{r.text}"</p>
                        <div className="pt-4 border-t border-border-alpha">
                            <span className="font-black text-[10px] uppercase tracking-widest text-primary">{r.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
