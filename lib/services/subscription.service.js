import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/client";

export const subscriptionService = {
    async subscribe(email) {
        if (!email || !email.includes('@')) {
            throw new Error("Invalid email identity protocol");
        }

        // Check if already subscribed
        const q = query(collection(db, "subscriptions"), where("email", "==", email.toLowerCase()));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            throw new Error("Identity already synchronized");
        }

        const docRef = await addDoc(collection(db, "subscriptions"), {
            email: email.toLowerCase(),
            subscribedAt: serverTimestamp(),
            status: 'active'
        });

        return docRef.id;
    }
};
