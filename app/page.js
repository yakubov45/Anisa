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
import SectionHeading from "@/components/common/SectionHeading"
import { getProductsAction, getBannersAction, getPreBuiltSystemsAction } from "@/lib/actions/product.actions"
import { getFlashDealsSettingsAction } from "@/lib/actions/flash-deals.actions"

export default async function HomePage() {
    let allProducts = [];
    let banners = [];
    let flashDeals = null;

    try {
        // Parallel fetch — faqat 2 ta asosiy so'rov (kamroq so'rov = tezroq)
        const [productsResult, bannersResult, prebuiltsResult] = await Promise.allSettled([
            getProductsAction(1, 20),
            getBannersAction(),
            getPreBuiltSystemsAction({ isFeatured: true, limit: 9 }),
        ]);

        allProducts = productsResult.status === 'fulfilled' ? productsResult.value ?? [] : [];
        banners = bannersResult.status === 'fulfilled' ? bannersResult.value ?? [] : [];
        const featuredPrebuilts = prebuiltsResult.status === 'fulfilled' ? prebuiltsResult.value ?? [] : [];

        // Flash deals — faqat allProducts tayyor bo'lgandan keyin, alohida
        const flashSettings = await getFlashDealsSettingsAction().catch(() => null);
        if (flashSettings) {
            flashDeals = {
                settings: flashSettings,
                // Flash deals uchun alohida so'rov qilmaymiz — allaqachon olgan mahsulotlardan foydalanamiz
                products: allProducts.slice(0, 8)
            };
        }
    } catch (error) {
        console.error("HomePage data fetch error:", error);
    }

    const hotProducts = allProducts.slice(0, 12);
    const topSelling = allProducts.slice(12, 20);
    const heroSlides = banners.filter(b => b.type !== "promo");
    const promoSlides = banners.filter(b => b.type === "promo");

    // Re-fetch since it's scoped in try-catch
    const featuredPrebuilts = await getPreBuiltSystemsAction({ isFeatured: true, limit: 9 }).catch(() => []);

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 md:pt-10 px-4 sm:px-0">

            {/* 1. HERO SLIDER */}
            <HeroSlider initialSlides={heroSlides.length > 0 ? heroSlides : undefined} />

            {/* 2. CATEGORIES */}
            <CategoryGrid />

            {/* ZTT PREBUILTS HERO SECTION */}
            {featuredPrebuilts && featuredPrebuilts.length > 0 && (
                <FeaturedPrebuilts prebuilts={featuredPrebuilts} />
            )}

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
