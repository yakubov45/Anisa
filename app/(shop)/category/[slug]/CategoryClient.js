"use client";
import React from "react";
import { useTranslation } from "@/lib/LanguageContext";
import ProductGrid from "@/features/product/ProductGrid";

export default function CategoryClient({ slug, products }) {
    const { t } = useTranslation();

    // Dynamically retrieve localized category name (e.g. category_monitors, category_gpus)
    const categoryKey = `category_${slug.toLowerCase()}`;
    const localizedCategoryName = t(categoryKey) !== categoryKey ? t(categoryKey) : slug;

    // Localized description text
    const localizedDesc = t("category_showing_desc")
        ? t("category_showing_desc").replace("{category}", localizedCategoryName)
        : `Showing the best ${localizedCategoryName} in the market.`;

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter capitalize">
                        {localizedCategoryName}
                    </h1>
                    <p className="text-surface-500 font-medium italic">
                        {localizedDesc}
                    </p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-surface border border-surface-100 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary dark:bg-white/5 dark:border-white/10 dark:text-foreground">
                        <option>{t("category_sort_newest") || "Sort by: Newest"}</option>
                        <option>{t("category_sort_price_low") || "Price: Low to High"}</option>
                        <option>{t("category_sort_price_high") || "Price: High to Low"}</option>
                    </select>
                </div>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
