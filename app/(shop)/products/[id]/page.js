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
                    width: 800,
                    height: 600,
                    alt: product.name,
                },
            ],
            type: 'website',
        },
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

    return (
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    )
}
