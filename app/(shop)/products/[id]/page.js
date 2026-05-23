import { getProducts, getProductById } from "@/features/product/api"
import ProductDetailClient from "./ProductDetailClient"
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

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ProductDetailClient product={product} relatedProducts={relatedProducts} />
        </>
    )
}
