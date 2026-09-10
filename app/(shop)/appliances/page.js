import CulinaryCart from "@/components/cart/CulinaryCart";
import FrequentlyPaired from "@/components/cart/FrequentlyPaired";

export const metadata = {
  title: "Your Culinary Cart & Appliances | Anisa Studio",
  description:
    "Review your artisanal kitchenware selections, calculate shipping, and complete your order with Anisa Studio.",
};

export default function AppliancesPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* 1. CULINARY CART & CHECKOUT (Screenshot 1) */}
        <CulinaryCart />

        {/* 2. FREQUENTLY PAIRED TOGETHER (Screenshot 2) */}
        <FrequentlyPaired />
      </div>
    </div>
  );
}
