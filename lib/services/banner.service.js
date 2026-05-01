import { 
    collection, 
    getDocs, 
    doc, 
    updateDoc, 
    addDoc, 
    deleteDoc, 
    query, 
    orderBy 
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";

const COLLECTION_NAME = "banners";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Stable REST fetch for Server-side
async function fetchBannersRest() {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION_NAME}?pageSize=100`;
    try {
        const response = await fetch(url, { next: { revalidate: 3600 } });
        const data = await response.json();
        return data.documents?.map(d => {
            const fields = d.fields;
            const result = { id: d.name.split('/').pop() };
            for (const key in fields) {
                const valueObj = fields[key];
                const typeKey = Object.keys(valueObj)[0];
                result[key] = typeKey === 'integerValue' || typeKey === 'doubleValue' ? Number(valueObj[typeKey]) : valueObj[typeKey];
            }
            return result;
        }).sort((a, b) => (a.order || 0) - (b.order || 0)) || [];
    } catch (error) {
        console.error("Banner REST fetch failed:", error);
        return [];
    }
}

export const bannerService = {
    async getBanners() {
        if (typeof window === "undefined") {
            return await fetchBannersRest();
        }

        try {
            const q = query(collection(db, COLLECTION_NAME), orderBy("order", "asc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },

    async updateBanner(id, data) {
        try {
            const docRef = doc(db, COLLECTION_NAME, id);
            await updateDoc(docRef, data);
            return true;
        } catch (error) {
            console.error("Error updating banner:", error);
            return false;
        }
    },

    async addBanner(data) {
        try {
            const docRef = await addDoc(collection(db, COLLECTION_NAME), {
                ...data,
                order: Date.now()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding banner:", error);
            return null;
        }
    },

    async deleteBanner(id) {
        try {
            await deleteDoc(doc(db, COLLECTION_NAME, id));
            return true;
        } catch (error) {
            console.error("Error deleting banner:", error);
            return false;
        }
    }
};
