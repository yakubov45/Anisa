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

export default function HomeSections({ featuredPrebuilts, flashDeals, topSelling, promoSlides }) {
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

            {/* Join OnePC Banner */}
            <JoinOnePCBanner />

            {/* Flash Deals Banner */}
            <DiscountBanner flashDeals={flashDeals} />

            {/* Setup Ideas */}
            <SetupIdeas />

            {/* Brands */}
            <BrandStrip />

            {/* Newsletter */}
            <Newsletter />
        </>
    )
}
