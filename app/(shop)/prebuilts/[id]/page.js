import { getPreBuiltByIdAction, getPreBuiltSystemsAction } from "@/lib/actions/product.actions";
import PrebuiltDetailClient from "./PrebuiltDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const pc = await getPreBuiltByIdAction(resolvedParams.id);
        if (!pc) return { title: "Topilmadi" };
        
        const title = `${pc.name} - OnePC Tayyor Kompyuter`;
        const description = pc.quick_specs ? `Protsessor: ${pc.quick_specs.cpu} | Videokarta: ${pc.quick_specs.gpu} | RAM: ${pc.quick_specs.ram}. O'yin va ish uchun mukammal kompyuter!` : "OnePC tayyor kompyuterlari";
        const imageUrl = pc.images && pc.images.length > 0 ? pc.images[0] : "https://onepc.uz/og-image.jpg"; // Yoki loyihaning rasmiy rasm manzili

        return {
            title: title,
            description: description,
            openGraph: {
                title: title,
                description: description,
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: pc.name,
                    },
                ],
                type: 'website',
            },
            twitter: {
                card: "summary_large_image",
                title: title,
                description: description,
                images: [imageUrl],
            }
        };
    } catch {
        return { title: "Tayyor Kompyuter" };
    }
}

export default async function PrebuiltDetailPage({ params }) {
    const resolvedParams = await params;
    const pc = await getPreBuiltByIdAction(resolvedParams.id);
    if (!pc) return notFound();

    // Fetch other systems, filter out current, limit to 3
    const allSystems = await getPreBuiltSystemsAction() || [];
    const otherPrebuilts = allSystems.filter(sys => sys.id !== pc.id).slice(0, 3);

    return <PrebuiltDetailClient pc={pc} otherPrebuilts={otherPrebuilts} />;
}
