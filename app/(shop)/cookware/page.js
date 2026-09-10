import CookwareHero from "@/components/cookware/CookwareHero";
import CookwareCategories from "@/components/cookware/CookwareCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import MasterclassBanner from "@/components/cookware/MasterclassBanner";
import { getKitchenProductsAction } from "@/lib/actions/product.actions";

export const revalidate = 60;

export const metadata = {
  title: "Cookware & Culinary Essentials | Anisa Studio",
  description:
    "Elevate your culinary experience with multi-ply stainless steel, hand-forged copper, and artisan cookware crafted to last a lifetime.",
};

export default async function CookwarePage() {
  let products = [];
  try {
    products = await getKitchenProductsAction("cookware");
    if (!products || products.length === 0) {
      // Fallback to all kitchen products
      products = await getKitchenProductsAction("all");
    }
  } catch (error) {
    console.error("Failed to fetch cookware products:", error);
  }

  return (
    <div className="animate-fade-in bg-[#FBF9F5] min-h-screen pb-16">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* 1. HERO SECTION (Screenshot 1) */}
        <CookwareHero />

        {/* 2. CURATED COLLECTIONS: EXPLORE BY CATEGORY (Screenshot 2) */}
        <CookwareCategories />

        {/* 3. FEATURED PRODUCTS (Screenshot 3 - Backend Data & New Cards) */}
        <div id="catalog">
          <FeaturedProducts initialProducts={products} />
        </div>

        {/* 4. MASTERCLASS EDITION (Screenshot 4) */}
        <MasterclassBanner />
      </div>
    </div>
  );
}
