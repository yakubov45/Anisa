"use client";

import ProductCard from "./ProductCard"
import { useTranslation } from "@/lib/LanguageContext";

export default function ProductGrid({ products, badge = null, rating = null }) {
    const { t } = useTranslation();

    if (!products || products.length === 0) {
        return (
            <div className="bg-surface-50 rounded-3xl border border-dashed border-surface-200 py-20 text-center animate-fade-in px-4">
                <div className="text-4xl mb-4 opacity-20">📦</div>
                <h3 className="text-surface-900 font-bold">{t('grid_no_products')}</h3>
                <p className="text-surface-500 text-sm mt-1 max-w-xs mx-auto font-medium">{t('grid_no_products_desc')}</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {products.map(p => (
                <ProductCard key={p.id} product={p} badge={badge} rating={rating} />
            ))}
        </div>
    )
}
