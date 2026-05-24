import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/serverAuth";
import { COLLECTIONS } from "@/lib/constants";

export async function GET(request) {
    const auth = await requireAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const snapshot = await adminDb.collection(COLLECTIONS.USERS).get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                email: data.email,
                displayName: data.displayName || data.name,
                role: data.role,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
            };
        });
        return NextResponse.json(users);
    } catch (error) {
        console.error("Users API Error:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
