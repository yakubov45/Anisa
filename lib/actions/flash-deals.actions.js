"use server";

import { adminDb } from "@/lib/firebase/admin";

const COLLECTION_NAME = "settings";
const DOC_ID = "flash_deals";

import { unstable_cache } from "next/cache";

export const getFlashDealsSettingsAction = unstable_cache(
    async () => {
        try {
            if (!adminDb) {
                console.warn("adminDb is null, returning default flash deals");
                return {
                    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    productIds: [],
                    discountPercentage: 15
                };
            }
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
    },
    ['flash-deals-settings'],
    { revalidate: 3600, tags: ['flash-deals'] } // Cache for 1 hour
);

import { revalidateTag } from "next/cache";

export async function updateFlashDealsSettingsAction(data) {
    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(DOC_ID);
        await docRef.update(data);
        revalidateTag('flash-deals');
        return true;
    } catch (error) {
        console.error("Error updating flash deals settings via Server Action:", error);
        return false;
    }
}
