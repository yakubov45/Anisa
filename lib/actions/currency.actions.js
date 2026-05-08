"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache, revalidateTag } from "next/cache";

const SETTINGS_COLLECTION = "settings";
const CURRENCY_DOC = "currency";

const withTimeout = (promise, ms, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

export const getCurrencySettingsAction = unstable_cache(
    async () => {
        if (!adminDb) return { rate: 12800, lastUpdated: new Date().toISOString() };
        
        try {
            const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CURRENCY_DOC);
            const snapshot = await withTimeout(docRef.get(), 5000, { exists: false });
            
            if (snapshot && snapshot.exists) {
                return snapshot.data();
            }
            return { rate: 12800, lastUpdated: new Date().toISOString() };
        } catch (error) {
            console.error("Error fetching currency settings:", error);
            return { rate: 12800, lastUpdated: new Date().toISOString() };
        }
    },
    ['currency-settings'],
    { revalidate: 3600, tags: ['currency'] }
);

export async function updateCurrencyRateAction(rate) {
    if (!adminDb) return false;
    try {
        const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CURRENCY_DOC);
        await docRef.set({
            rate: Number(rate),
            lastUpdated: new Date().toISOString()
        });
        revalidateTag('currency');
        return true;
    } catch (error) {
        console.error("Error updating currency rate:", error);
        return false;
    }
}
