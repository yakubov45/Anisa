"use client";

import { useState, useEffect } from "react";
import { getActivityLogs } from "@/lib/services/activity.service";
import { formatDate } from "@/lib/utils";

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getActivityLogs();
            setLogs(data);
        };
        fetch();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in pt-6">
            <div className="space-y-3 border-l-4 border-primary pl-8">
                <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase leading-none">Security Audit</h1>
                <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">Forensic logging of administrative system changes.</p>
            </div>

            <div className="bg-surface-50 rounded-2xl shadow-premium border border-white/5 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

                <div className="p-10 border-b border-white/5 bg-surface-100/30 flex justify-between items-center relative z-10">
                    <h3 className="font-black text-white uppercase tracking-[0.4em] text-[10px]">Active_System_Log</h3>
                    <button className="bg-white/5 border border-white/10 text-surface-400 px-6 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-all">EXPORT_AUDIT_CSV</button>
                </div>
                <div className="divide-y divide-white/5 relative z-10">
                    {logs.length === 0 ? (
                        <div className="p-20 text-center text-surface-500 italic uppercase text-[10px] tracking-[0.4em] bg-surface-100/10">Null registry found // System awaiting events</div>
                    ) : (
                        logs.map(log => (
                            <div key={log.id} className="p-8 flex items-start gap-10 hover:bg-surface-100/40 transition-all group">
                                <div className="w-14 h-14 rounded-xl bg-surface-100 flex items-center justify-center text-xl grayscale group-hover:grayscale-0 transition-all border border-white/5 shadow-inner">
                                    {log.action === 'login' ? '🔑' : '📦'}
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="font-black text-white tracking-widest text-xs uppercase">{log.action}</p>
                                            <p className="text-[9px] font-mono text-surface-500 font-black uppercase tracking-widest">{log.id.toUpperCase()}</p>
                                        </div>
                                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-lg border border-primary/20">
                                            {formatDate(log.timestamp?.toDate())}
                                        </p>
                                    </div>
                                    <p className="text-sm text-surface-400 font-medium leading-relaxed">
                                        <span className="font-black text-white uppercase tracking-tight">{log.userName}</span>
                                        <span className="mx-2 text-surface-600 font-mono">::</span>
                                        {log.details}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
