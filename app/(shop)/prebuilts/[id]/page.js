import { getPreBuiltByIdAction, getPreBuiltSystemsAction } from "@/lib/actions/product.actions";
import PrebuiltDetailClient from "./PrebuiltDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
    try {
        const resolvedParams = await params;
        const pc = await getPreBuiltByIdAction(resolvedParams.id);
        if (!pc) return { title: "Topilmadi" };
        return {
            title: `${pc.name} - OnePC Prebuilts`,
            description: `${pc.name}: ${pc.quick_specs?.cpu}, ${pc.quick_specs?.gpu}, ${pc.quick_specs?.ram}`
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
