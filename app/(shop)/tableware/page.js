import ProductDetailHero from "@/components/product/ProductDetailHero";
import CraftsmanshipSection from "@/components/product/CraftsmanshipSection";
import CareAndReviews from "@/components/product/CareAndReviews";

export const metadata = {
  title: "Artisan Cast Iron Dutch Oven | Anisa Studio Tableware",
  description:
    "Individually cast in sand molds and glazed in rich enamel, our Dutch oven provides unmatched heat retention and heritage design for oven-to-table dining.",
};

export default function TablewarePage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* 1. PDP HERO: GALLERY, COLOR/CAPACITY SELECTOR, ADD TO CART */}
        <ProductDetailHero />

        {/* 2. CRAFTSMANSHIP & DESIGN: THERMAL DYNAMICS & CHEF PHOTO */}
        <CraftsmanshipSection />

        {/* 3. MATERIALS & CARE + VERIFIED CUSTOMER REVIEWS */}
        <CareAndReviews />
      </div>
    </div>
  );
}
