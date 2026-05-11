import ProductListing from "@/features/product/ProductListing";
import { getProductsAction, getCategoriesAction, getProductsCountAction } from "@/lib/actions/product.actions";



export default async function ProductsPage({ searchParams }) {
    const { category, page = "1" } = await searchParams;
    const currentPage = parseInt(page);

    const [products, allCategories, totalCount] = await Promise.all([
        getProductsAction(currentPage, 12),
        getCategoriesAction(),
        getProductsCountAction(category)
    ]);

    return (
        <div className="space-y-12 animate-fade-in pb-20 md:pt-15 px-4 md:px-8">
            <ProductListing 
                initialProducts={products} 
                allCategories={allCategories} 
                totalProducts={totalCount}
                currentPage={currentPage}
            />
        </div>
    );
}
