"use server"

import { adminDb } from "../firebase/admin";
import { COLLECTIONS } from "../constants";

export async function getCategoryProductsAction(categorySlug, pageLimit = 50) {
    try {
        let query = adminDb.collection(COLLECTIONS.PRODUCTS);
        
        // Handle case sensitivity fallback
        let snapshot = await query.where("category", "==", categorySlug)
                                  .orderBy("createdAt", "desc")
                                  .limit(pageLimit)
                                  .get();

        if (snapshot.empty) {
            const capitalized = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
            snapshot = await query.where("category", "==", capitalized)
                                  .orderBy("createdAt", "desc")
                                  .limit(pageLimit)
                                  .get();
        }

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
            updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null
        }));
    } catch (error) {
        console.error("Server Action Error:", error);
        return [];
    }
}
