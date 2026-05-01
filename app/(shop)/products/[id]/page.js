import { getProducts, getProductById } from "@/features/product/api"
import ProductDetailClient from "./ProductDetailClient"
import { notFound } from "next/navigation"

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
