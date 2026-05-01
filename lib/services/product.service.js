import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    orderBy,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    limit
} from "firebase/firestore";
import { db } from "../firebase/client";
import { COLLECTIONS } from "../constants";

export const productService = {
    /**
     * Get all products with filtering and sorting
     */
    async getAll({ category, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', pageLimit = 20 } = {}) {
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
            ...doc.data()
        }));
    },

    /**
     * Get a single product by ID
     */
    async getById(id) {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
    },

    /**
     * Add a new product (Admin only logic should be enforced via Security Rules)
     */
    async create(productData) {
        const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), {
            ...productData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    },

    /**
     * Update product
     */
    async update(id, updateData) {
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        await updateDoc(docRef, {
            ...updateData,
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Delete product
     */
    async delete(id) {
        await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    }
};
