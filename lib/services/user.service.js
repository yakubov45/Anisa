import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase/client";
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
        const updateData = { ...data, updatedAt: new Date() };
        // Remove empty values to avoid overwriting with nulls if not intended
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        await setDoc(docRef, updateData, { merge: true });
    },

    /**
     * Upload Avatar to Storage
     */
    async uploadAvatar(uid, file) {
        const storageRef = ref(storage, `avatars/${uid}_${Date.now()}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        // Update user document with new photoURL
        await this.updateProfile(uid, { photoURL: downloadURL, avatar: downloadURL });
        return downloadURL;
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
    },

    /**
     * Check if email exists in database
     */
    async checkEmailExists(email) {
        const { collection, getDocs, query, where } = await import("firebase/firestore");
        const q = query(collection(db, COLLECTIONS.USERS), where("email", "==", email));
        const snapshot = await getDocs(q);
        return !snapshot.empty;
    }
};
