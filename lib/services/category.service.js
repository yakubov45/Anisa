import { collection, getDocs, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/client";
import { COLLECTIONS } from "../constants";

export const categoryService = {
    /**
     * Get all categories sorted by name
     */
    async getAll() {
        const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy("name"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    async create(data) {
        const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), data);
        return docRef.id;
    },

    async update(id, data) {
        const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
        await updateDoc(docRef, data);
    },

    async delete(id) {
        const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
        await deleteDoc(docRef);
    }
};
