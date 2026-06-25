import ProductListing from "@/features/product/ProductListing";
import { 
    getProductsAction, 
    getCategoriesAction, 
    getProductsCountAction,
    getSearchProductsAction,
    getFilteredProductsAction
} from "@/lib/actions/product.actions";

export default async function ProductsPage({ searchParams }) {
    const { category, page = "1", search } = await searchParams;
    const currentPage = parseInt(page);

    let productsPromise;
    let countPromise;

    if (search) {
        productsPromise = getSearchProductsAction(search, 12);
        countPromise = Promise.resolve(null); // Count search natijasidan olinadi
    } else if (category) {
        productsPromise = getFilteredProductsAction({ categoryId: category, page: currentPage, pageSize: 12 });
        countPromise = getProductsCountAction(category);
    } else {
        productsPromise = getProductsAction(currentPage, 12);
        countPromise = getProductsCountAction();
    }

    const [products, allCategories, totalCount] = await Promise.all([
        productsPromise,
        getCategoriesAction(),
        countPromise
    ]);

    return (
        <div className="space-y-12 animate-fade-in pb-20 px-4 md:px-8">
            <ProductListing 
                initialProducts={products} 
                allCategories={allCategories} 
                totalProducts={search ? products.length : totalCount}
                currentPage={currentPage}
            />
        </div>
    );
}
