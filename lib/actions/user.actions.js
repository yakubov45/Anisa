"use server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "../constants";

export async function getUserDataAction(uid) {
    if (!adminDb || !uid) return null;
    
    try {
        const userDoc = await adminDb.collection(COLLECTIONS.USERS).doc(uid).get();
        if (userDoc.exists) {
            const data = userDoc.data();
            return {
                id: userDoc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user data via Server Action:", error);
        return null;
    }
}

export async function checkPhoneStatusAction(phoneNumber) {
    if (!adminDb || !phoneNumber) return { success: false, exists: false };
    
    try {
        const snapshot = await adminDb.collection(COLLECTIONS.USERS)
            .where("phoneNumber", "==", phoneNumber)
            .limit(1)
            .get();
            
        if (snapshot.empty) {
            return { success: true, exists: false };
        }

        const userData = snapshot.docs[0].data();
        return { 
            success: true, 
            exists: true, 
            hasPassword: userData.hasPassword === true,
            email: userData.email // Return the linked email
        };
    } catch (error) {
        console.error("Error checking phone status:", error);
        return { success: false, error: error.message };
    }
}

export async function checkEmailExistsAction(email) {
    if (!adminDb || !email) return { success: false, exists: false };
    
    try {
        const snapshot = await adminDb.collection(COLLECTIONS.USERS)
            .where("email", "==", email)
            .limit(1)
            .get();
            
        return { success: true, exists: !snapshot.empty };
    } catch (error) {
        console.error("Error checking email existence:", error);
        return { success: false, error: error.message };
    }
}

export async function updateEmailAdminAction(uid, newEmail) {
    const { adminAuth } = await import("@/lib/firebase/admin");
    if (!adminAuth || !uid || !newEmail) return { success: false, error: "Invalid parameters" };

    try {
        await adminAuth.updateUser(uid, {
            email: newEmail,
            emailVerified: false
        });
        return { success: true };
    } catch (error) {
        console.error("Admin Email Update Error:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePasswordAdminAction(uid, newPassword) {
    const { adminAuth } = await import("@/lib/firebase/admin");
    if (!adminAuth || !uid || !newPassword) return { success: false, error: "Invalid parameters" };

    try {
        await adminAuth.updateUser(uid, {
            password: newPassword
        });
        return { success: true };
    } catch (error) {
        console.error("Admin Password Update Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getUsersByRoleAction(role) {
    try {
        if (!adminDb) throw new Error("Admin DB not initialized");
        const snapshot = await adminDb.collection(COLLECTIONS.USERS)
            .where("role", "==", role)
            .get();
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
            };
        });
        return { success: true, users };
    } catch (error) {
        console.error("getUsersByRoleAction Error:", error.message);
        return { success: false, users: [], error: error.message };
    }
}
