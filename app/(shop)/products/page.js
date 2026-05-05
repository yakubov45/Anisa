import ProductListing from "@/features/product/ProductListing";
import { getProducts, getCategories } from "@/features/product/api";

export const revalidate = 3600; // Cache catalog for 1 hour

export default async function ProductsPage({ searchParams }) {
    const { category } = await searchParams;

    const [products, allCategories] = await Promise.all([
        getProducts(null, category),
        getCategories()
    ]);

    return (
        <div className="space-y-12 animate-fade-in pb-20 md:pt-15 px-4 md:px-8">
            <div className="space-y-3">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Shop</span>
                </div>
                <h1 className="text-5xl font-black text-foreground tracking-tighter uppercase">Our Products</h1>
                <p className="text-foreground/60 font-medium max-w-2xl text-sm leading-relaxed">
                    Access our high-performance hardware inventory. Filter by department or budget constraints to find the specific components required for your next deployment.
                </p>
            </div>

            <ProductListing initialProducts={products} allCategories={allCategories} />
        </div>
    );
}
