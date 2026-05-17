import CategoryClient from "./CategoryClient";
import { getCategoryProductsAction } from "@/lib/actions/product.actions";



export async function generateMetadata({ params }) {
    const { slug } = await params;
    const title = `${slug.charAt(0).toUpperCase() + slug.slice(1)} | OnePC`;
    const description = `Discover the best selection of ${slug} at OnePC. High-performance gaming and professional hardware in Uzbekistan.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: 'website',
            url: `https://onepc.uz/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const products = await getCategoryProductsAction(slug);

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        description: `Explore our range of ${slug} at OnePC.`,
        url: `https://onepc.uz/category/${slug}`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <CategoryClient slug={slug} products={products} />
        </>
    );
}
