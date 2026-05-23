"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/LanguageContext";
import { getBusinessAnalyticsAction } from "@/lib/actions/analytics.actions";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminAnalyticsPage() {
    const { t } = useTranslation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState("30d");
    const [fetching, setFetching] = useState(false);
    const [chartMode, setChartMode] = useState("daily"); // daily or cumulative

    const fetchAnalytics = async (selectedRange) => {
        setFetching(true);
        const result = await getBusinessAnalyticsAction(selectedRange);
        if (result.success) {
            setData(result.stats);
        }
        setLoading(false);
        setFetching(false);
    };

    useEffect(() => {
        fetchAnalytics(range);
    }, [range]);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(val);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-2">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h3 className="text-xl font-black uppercase tracking-widest text-foreground">Ma'lumot topilmadi</h3>
                <p className="text-sm font-bold text-surface-500">Analitika ma'lumotlarini yuklashda xatolik yuz berdi yoki ma'lumot yo'q.</p>
                <button 
                    onClick={() => fetchAnalytics(range)}
                    className="mt-4 px-6 py-3 bg-surface-100 hover:bg-surface-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest transition-colors"
                >
                    Qayta urinish
                </button>
            </div>
        );
    }

    // SVG Chart Logic with Cumulative Support
    const chartWidth = 1000;
    const chartHeight = 300;
    const padding = 60;

    let displayPoints = [];
    if (chartMode === "cumulative") {
        let runningTotal = 0;
        displayPoints = data.salesChartData.map(d => {
            runningTotal += d.amount;
            return { ...d, amount: runningTotal };
        });
    } else {
        displayPoints = data.salesChartData;
    }

    const maxVal = Math.max(...displayPoints.map(d => d.amount), 1) * 1.1;
    
    const points = displayPoints.map((d, i) => {
        const x = (i / (displayPoints.length - 1)) * (chartWidth - padding * 2) + padding;
        const y = chartHeight - ((d.amount / maxVal) * (chartHeight - padding * 2) + padding);
        return { x, y, ...d };
    });

    const getPath = (pts) => {
        if (pts.length < 2) return "";
        let d = `M ${pts[0].x} ${pts[0].y}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i];
            const p1 = pts[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            d += ` C ${cp1x} ${p0.y}, ${cp2x} ${p1.y}, ${p1.x} ${p1.y}`;
        }
        return d;
    };

    const pathData = getPath(points);

    return (
        <div className="space-y-10 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-surface-900 dark:text-white tracking-tighter uppercase">{t('ana_biz_intel')}</h1>
                    <p className="text-surface-500 font-bold italic text-sm">{t('ana_biz_intel_desc')}</p>
                </div>
                
                <div className="bg-surface dark:bg-zinc-900 p-1.5 rounded-2xl border border-surface-100 dark:border-white/5 flex gap-1 shadow-inner">
                    {[
                        { id: "7d", label: "7D" },
                        { id: "30d", label: "30D" },
                        { id: "90d", label: "3M" },
                        { id: "1y", label: "1Y" },
                    ].map(r => (
                        <button
                            key={r.id}
                            onClick={() => setRange(r.id)}
                            className={`px-6 py-2.5 rounded-xl font-black text-[10px] tracking-widest transition-all ${
                                range === r.id 
                                ? "bg-primary text-white shadow-lg shadow-primary/20" 
                                : "text-surface-400 hover:text-surface-900 dark:hover:text-white"
                            }`}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                    {[
                        { label: t('ana_total_revenue'), value: formatCurrency(data.totalRevenue), color: "text-primary", icon: "💰" },
                        { label: t('ana_avg_order'), value: formatCurrency(data.avgOrderValue), color: "text-emerald-500", icon: "📈" },
                        { label: t('ana_total_orders'), value: data.totalOrders, color: "text-amber-500", icon: "📦" },
                    ].map((stat, i) => (
                        <motion.div 
                            key={`${stat.label}-${range}`}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-surface dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-surface-50 dark:border-white/5 shadow-premium flex items-center justify-between group overflow-hidden relative"
                        >
                            <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-10 transition-opacity text-8xl grayscale pointer-events-none">
                                {stat.icon}
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-black text-surface-400 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="bg-surface dark:bg-zinc-900 rounded-[3rem] shadow-premium p-10 border border-surface-50 dark:border-white/5 relative overflow-hidden">
                {fetching && (
                    <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-20 flex items-center justify-center">
                        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
                    </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight text-surface-900 dark:text-white">{t('ana_sales_graph')}</h3>
                        <p className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">
                            {chartMode === "daily" ? t('ana_daily_vol') : t('ana_growth_traj')}
                        </p>
                    </div>
                    
                    {/* Chart Mode Toggle */}
                    <div className="flex bg-surface-100 dark:bg-black/40 p-1 rounded-xl border border-white/5">
                        <button 
                            onClick={() => setChartMode("daily")}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${chartMode === "daily" ? "bg-white dark:bg-zinc-800 shadow-sm text-primary" : "text-surface-400"}`}
                        >
                            {t('ana_daily')}
                        </button>
                        <button 
                            onClick={() => setChartMode("cumulative")}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${chartMode === "cumulative" ? "bg-white dark:bg-zinc-800 shadow-sm text-primary" : "text-surface-400"}`}
                        >
                            {t('ana_growth')}
                        </button>
                    </div>
                </div>

                <div className="relative w-full h-[350px] mt-10">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                        {[0, 0.25, 0.5, 0.75, 1].map(v => (
                            <g key={v}>
                                <line 
                                    x1={padding} 
                                    y1={chartHeight - (v * (chartHeight - padding * 2) + padding)} 
                                    x2={chartWidth - padding} 
                                    y2={chartHeight - (v * (chartHeight - padding * 2) + padding)} 
                                    stroke="currentColor" 
                                    strokeOpacity="0.05"
                                />
                                <text x={0} y={chartHeight - (v * (chartHeight - padding * 2) + padding)} className="text-[10px] fill-surface-400 font-bold" dominantBaseline="middle">
                                    {formatCurrency(maxVal * v)}
                                </text>
                            </g>
                        ))}

                        <defs>
                            <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0070f3" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#0070f3" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        
                        <motion.path 
                            key={`area-${chartMode}-${range}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            d={`${pathData} L ${points[points.length-1].x} ${chartHeight-padding} L ${points[0].x} ${chartHeight-padding} Z`} 
                            fill="url(#mainGradient)"
                        />

                        <motion.path 
                            key={`path-${chartMode}-${range}`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            d={pathData} 
                            fill="none" 
                            stroke="#0070f3" 
                            strokeWidth="6" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                            className="drop-shadow-2xl"
                        />

                        {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((p, i) => (
                            <text key={i} x={p.x} y={chartHeight} textAnchor="middle" className="text-[10px] fill-surface-400 font-black uppercase tracking-widest">
                                {new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </text>
                        ))}

                        {points.map((p, i) => (
                            <g key={i} className="group cursor-pointer">
                                <circle cx={p.x} cy={p.y} r="15" fill="transparent" />
                                <circle cx={p.x} cy={p.y} r="6" fill="#0070f3" stroke="white" strokeWidth="3" className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                <foreignObject x={p.x - 50} y={p.y - 70} width="100" height="60" className="opacity-0 group-hover:opacity-100 transition-all pointer-events-none">
                                    <div className="bg-zinc-900 text-white p-2 rounded-xl text-[10px] font-black text-center shadow-2xl border border-white/10">
                                        <div className="text-primary">{formatCurrency(p.amount)}</div>
                                        <div className="text-[8px] opacity-50 mt-1 uppercase">{new Date(p.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                    </div>
                                </foreignObject>
                            </g>
                        ))}
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 <div className="bg-zinc-900 text-white p-10 rounded-[3rem] shadow-2xl space-y-8 flex flex-col justify-between border border-white/5">
                    <div className="space-y-6">
                        <h3 className="text-xl font-black uppercase tracking-tight text-white">{t('ana_top_performers')}</h3>
                        <div className="space-y-6">
                            {data.topPerformers.map((item, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={item.name} 
                                    className="space-y-2"
                                >
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em]">
                                        <span className="text-zinc-400 truncate max-w-[150px]">{item.name}</span>
                                        <span className="text-white">{formatCurrency(item.revenue)}</span>
                                    </div>
                                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className="bg-primary h-full rounded-full" 
                                            style={{ width: `${(item.revenue / (data.topPerformers[0]?.revenue || 1)) * 100}%` }} 
                                        />
                                    </div>
                                    <p className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">{item.quantity} {t('ana_units_deployed')}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/10">
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">{t('ana_op_status')}</p>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(data.statusBreakdown).map(([status, count]) => (
                                <div key={status} className="bg-white/5 p-2 rounded-xl text-center border border-white/5">
                                    <p className="text-white font-black text-sm">{count}</p>
                                    <p className="text-[7px] text-zinc-300 uppercase font-black truncate" title={status}>
                                        {t(`ord_status_${status.toLowerCase()}`) || status}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 bg-primary p-12 rounded-[3rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-12 opacity-10 text-[12rem] font-black pointer-events-none">PC</div>
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-5xl font-black tracking-tighter uppercase leading-tight">{t('ana_strat_node')}</h2>
                        <p className="max-w-md text-white/70 font-bold leading-relaxed">
                            {t('ana_strat_desc')}
                        </p>
                        <div className="flex gap-4">
                            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1">{t('ana_health_status')}</p>
                                <p className="text-xl font-black">98.4%</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1">{t('ana_latency')}</p>
                                <p className="text-xl font-black">12ms</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
