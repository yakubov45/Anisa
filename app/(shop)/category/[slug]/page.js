import ProductGrid from "@/features/product/ProductGrid";
import { productService } from "@/lib/services/product.service";

export const revalidate = 3600; // Cache category for 1 hour

export default async function CategoryPage({ params }) {
    const { slug } = params;
    const products = await productService.getAll({ category: slug });

    return (
        <div className="space-y-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-surface-900 tracking-tighter capitalize">{slug}</h1>
                    <p className="text-surface-500 font-medium italic">Showing the best {slug} in the market.</p>
                </div>
                <div className="flex gap-4">
                    <select className="bg-surface border border-surface-100 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-primary">
                        <option>Sort by: Newest</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
