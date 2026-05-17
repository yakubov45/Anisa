import { getPreBuiltSystemsAction } from "@/lib/actions/product.actions";
import PrebuiltsListClient from "./PrebuiltsListClient";

export default async function AdminPrebuiltsPage() {
    const prebuilts = await getPreBuiltSystemsAction();

    return <PrebuiltsListClient initialData={prebuilts} />;
}
