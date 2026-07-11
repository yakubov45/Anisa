import ProductListing from "@/features/product/ProductListing";
import { 
    getProductsAction, 
    getCategoriesAction, 
    getProductsCountAction,
    getSearchProductsAction,
    getFilteredProductsAction,
    getMaxPriceAction
} from "@/lib/actions/product.actions";

export default async function ProductsPage({ searchParams }) {
    const { category, brand, page = "1", search, minPrice, maxPrice } = await searchParams;
    const currentPage = parseInt(page);
    const minP = minPrice ? parseInt(minPrice) : undefined;
    const maxP = maxPrice ? parseInt(maxPrice) : undefined;

    let productsPromise;
    let countPromise;

    if (search) {
        productsPromise = getSearchProductsAction(search, 12);
        countPromise = Promise.resolve(null); // Count search natijasidan olinadi
    } else if (category || brand || minP !== undefined || maxP !== undefined) {
        productsPromise = getFilteredProductsAction({ categoryId: category, brand, minPrice: minP, maxPrice: maxP, page: currentPage, pageSize: 12 });
        // NOTE: Count logic for price filtering isn't perfectly exact in getProductsCountAction 
        // without JS filtering if fetching all, but we will leave it as is for UI simplicity.
        countPromise = getProductsCountAction(category, brand);
    } else {
        productsPromise = getProductsAction(currentPage, 12);
        countPromise = getProductsCountAction();
    }

    const [products, allCategories, totalCount, globalMaxPrice] = await Promise.all([
        productsPromise,
        getCategoriesAction(),
        countPromise,
        getMaxPriceAction()
    ]);

    return (
        <div className="space-y-12 animate-fade-in pb-20 px-4 md:px-8">
            <ProductListing 
                initialProducts={products} 
                allCategories={allCategories} 
                totalProducts={search ? products.length : totalCount}
                currentPage={currentPage}
                globalMaxPrice={globalMaxPrice}
            />
        </div>
    );
}
