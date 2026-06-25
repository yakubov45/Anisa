import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import TrustSection from "@/components/home/TrustSection"
import SetupIdeas from "@/components/home/SetupIdeas"
import BrandStrip from "@/components/home/BrandStrip"
import Newsletter from "@/components/home/Newsletter"
import HeroSlider from "@/components/home/HeroSlider"
import DiscountBanner from "@/components/home/DiscountBanner"
import PromotionSlider from "@/components/home/PromotionSlider"
import FeaturedPrebuilts from "@/components/home/FeaturedPrebuilts"
import PCFinderQuiz from "@/components/home/PCFinderQuiz"
import SectionHeading from "@/components/common/SectionHeading"
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

            {/* 3. ZTT PREBUILTS HERO SECTION */}
            {featuredPrebuilts && featuredPrebuilts.length > 0 && (
                <FeaturedPrebuilts prebuilts={featuredPrebuilts} />
            )}

            {/* 4. PC FINDER QUIZ (Engaging Banner) */}
            <PCFinderQuiz />

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

            {/* 5.1 FLASH DEALS BANNER */}
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
