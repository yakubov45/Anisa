import CulinaryCart from "@/components/cart/CulinaryCart";
import FrequentlyPaired from "@/components/cart/FrequentlyPaired";

export const metadata = {
  title: "Your Culinary Cart | Anisa Studio",
  description:
    "Review your artisanal kitchenware selections, calculate shipping, and complete your order with Anisa Studio.",
};

export default function CartPage() {
  return (
    <div className="bg-[#FBF9F5] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        <CulinaryCart />
        <FrequentlyPaired />
      </div>
    </div>
  );
}
