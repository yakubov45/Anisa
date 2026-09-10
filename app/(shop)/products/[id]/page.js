import { getProducts, getProductById } from "@/features/product/api"
import ProductDetailClient from "./ProductDetailClient"
import ProductDetailHero from "@/components/product/ProductDetailHero"
import CraftsmanshipSection from "@/components/product/CraftsmanshipSection"
import CareAndReviews from "@/components/product/CareAndReviews"
import { notFound } from "next/navigation"

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        return {
            title: 'Product Not Found',
        };
    }

    return {
        title: product.name,
        description: product.description || `Buy ${product.name} from OnePC. High performance hardware and accessories.`,
        openGraph: {
            title: product.name,
            description: product.description || `Buy ${product.name} from OnePC.`,
            images: [
                {
                    url: product.image,
                    width: 1200,
                    height: 630,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: "summary_large_image",
            title: product.name,
            description: product.description || `Buy ${product.name} from OnePC.`,
            images: [product.image],
        }
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params
    const product = await getProductById(id)
    
    if (!product) {
        notFound()
    }

    const allProducts = await getProducts()
    const relatedProducts = allProducts.filter(p => p.category === product.category && p.id !== product.id)

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.image,
        description: product.description || `Buy ${product.name} from OnePC.`,
        sku: product.id,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'OnePC',
        },
        offers: {
            '@type': 'Offer',
            url: `https://onepc.uz/products/${product.id}`,
            priceCurrency: 'UZS',
            price: product.price,
            priceValidUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'OnePC'
            }
        }
    }

    const isKitchenProduct =
      product.category === "cookware" ||
      product.category === "tableware" ||
      product.category === "knives" ||
      product.category === "appliances" ||
      product.id?.includes("dutch") ||
      product.id?.includes("skillet") ||
      product.id?.includes("santoku") ||
      product.id?.includes("stoneware") ||
      product.id?.includes("copper") ||
      product.id?.includes("butcher") ||
      product.id?.includes("juicer") ||
      product.id?.includes("matcha") ||
      product.id?.includes("stockpot") ||
      product.id?.includes("kitchen");

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {isKitchenProduct ? (
          <div className="bg-[#FBF9F5] min-h-screen">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">
              <ProductDetailHero product={product} />
              <CraftsmanshipSection />
              <CareAndReviews />
            </div>
          </div>
        ) : (
          <ProductDetailClient
            product={product}
            relatedProducts={relatedProducts}
          />
        )}
      </>
    );
}
