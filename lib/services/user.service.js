import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/client";
import { COLLECTIONS } from "../constants";

export const userService = {
    /**
     * Get user profile details
     */
    async getProfile(uid) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        const snapshot = await getDoc(docRef);
        return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
    },

    /**
     * Update user profile
     */
    async updateProfile(uid, data) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        await updateDoc(docRef, { ...data, updatedAt: new Date() });
    },

    /**
     * Add shipping address
     */
    async addAddress(uid, address) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        await updateDoc(docRef, {
            addresses: arrayUnion({ ...address, id: Date.now().toString() })
        });
    },

    /**
     * Delete shipping address
     */
    async deleteAddress(uid, addressId) {
        const docRef = doc(db, COLLECTIONS.USERS, uid);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            const addresses = snapshot.data().addresses || [];
            const updatedAddresses = addresses.filter(a => a.id !== addressId);
            await updateDoc(docRef, { addresses: updatedAddresses });
        }
    },
    
    /**
     * Get all users (Admin)
     */
    async getAllUsers(roleFilter = null) {
        const { collection, getDocs, query, where } = await import("firebase/firestore");
        let q = collection(db, COLLECTIONS.USERS);
        if (roleFilter) {
            q = query(q, where("role", "==", roleFilter));
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
};
