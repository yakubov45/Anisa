import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    setDoc, 
    getDoc,
    query, 
    limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const COLLECTION_NAME = "settings";
const DOC_ID = "flash_deals";

export const flashDealsService = {
    async getSettings() {
        try {
            const docRef = doc(db, COLLECTION_NAME, DOC_ID);
            const snapshot = await getDoc(docRef);
            
            if (snapshot.exists()) {
                return snapshot.data();
            } else {
                // Default settings if none exist
                const defaultSettings = {
                    endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    productIds: [],
                    discountPercentage: 15
                };
                await setDoc(docRef, defaultSettings);
                return defaultSettings;
            }
        } catch (error) {
            console.error("Error fetching flash deals settings:", error);
            return null;
        }
    },

    async updateSettings(data) {
        try {
            const docRef = doc(db, COLLECTION_NAME, DOC_ID);
            await updateDoc(docRef, data);
            return true;
        } catch (error) {
            console.error("Error updating flash deals settings:", error);
            return false;
        }
    }
};
