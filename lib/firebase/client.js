import { getAuth } from "firebase/auth";
import { 
    getFirestore, 
    initializeFirestore, 
    memoryLocalCache 
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import app from "./config";




// Initialize Firebase services
export const auth = getAuth(app);

// Use initializeFirestore with memoryLocalCache to disable disk persistence
// and force long-polling to fix GRPC issues in Node.js environment.
const isServer = typeof window === "undefined";

export const db = initializeFirestore(app, {
    experimentalForceLongPolling: isServer, // Force long-polling on server-side, use standard WebSockets on client
    localCache: memoryLocalCache(), 
});

export const storage = getStorage(app);

// Analytics (Client-side only)
export const analytics = typeof window !== "undefined" ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null;

export default app;
