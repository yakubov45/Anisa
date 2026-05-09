import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import TrustSection from "@/components/home/TrustSection"
import SetupIdeas from "@/components/home/SetupIdeas"
import BrandStrip from "@/components/home/BrandStrip"
import Newsletter from "@/components/home/Newsletter"
import HeroSlider from "@/components/home/HeroSlider"
import DiscountBanner from "@/components/home/DiscountBanner"
import PromotionSlider from "@/components/home/PromotionSlider"
import SectionHeading from "@/components/common/SectionHeading"
import { getProductsAction, getBannersAction, getProductsByIdsAction } from "@/lib/actions/product.actions"
import { getFlashDealsSettingsAction } from "@/lib/actions/flash-deals.actions"

export default async function HomePage() {
    let allProducts = [];
    let banners = [];
    let flashDeals = null;

    try {
        // Parallel fetch — server tomonida, blokirovkasiz
        const [productsResult, bannersResult, flashSettingsResult] = await Promise.allSettled([
            getProductsAction(20),
            getBannersAction(),
            getFlashDealsSettingsAction()
        ]);

        allProducts = productsResult.status === 'fulfilled' ? productsResult.value : [];
        banners = bannersResult.status === 'fulfilled' ? bannersResult.value : [];
        
        const flashSettings = flashSettingsResult.status === 'fulfilled' ? flashSettingsResult.value : null;
        
        if (flashSettings) {
            let flashProducts = [];
            if (flashSettings.productIds?.length > 0) {
                const r = await getProductsByIdsAction(flashSettings.productIds);
                flashProducts = r || [];
            } else {
                flashProducts = allProducts.slice(0, 10);
            }
            flashDeals = { settings: flashSettings, products: flashProducts };
        }
    } catch (error) {
        console.error("Critical error in HomePage data fetching:", error);
    }
    
    const hotProducts = (allProducts || []).slice(0, 12);
    const topSelling = (allProducts || []).slice(12, 20);
    const heroSlides = banners.filter(b => b.type !== "promo");
    const promoSlides = banners.filter(b => b.type === "promo");

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 md:pt-10 px-4 sm:px-0">

            {/* 1. HERO SLIDER */}
            <HeroSlider initialSlides={heroSlides.length > 0 ? heroSlides : undefined} />

            {/* 2. CATEGORIES */}
            <CategoryGrid />

            {/* 3. NEW ARRIVALS */}
            <section className="space-y-10">
                <SectionHeading titleKey="new_arrivals" />
                <ProductGrid products={hotProducts} badge="Hot" />
            </section>

            {/* 3.5 PROMOTION SLIDER */}
            {promoSlides.length > 0 && (
                <PromotionSlider slides={promoSlides} />
            )}

            {/* 4. BEST SELLERS */}
            <section className="space-y-10">
                <SectionHeading titleKey="best_sellers" />
                <ProductGrid products={topSelling} badge="Bestseller" rating={5} />
            </section>

            {/* 5. WHY CHOOSE US */}
            <TrustSection />

            {/* 5.1 FLASH DEALS BANNER — data server tomonidan keladi */}
            <DiscountBanner flashDeals={flashDeals} />

            {/* 6. SETUP IDEAS */}
            <SetupIdeas />

            {/* 7. BRANDS */}
            <BrandStrip />

            {/* 8. NEWSLETTER */}
            <Newsletter />

        </div>
    )
}
