import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    limit
} from "firebase/firestore";
import { db } from "../firebase/client";
import { COLLECTIONS } from "../constants";

export const productService = {
    /**
     * Get all products with filtering (Client Side Safe)
     */
    async getAll({ category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', pageLimit = 20 } = {}) {
        try {
            let q = collection(db, COLLECTIONS.PRODUCTS);
            const constraints = [];

            if (category) constraints.push(where("category", "==", category));
            if (minPrice) constraints.push(where("price", ">=", parseFloat(minPrice)));
            if (maxPrice) constraints.push(where("price", "<=", parseFloat(maxPrice)));

            constraints.push(orderBy(sortBy, sortOrder));
            constraints.push(limit(pageLimit));

            const productQuery = query(q, ...constraints);
            const snapshot = await getDocs(productQuery);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null
            }));
        } catch (error) {
            console.error("Client side fetch error:", error);
            // Fallback for missing indexes
            const snapshot = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
            let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            if (category) products = products.filter(p => p.category === category);
            return products.slice(0, pageLimit);
        }
    },

    async getById(id) {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
    }
};
