"use client"

import dynamic from "next/dynamic"

// ssr: false faqat Client Component ichida ishlaydi
const TrustSection = dynamic(() => import("@/components/home/TrustSection"), { ssr: false })
const SetupIdeas = dynamic(() => import("@/components/home/SetupIdeas"), { ssr: false })
const BrandStrip = dynamic(() => import("@/components/home/BrandStrip"), { ssr: false })
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), { ssr: false })
const DiscountBanner = dynamic(() => import("@/components/home/DiscountBanner"), { ssr: false })
const PromotionSlider = dynamic(() => import("@/components/home/PromotionSlider"), { ssr: false })
const FeaturedPrebuilts = dynamic(() => import("@/components/home/FeaturedPrebuilts"), { ssr: false })
const PCFinderQuiz = dynamic(() => import("@/components/home/PCFinderQuiz"), { ssr: false })
const JoinOnePCBanner = dynamic(() => import("@/components/home/JoinOnePCBanner"), { ssr: false })
const ProductGrid = dynamic(() => import("@/features/product/ProductGrid"), { ssr: false })
const KeyboardScroll = dynamic(() => import("@/components/KeyboardScroll"), { ssr: false })

export default function HomeSections({ featuredPrebuilts, flashDeals, topSelling, promoSlides, totalProducts = 500 }) {
    return (
        <>
            {/* Featured Prebuilts */}
            {featuredPrebuilts && featuredPrebuilts.length > 0 && (
                <FeaturedPrebuilts prebuilts={featuredPrebuilts} />
            )}

            {/* PC Finder Quiz */}
            <PCFinderQuiz />

            {/* Promotion Slider */}
            {promoSlides && promoSlides.length > 0 && (
                <PromotionSlider slides={promoSlides} />
            )}

            {/* Why Choose Us */}
            <TrustSection />

            {/* Keyboard Scrollytelling Animation */}
            <KeyboardScroll />

            {/* Join OnePC Banner */}
            <JoinOnePCBanner />

            {/* Hit Products */}
            {topSelling && topSelling.length > 0 && (
                <section className="space-y-6 md:space-y-10 px-4 sm:px-0 mt-10 md:mt-16">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl md:text-3xl font-black uppercase text-foreground font-mono tracking-tight">
                            XIT MAHSULOTLAR
                        </h2>
                    </div>
                    <ProductGrid products={topSelling.slice(0, 8)} badge="Hot" rating={5} />
                </section>
            )}

            {/* Flash Deals Banner */}
            <DiscountBanner flashDeals={flashDeals} totalProducts={totalProducts} />

            {/* Setup Ideas */}
            <SetupIdeas />

            {/* Brands */}
            <BrandStrip />

            {/* Newsletter */}
            <Newsletter />
        </>
    )
}
