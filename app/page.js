import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import HeroSlider from "@/components/home/HeroSlider"
import SectionHeading from "@/components/common/SectionHeading"
import HomeSections from "@/components/home/HomeSections"
import { getProductsAction, getBannersAction, getPreBuiltSystemsAction } from "@/lib/actions/product.actions"
import { getFlashDealsSettingsAction } from "@/lib/actions/flash-deals.actions"

export const revalidate = 60; // Sahifani har 60 soniyada keshlaydi, shunda tez ochiladi

export default async function HomePage() {
    let allProducts = [];
    let banners = [];
    let featuredPrebuilts = [];
    let flashDeals = null;

    try {
        const [productsResult, bannersResult, prebuiltsResult] = await Promise.allSettled([
            getProductsAction(1, 20),
            getBannersAction(),
            getPreBuiltSystemsAction({ isFeatured: true, limit: 9 }),
        ]);

        allProducts = productsResult.status === 'fulfilled' ? productsResult.value ?? [] : [];
        banners = bannersResult.status === 'fulfilled' ? bannersResult.value ?? [] : [];
        featuredPrebuilts = prebuiltsResult.status === 'fulfilled' ? prebuiltsResult.value ?? [] : [];

        // Flash deals
        const flashSettings = await getFlashDealsSettingsAction().catch(() => null);
        if (flashSettings) {
            const discountedProducts = allProducts.filter(p => p.discount > 0);
            flashDeals = {
                settings: flashSettings,
                products: discountedProducts // Only show products that actually have a discount assigned by admin
            };
        }
    } catch (error) {
        console.error("HomePage data fetch error:", error);
    }

    const hotProducts = allProducts.slice(0, 8);
    const topSelling = allProducts.slice(8, 16);
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
            />

        </div>
    )
}
