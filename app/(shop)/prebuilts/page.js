import { getPreBuiltSystemsAction } from "@/lib/actions/product.actions";
import PrebuiltsClient from "./PrebuiltsClient";

export const metadata = {
    title: "Tayyor Kompyuterlar - ZTT Prebuilts",
    description: "Professionallar tomonidan yig'ilgan eng kuchli kompyuterlar katalogi."
};

export const revalidate = 60;

import { Suspense } from "react";

export default async function PrebuiltsPage() {
    const allPrebuilts = await getPreBuiltSystemsAction();
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-surface-500 uppercase tracking-widest animate-pulse">Yuklanmoqda...</div>}>
            <PrebuiltsClient initialData={allPrebuilts} />
        </Suspense>
    );
}
