import CollectionsHero from "@/components/collections/CollectionsHero";

export const metadata = {
  title: "Curated Living & Culinary Suites | Anisa Studio Collections",
  description:
    "Explore our signature kitchenware collections envisioned around the art of hospitality, gathered tables, and culinary mastery.",
};

export default function CollectionsPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* 1. EDITORIAL HERO & COLLECTIONS FILTER */}
        <CollectionsHero />
      </div>
    </div>
  );
}
