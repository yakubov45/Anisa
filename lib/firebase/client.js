import { getAuth } from "firebase/auth";
import { 
    getFirestore, 
    initializeFirestore, 
    memoryLocalCache 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import app from "./config";




// Initialize Firebase services safely
let auth;
try {
    auth = getAuth(app);
} catch (e) {
    console.warn("Failed to initialize Firebase Auth:", e?.message);
}

const isServer = typeof window === "undefined";

let db;
try {
    db = initializeFirestore(app, {
        experimentalForceLongPolling: isServer,
        localCache: memoryLocalCache(), 
    });
} catch (e) {
    try {
        db = getFirestore(app);
    } catch (err) {
        console.warn("Failed to initialize Firestore:", err?.message);
    }
}

let storage;
try {
    storage = getStorage(app);
} catch (e) {
    console.warn("Failed to initialize Firebase Storage:", e?.message);
}

export { auth, db, storage };

// Analytics (Client-side only)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
