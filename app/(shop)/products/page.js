import ProductListing from "@/features/product/ProductListing";
import { 
    getProductsAction, 
    getCategoriesAction, 
    getProductsCountAction,
    getSearchProductsAction,
    getFilteredProductsAction,
    getMaxPriceAction
} from "@/lib/actions/product.actions";

export const revalidate = 60;

export const metadata = {
    title: "Catalog | Curated Culinary Artifacts | Anisa Studio",
    description: "Explore our complete range of professional-grade cookware, hand-forged Japanese steel, and artisanal tableware crafted for daily mastery.",
};

export default async function ProductsPage({ searchParams }) {
    const { category, brand, page = "1", search, minPrice, maxPrice, sort = "newest" } = await searchParams;
    const currentPage = parseInt(page);
    const minP = minPrice ? parseInt(minPrice) : undefined;
    const maxP = maxPrice ? parseInt(maxPrice) : undefined;

    let products = [];
    let totalCount = 48;

    try {
        if (search) {
            products = await getSearchProductsAction(search, 12);
            totalCount = products.length;
        } else if (category || brand || minP !== undefined || maxP !== undefined || sort !== "newest") {
            products = await getFilteredProductsAction({ categoryId: category, brand, minPrice: minP, maxPrice: maxP, sortBy: sort, page: currentPage, pageSize: 12 });
            totalCount = await getProductsCountAction({ categoryId: category, brand, sortBy: sort, minPrice: minP, maxPrice: maxP });
        } else {
            products = await getProductsAction(currentPage, 12);
            totalCount = await getProductsCountAction({});
        }
    } catch (error) {
        console.error("Error loading products page:", error);
    }

    return (
        <div className="bg-[#FBF9F5] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
                <ProductListing 
                    initialProducts={products} 
                    totalProducts={totalCount || 48}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
}
