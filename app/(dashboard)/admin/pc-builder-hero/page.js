"use client";

export default function PCBuilderHeroSettings() {
    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-surface p-8 rounded-2xl shadow-sm border border-surface-100 space-y-4 text-center">
                <div className="text-4xl">🎬</div>
                <h1 className="text-2xl font-black text-surface-900">PC Builder Video</h1>
                <p className="text-surface-500 font-medium">
                    Video fayllar hozircha kod orqali boshqariladi.
                </p>
                <div className="bg-surface-50 rounded-xl p-4 text-left border border-surface-100">
                    <p className="text-xs font-mono text-surface-600">
                        📁 <strong>Fayl:</strong> app/(shop)/pc-builder/page.js
                    </p>
                    <p className="text-xs font-mono text-surface-600 mt-1">
                        🎥 <strong>Video 1:</strong> /videos/0508.mp4
                    </p>
                    <p className="text-xs font-mono text-surface-600 mt-1">
                        🎥 <strong>Video 2:</strong> /videos/0508 (2).mp4
                    </p>
                </div>
            </div>
        </div>
    );
}
