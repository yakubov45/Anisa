import { getPreBuiltSystemsAction } from "@/lib/actions/product.actions";
import PrebuiltsClient from "./PrebuiltsClient";

export const metadata = {
    title: "Tayyor Kompyuterlar - ZTT Prebuilts",
    description: "Professionallar tomonidan yig'ilgan eng kuchli kompyuterlar katalogi."
};

export const revalidate = 60;

export default async function PrebuiltsPage() {
    const allPrebuilts = await getPreBuiltSystemsAction();
    return <PrebuiltsClient initialData={allPrebuilts} />;
}
