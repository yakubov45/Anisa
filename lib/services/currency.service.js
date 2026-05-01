import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/client";

const SETTINGS_COLLECTION = "settings";
const CURRENCY_DOC = "currency";

export const currencyService = {
    async getSettings() {
        try {
            const docRef = doc(db, SETTINGS_COLLECTION, CURRENCY_DOC);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                return docSnap.data();
            }
            // Default settings
            return { rate: 12800, lastUpdated: new Date().toISOString() };
        } catch (error) {
            console.error("Error fetching currency settings:", error);
            return { rate: 12800, lastUpdated: new Date().toISOString() };
        }
    },

    async updateRate(rate) {
        try {
            const docRef = doc(db, SETTINGS_COLLECTION, CURRENCY_DOC);
            await setDoc(docRef, {
                rate: Number(rate),
                lastUpdated: new Date().toISOString()
            });
            return true;
        } catch (error) {
            console.error("Error updating currency rate:", error);
            return false;
        }
    }
};
