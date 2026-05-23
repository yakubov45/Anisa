import { redirect } from "next/navigation";

export default async function PreBuiltDetailPage({ params }) {
    const { id } = await params;
    redirect(`/prebuilts/${id}`);
}