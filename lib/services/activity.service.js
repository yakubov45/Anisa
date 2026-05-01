import { db } from "@/lib/firebase/client";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "firebase/firestore";

const COLLECTION = "activity_logs";

export const logActivity = async (userId, userName, action, details) => {
    try {
        await addDoc(collection(db, COLLECTION), {
            userId,
            userName,
            action,
            details,
            timestamp: serverTimestamp()
        });
    } catch (e) {
        console.error("Failed to log activity:", e);
    }
};

export const getActivityLogs = async (max = 50) => {
    const q = query(collection(db, COLLECTION), orderBy("timestamp", "desc"), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
