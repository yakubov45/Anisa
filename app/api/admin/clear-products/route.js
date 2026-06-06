import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/serverAuth";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants";

export async function POST(request) {
    const auth = await requireAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const snapshot = await adminDb.collection(COLLECTIONS.PRODUCTS).get();
        
        // Use batch for faster deletion
        const batch = adminDb.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        
        await batch.commit();

        return NextResponse.json({ success: true, count: snapshot.size });
    } catch (error) {
        console.error("Failed to clear products:", error);
        return NextResponse.json({ error: "Failed to clear products" }, { status: 500 });
    }
}
