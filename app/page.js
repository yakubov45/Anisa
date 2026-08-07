import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import HeroSlider from "@/components/home/HeroSlider"
import SectionHeading from "@/components/common/SectionHeading"
import HomeSections from "@/components/home/HomeSections"
import { getProductsAction, getBannersAction, getPreBuiltSystemsAction, getProductsByIdsAction, getProductsCountAction } from "@/lib/actions/product.actions"
import { getFlashDealsSettingsAction } from "@/lib/actions/flash-deals.actions"

export const revalidate = 60; // Sahifani har 60 soniyada keshlaydi, shunda tez ochiladi

export default async function HomePage() {
    let allProducts = [];
    let banners = [];
    let featuredPrebuilts = [];
    let flashDeals = null;
    let totalProducts = 500;

    try {
        const [productsResult, bannersResult, prebuiltsResult, countResult] = await Promise.allSettled([
            getProductsAction(1, 20),
            getBannersAction(),
            getPreBuiltSystemsAction({ isFeatured: true, limit: 9 }),
            getProductsCountAction()
        ]);

        allProducts = productsResult.status === 'fulfilled' ? productsResult.value ?? [] : [];
        banners = bannersResult.status === 'fulfilled' ? bannersResult.value ?? [] : [];
        featuredPrebuilts = prebuiltsResult.status === 'fulfilled' ? prebuiltsResult.value ?? [] : [];
        totalProducts = countResult.status === 'fulfilled' ? countResult.value ?? 500 : 500;

        // Flash deals
        const flashSettings = await getFlashDealsSettingsAction().catch(() => null);
        if (flashSettings && flashSettings.productIds && flashSettings.productIds.length > 0) {
            const flashProds = await getProductsByIdsAction(flashSettings.productIds).catch(() => []);
            // Apply the discount to these products for the UI
            const discountedProducts = flashProds.map(p => ({
                ...p,
                discount: flashSettings.discountPercentage || 15
            }));
            
            flashDeals = {
                settings: flashSettings,
                products: discountedProducts
            };
        }
    } catch (error) {
        console.error("HomePage data fetch error:", error);
    }

    const hotProducts = allProducts.slice(0, 4);
    const topSelling = allProducts.slice(8, 12);
    const heroSlides = banners.filter(b => b.type !== "promo");
    const promoSlides = banners.filter(b => b.type === "promo");

    return (
        <div className="space-y-6 md:space-y-10 animate-fade-in pb-20 px-4 sm:px-0">

            {/* 1. HERO SLIDER */}
            <HeroSlider initialSlides={heroSlides.length > 0 ? heroSlides : undefined} />

            {/* 2. CATEGORIES */}
            <CategoryGrid />

            {/* 3. NEW ARRIVALS */}
            <section className="space-y-10">
                <SectionHeading titleKey="new_arrivals" />
                <ProductGrid products={hotProducts} badge="Hot" />
            </section>

            {/* 4. BEST SELLERS */}
            <section className="space-y-10">
                <SectionHeading titleKey="best_sellers" />
                <ProductGrid products={topSelling} badge="Bestseller" rating={5} />
            </section>

            {/* 5. ALL BELOW-THE-FOLD SECTIONS (lazily loaded client-side) */}
            <HomeSections
                featuredPrebuilts={featuredPrebuilts}
                flashDeals={flashDeals}
                topSelling={topSelling}
                promoSlides={promoSlides}
                totalProducts={totalProducts}
            />

        </div>
    );
}
