import * as admin from "firebase-admin";

const isConfigured = 
    process.env.FIREBASE_CLIENT_EMAIL && 
    process.env.FIREBASE_PRIVATE_KEY;

if (!admin.apps.length && isConfigured) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
            }),
        });
        console.log("Firebase Admin Initialized Successfully");
    } catch (error) {
        console.error("Firebase Admin Initialization Error:", error.message);
    }
} else if (!isConfigured) {
    console.warn("Firebase Admin credentials missing. Server-side admin features will be disabled.");
}

export const adminDb = isConfigured ? admin.firestore() : null;
export const adminAuth = isConfigured ? admin.auth() : null;
export const adminStorage = isConfigured ? admin.storage() : null;
