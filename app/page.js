import EditorialHero from "@/components/home/EditorialHero";
import EditorialCollections from "@/components/home/EditorialCollections";
import EditorialIndex from "@/components/home/EditorialIndex";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopTheLook from "@/components/home/ShopTheLook";
import CulinaryJournal from "@/components/home/CulinaryJournal";
import { getKitchenProductsAction } from "@/lib/actions/product.actions";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  let products = [];
  try {
    products = await getKitchenProductsAction("all");
  } catch (error) {
    console.error("HomePage products fetch error:", error);
  }

  return (
    <div className="animate-fade-in bg-[#FBF9F5]">
      {/* 1. HERO SECTION (Screenshot 1) */}
      <EditorialHero />

      {/* Main Editorial Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 space-y-16 md:space-y-28 pb-20">
        {/* 2. COLLECTIONS 01, 02, 03 (Screenshots 2, 3, 4) */}
        <EditorialCollections />

        {/* 3. THE EDITORIAL INDEX (Screenshot 5) */}
        <EditorialIndex />

        {/* 4. FEATURED PRODUCTS (Backend Data + Screenshot 3 Card Design) */}
        <FeaturedProducts initialProducts={products} />

        {/* 5. INTERACTIVE SHOWCASE: SHOP THE LOOK (Screenshot 1) */}
        <ShopTheLook />

        {/* 6. CULINARY JOURNAL (Screenshot 2 Top) */}
        <CulinaryJournal />
      </div>
    </div>
  );
}
