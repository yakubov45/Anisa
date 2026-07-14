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
    const { category, brand, page = "1", search, minPrice, maxPrice, sort = "newest" } = await searchParams;
    const currentPage = parseInt(page);
    const minP = minPrice ? parseInt(minPrice) : undefined;
    const maxP = maxPrice ? parseInt(maxPrice) : undefined;

    let productsPromise;
    let countPromise;

    if (search) {
        productsPromise = getSearchProductsAction(search, 12);
        countPromise = Promise.resolve(null); // Count search natijasidan olinadi
    } else if (category || brand || minP !== undefined || maxP !== undefined || sort !== "newest") {
        productsPromise = getFilteredProductsAction({ categoryId: category, brand, minPrice: minP, maxPrice: maxP, sortBy: sort, page: currentPage, pageSize: 12 });
        countPromise = getProductsCountAction({ categoryId: category, brand, sortBy: sort, minPrice: minP, maxPrice: maxP });
    } else {
        productsPromise = getProductsAction(currentPage, 12);
        countPromise = getProductsCountAction({});
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
