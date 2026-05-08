"use server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "../constants";

export async function getUserDataAction(uid) {
    if (!adminDb || !uid) return null;
    
    try {
        const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            return {
                id: userDoc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data via Server Action:", error);
        return null;
    }
}
