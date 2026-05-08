"use client";

import { useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import useStore from "@/store/useStore";
import { getCartAction, saveCartAction } from "@/lib/actions/cart.actions";

export function CartSyncProvider({ children }) {
    const { user } = useUser();
    const cart = useStore(state => state.cart);
    const setCart = useStore(state => state.setCart);

    // Sync FROM Firestore on login
    useEffect(() => {
        if (user?.uid) {
            const fetchCart = async () => {
                const items = await getCartAction(user.uid);
                if (items && items.length > 0) {
                    setCart(items);
                }
            };
            fetchCart();
        }
    }, [user?.uid, setCart]);

    // Sync TO Firestore on change
    useEffect(() => {
        if (user?.uid && cart.length > 0) {
            const timer = setTimeout(async () => {
                await saveCartAction(user.uid, cart);
            }, 3000); // Debounce sync (3s)
            return () => clearTimeout(timer);
        }
    }, [cart, user?.uid]);

    return children;
}
