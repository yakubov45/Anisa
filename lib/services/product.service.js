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
    },

    /**
     * Sanitize input payload (NoSQL Injection & Mass Assignment prevention)
     */
    sanitizeProductData(data) {
        // Faqat ruxsat etilgan maydonlarni qabul qilish
        const allowedFields = ['name', 'nameRu', 'nameEn', 'description', 'descriptionRu', 'descriptionEn', 'price', 'category', 'brand', 'image', 'images', 'stock', 'specs', 'status'];
        const sanitized = {};
        
        for (const key of allowedFields) {
            if (data[key] !== undefined) {
                // Xavfli type'larni (masalan object o'rniga kelgan function yoki nosql querylar) tozalash
                if (key === 'price' || key === 'stock') {
                    sanitized[key] = Number(data[key]) || 0;
                } else {
                    sanitized[key] = data[key];
                }
            }
        }
        return sanitized;
    },

    /**
     * Create product securely
     */
    async create(data) {
        const { addDoc } = await import("firebase/firestore");
        const sanitizedData = this.sanitizeProductData(data);
        sanitizedData.createdAt = new Date();
        
        const docRef = await addDoc(collection(db, COLLECTIONS.PRODUCTS), sanitizedData);
        return { id: docRef.id, ...sanitizedData };
    },

    /**
     * Update product securely
     */
    async update(id, data) {
        const { updateDoc } = await import("firebase/firestore");
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        
        const sanitizedData = this.sanitizeProductData(data);
        sanitizedData.updatedAt = new Date();
        
        await updateDoc(docRef, sanitizedData);
        return { id, ...sanitizedData };
    },

    /**
     * Delete product securely
     */
    async delete(id) {
        const { deleteDoc } = await import("firebase/firestore");
        const docRef = doc(db, COLLECTIONS.PRODUCTS, id);
        await deleteDoc(docRef);
        return true;
    }
};
