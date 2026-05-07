"use server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "@/lib/constants";

export async function getStoresAction() {
    try {
        if (!adminDb) {
            throw new Error("Admin DB not initialized");
        }
        
        const storesSnapshot = await adminDb.collection(COLLECTIONS.STORES || "stores").get();
        const stores = storesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            // Convert Firestore timestamps to plain objects/strings for RSC serialization
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
        }));
        
        return { success: true, stores };
    } catch (error) {
        console.error("Error getting stores:", error);
        return { success: false, error: error.message };
    }
}

export async function addStoreAction(storeData) {
    try {
        if (!adminDb) {
            throw new Error("Admin DB not initialized");
        }

        const docRef = await adminDb.collection(COLLECTIONS.STORES || "stores").add({
            ...storeData,
            createdAt: new Date() // Admin SDK uses regular Date or FieldValue
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("Error adding store:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteStoreAction(id) {
    try {
        if (!adminDb) {
            throw new Error("Admin DB not initialized");
        }

        await adminDb.collection(COLLECTIONS.STORES || "stores").doc(id).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting store:", error);
        return { success: false, error: error.message };
    }
}

export async function updateStoreAction(id, storeData) {
    try {
        if (!adminDb) {
            throw new Error("Admin DB not initialized");
        }

        await adminDb.collection(COLLECTIONS.STORES || "stores").doc(id).update({
            ...storeData,
            updatedAt: new Date()
        });
        
        return { success: true };
    } catch (error) {
        console.error("Error updating store:", error);
        return { success: false, error: error.message };
    }
}
