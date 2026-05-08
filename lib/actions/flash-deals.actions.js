"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache, revalidateTag } from "next/cache";

const COLLECTION_NAME = "settings";
const DOC_ID = "flash_deals";

const withTimeout = (promise, ms, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

export const getFlashDealsSettingsAction = unstable_cache(
    async () => {
        if (!adminDb) return { endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), productIds: [], discountPercentage: 15 };
        
        try {
            const docRef = adminDb.collection(COLLECTION_NAME).doc(DOC_ID);
            const snapshot = await withTimeout(docRef.get(), 5000, { exists: false });
            
            if (snapshot && snapshot.exists) {
                return snapshot.data();
            } else {
                const defaultSettings = {
                    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    productIds: [],
                    discountPercentage: 15
                };
                return defaultSettings;
            }
        } catch (error) {
            console.error("Error fetching flash deals settings:", error);
            return null;
        }
    },
    ['flash-deals-settings'],
    { revalidate: 3600, tags: ['flash-deals'] }
);

export async function updateFlashDealsSettingsAction(data) {
    if (!adminDb) return false;
    try {
        const docRef = adminDb.collection(COLLECTION_NAME).doc(DOC_ID);
        await docRef.update(data);
        revalidateTag('flash-deals');
        return true;
    } catch (error) {
        console.error("Error updating flash deals settings:", error);
        return false;
    }
}
