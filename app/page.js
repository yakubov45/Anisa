import { getProducts } from "@/features/product/api"
import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import TrustSection from "@/components/home/TrustSection"
import SetupIdeas from "@/components/home/SetupIdeas"
import BrandStrip from "@/components/home/BrandStrip"
import Newsletter from "@/components/home/Newsletter"
import HeroSlider from "@/components/home/HeroSlider"
import DiscountBanner from "@/components/home/DiscountBanner"
import { bannerService } from "@/lib/services/banner.service"
import PromotionSlider from "@/components/home/PromotionSlider"
import SectionHeading from "@/components/common/SectionHeading"

export const revalidate = 3600

export default async function HomePage() {
    let allProducts = [];
    let banners = [];

    try {
        // Fetch in parallel with a shared timeout safety
        const results = await Promise.allSettled([
            getProducts(),
            bannerService.getBanners()
        ]);

        allProducts = results[0].status === 'fulfilled' ? results[0].value : [];
        banners = results[1].status === 'fulfilled' ? results[1].value : [];
    } catch (error) {
        console.error("Critical error in HomePage data fetching:", error);
    }
    
    const hotProducts = (allProducts || []).slice(0, 12);
    const topSelling = (allProducts || []).slice(12, 20);

    return (
        <div className="space-y-12 md:space-y-20 animate-fade-in pb-20 md:pt-10 px-4 sm:px-0">

            {/* 1. HERO SLIDER */}
            <HeroSlider initialSlides={banners.filter(b => b.type !== "promo").length > 0 ? banners.filter(b => b.type !== "promo") : undefined} />

            {/* 2. CATEGORIES */}
            <CategoryGrid />

            {/* 3. HOT DEPLOYMENT -> NEW ARRIVALS */}
            <section className="space-y-10">
                <SectionHeading titleKey="new_arrivals" />
                <ProductGrid products={hotProducts} badge="Hot" />
            </section>

            {/* 3.5 PROMOTION SLIDER */}
            {banners.filter(b => b.type === "promo").length > 0 && (
                <PromotionSlider slides={banners.filter(b => b.type === "promo")} />
            )}

            {/* 4. TOP SELLING -> BEST SELLERS */}
            <section className="space-y-10">
                <SectionHeading titleKey="best_sellers" />
                <ProductGrid products={topSelling} badge="Bestseller" rating={5} />
            </section>

            {/* 5. WHY CHOOSE US */}
            <TrustSection />

            {/* 5.1 FLASH DEALS BANNER */}
            <DiscountBanner />

            {/* 6. SETUP IDEAS */}
            <SetupIdeas />

            {/* 7. BRANDS */}
            <BrandStrip />

            {/* 8. NEWSLETTER */}
            <Newsletter />

        </div>
    )
}
