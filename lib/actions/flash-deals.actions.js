"use server";

import { adminDb } from "@/lib/firebase/admin";

const COLLECTION_NAME = "settings";
const DOC_ID = "flash_deals";

export async function getFlashDealsSettingsAction() {
    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(DOC_ID);
        const snapshot = await docRef.get();
        
        if (snapshot.exists) {
            return snapshot.data();
        } else {
            // Default settings if none exist
            const defaultSettings = {
                endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                productIds: [],
                discountPercentage: 15
            };
            await docRef.set(defaultSettings);
            return defaultSettings;
        }
    } catch (error) {
        console.error("Error fetching flash deals settings via Server Action:", error);
        return null;
    }
}

export async function updateFlashDealsSettingsAction(data) {
    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(DOC_ID);
        await docRef.update(data);
        return true;
    } catch (error) {
        console.error("Error updating flash deals settings via Server Action:", error);
        return false;
    }
}
