"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import useStore from "@/store/useStore";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/constants";

export function CartSyncProvider({ children }) {
    const { user } = useUser();
    const cart = useStore(state => state.cart);
    const setCart = useStore(state => state.setCart);

    // Sync FROM Firestore on login
    useEffect(() => {
        if (user?.uid) {
            const fetchCart = async () => {
                const docRef = doc(db, COLLECTIONS.CARTS, user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setCart(docSnap.data().items || []);
                }
            };
            fetchCart();
        }
    }, [user, setCart]);

    // Sync TO Firestore on change
    useEffect(() => {
        if (user?.uid && cart.length > 0) {
            const timer = setTimeout(async () => {
                const docRef = doc(db, COLLECTIONS.CARTS, user.uid);
                await setDoc(docRef, {
                    items: cart,
                    updatedAt: new Date()
                }, { merge: true });
            }, 2000); // Debounce sync
            return () => clearTimeout(timer);
        }
    }, [cart, user]);

    return children;
}
