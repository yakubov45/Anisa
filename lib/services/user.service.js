import { doc, getDoc, updateDoc, setDoc, arrayUnion } from "firebase/firestore";
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
        const updateData = { ...data, updatedAt: new Date() };
        // Remove empty values to avoid overwriting with nulls if not intended
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
        await setDoc(docRef, updateData, { merge: true });
    },

    /**
     * Upload Avatar to ImageKit
     */
    async uploadAvatar(uid, file) {
        // ImageKit auth tokenini olish
        const authRes = await fetch('/api/imagekit/auth');
        if (!authRes.ok) throw new Error("ImageKit auth xatosi");
        const { signature, expire, token } = await authRes.json();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", `avatar_${uid}_${Date.now()}`);
        formData.append("folder", "/avatars");
        formData.append("publicKey", process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY);
        formData.append("signature", signature);
        formData.append("expire", expire);
        formData.append("token", token);

        const uploadRes = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
            method: "POST",
            body: formData,
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.json();
            throw new Error(err.message || "Avatar yuklashda xato");
        }

        const uploadData = await uploadRes.json();
        const downloadURL = uploadData.url;

        // Firestore'da yangilash
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
