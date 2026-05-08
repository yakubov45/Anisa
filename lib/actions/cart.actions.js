"use server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "../constants";

export async function getCartAction(uid) {
    if (!adminDb || !uid) return [];
    
    try {
        const cartDoc = await adminDb.collection(COLLECTIONS.CARTS || "carts").doc(uid).get();
        if (cartDoc.exists) {
            return cartDoc.data().items || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching cart via Server Action:", error);
        return [];
    }
}

export async function saveCartAction(uid, items) {
    if (!adminDb || !uid) return { success: false };
    
    try {
        await adminDb.collection(COLLECTIONS.CARTS || "carts").doc(uid).set({
            items,
            updatedAt: new Date()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error saving cart via Server Action:", error);
        return { success: false, error: error.message };
    }
}
