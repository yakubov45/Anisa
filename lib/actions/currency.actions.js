"use server";

import { adminDb } from "@/lib/firebase/admin";

const SETTINGS_COLLECTION = "settings";
const CURRENCY_DOC = "currency";

export async function getCurrencySettingsAction() {
    try {
        const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CURRENCY_DOC);
        const snapshot = await docRef.get();
        if (snapshot.exists) {
            return snapshot.data();
        }
        return { rate: 12800, lastUpdated: new Date().toISOString() };
    } catch (error) {
        console.error("Error fetching currency settings via server action:", error);
        return { rate: 12800, lastUpdated: new Date().toISOString() };
    }
}

export async function updateCurrencyRateAction(rate) {
    try {
        const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(CURRENCY_DOC);
        await docRef.set({
            rate: Number(rate),
            lastUpdated: new Date().toISOString()
        });
        return true;
    } catch (error) {
        console.error("Error updating currency rate via server action:", error);
        return false;
    }
}
