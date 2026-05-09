import ProductListing from "@/features/product/ProductListing";
import { getProducts, getCategories } from "@/features/product/api";



export default async function ProductsPage({ searchParams }) {
    const { category } = await searchParams;

    const [products, allCategories] = await Promise.all([
        getProducts(null, category),
        getCategories()
    ]);

    return (
        <div className="space-y-12 animate-fade-in pb-20 md:pt-15 px-4 md:px-8">
            <ProductListing initialProducts={products} allCategories={allCategories} />
        </div>
    );
}
