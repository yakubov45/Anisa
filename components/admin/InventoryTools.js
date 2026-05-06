"use client";

import { logActivity } from "@/lib/services/activity.service";
import { productService } from "@/lib/services/product.service";
import { useTranslation } from "@/lib/LanguageContext";

export default function AdminInventoryTools() {
    const { t } = useTranslation();
    const handleExport = async () => {
        const products = await productService.getAll();
        const csv = [
            ["ID", "Name", "Category", "Price", "Stock"],
            ...products.map(p => [p.id, p.name, p.category, p.price, p.countInStock])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'onepc_inventory.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        logActivity("SYSTEM", "Admin", "EXPORT", "Inventory CSV generated");
    };

    return (
        <div className="bg-surface-50 dark:bg-zinc-900/50 p-12 rounded-[2.5rem] shadow-premium border border-white/5 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />

            <div className="space-y-3 text-center md:text-left relative z-10">
                <h3 className="text-3xl font-black text-foreground tracking-tighter uppercase">{t('sys_management')}</h3>
                <p className="text-surface-500 font-bold uppercase text-[10px] tracking-[0.3em]">{t('sys_batch_nexus')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <button
                    onClick={handleExport}
                    className="bg-white dark:bg-white/10 text-surface-900 dark:text-white font-black py-8 rounded-xl hover:bg-primary hover:text-white transition-all flex flex-col items-center justify-center gap-4 group active:scale-95 shadow-xl"
                >
                    <span className="text-3xl group-hover:scale-125 transition-transform">📊</span>
                    <span className="uppercase text-[10px] tracking-[0.4em]">{t('sys_export_csv')}</span>
                </button>

                <div className="relative group cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="bg-surface-100 dark:bg-white/5 border-2 border-dashed border-white/5 py-8 rounded-xl flex flex-col items-center justify-center gap-4 group-hover:border-primary/40 transition-all">
                        <span className="text-3xl group-hover:rotate-12 transition-transform">📤</span>
                        <span className="uppercase text-[10px] tracking-[0.4em] font-black text-surface-500">{t('sys_init_import')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
