import dynamic from "next/dynamic"
import { getProducts } from "@/features/product/api"
import ProductGrid from "@/features/product/ProductGrid"
import CategoryGrid from "@/components/home/CategoryGrid"
import HeroSlider from "@/components/home/HeroSlider"
import { bannerService } from "@/lib/services/banner.service"

// Optimized Heavy Components
const SetupIdeas = dynamic(() => import("@/components/home/SetupIdeas"), { ssr: false })
const BrandStrip = dynamic(() => import("@/components/home/BrandStrip"), { ssr: false })
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), { ssr: false })
const TrustSection = dynamic(() => import("@/components/home/TrustSection"), { ssr: false })
const DiscountBanner = dynamic(() => import("@/components/home/DiscountBanner"), { ssr: false })
const PromotionSlider = dynamic(() => import("@/components/home/PromotionSlider"), { ssr: false })

export const revalidate = 3600 // Cache for 1 hour to protect Firestore from high traffic

export default async function HomePage() {
    const allProducts = await getProducts()
    const banners = await bannerService.getBanners()
    
    // Select different sets for variety
    const hotProducts = allProducts.slice(0, 12)
    const topSelling = allProducts.slice(12, 20)
    const discountProducts = allProducts.slice(5, 15) // Select items for flash deals

    return (
        <div className="space-y-20 animate-fade-in pb-20 pt-10">

            {/* 1. HERO SLIDER */}
            <HeroSlider initialSlides={banners.filter(b => b.type !== "promo").length > 0 ? banners.filter(b => b.type !== "promo") : undefined} />

            {/* 2. CATEGORIES */}
            <CategoryGrid />

            {/* 3. HOT DEPLOYMENT */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">Hot Deployment</h2>
                </div>
                <ProductGrid products={hotProducts} badge="Hot" />
            </section>

            {/* 3.5 PROMOTION SLIDER */}
            {banners.filter(b => b.type === "promo").length > 0 && (
                <PromotionSlider slides={banners.filter(b => b.type === "promo")} />
            )}

            {/* 4. TOP SELLING */}
            <section className="space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-1 bg-primary rounded-full" />
                    <h2 className="text-3xl font-black text-foreground uppercase tracking-tighter">Top Selling</h2>
                </div>
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
