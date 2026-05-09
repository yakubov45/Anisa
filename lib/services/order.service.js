import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    serverTimestamp,
    orderBy,
    onSnapshot
} from "firebase/firestore";
import { db } from "../firebase/client";
import { COLLECTIONS, ORDER_STATUS } from "../constants";

export const orderService = {
    /**
     * Subscribe to delivery orders for a specific courier
     */
    listenToDeliveryOrders(deliveryId, callback) {
        const q = query(
            collection(db, COLLECTIONS.ORDERS),
            where("deliveryId", "==", deliveryId)
        );
        return onSnapshot(q, (snapshot) => {
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort client-side to avoid needing a composite index
            const sortedOrders = orders.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || 0;
                const dateB = b.createdAt?.toDate?.() || 0;
                return dateB - dateA;
            });
            callback(sortedOrders);
        }, (error) => {
            console.error("Error listening to delivery orders:", error);
            callback([]); // Return empty list on error
        });
    },
    /**
     * Get single order by ID
     */
    async getById(id) {
        const docRef = doc(db, COLLECTIONS.ORDERS, id);
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() };
    },

    /**
     * Create a new order from cart data
     */
    async createOrder(orderData) {
        const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), {
            ...orderData,
            status: ORDER_STATUS.PENDING,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    },

    /**
     * Get current user's order history
     */
    async getUserOrders(userId) {
        try {
            const q = query(
                collection(db, COLLECTIONS.ORDERS),
                where("userId", "==", userId)
            );
            const snapshot = await getDocs(q);
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return orders.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || 0;
                const dateB = b.createdAt?.toDate?.() || 0;
                return dateB - dateA;
            });
        } catch (error) {
            console.error("Error getting user orders:", error);
            return [];
        }
    },

    /**
     * Get all orders (Admin/Delivery)
     */
    async getAllOrders(statusFilter = null) {
        try {
            let q = collection(db, COLLECTIONS.ORDERS);
            if (statusFilter) {
                q = query(q, where("status", "==", statusFilter));
            }
            const snapshot = await getDocs(q);
            const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return orders.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || 0;
                const dateB = b.createdAt?.toDate?.() || 0;
                return dateB - dateA;
            });
        } catch (error) {
            console.error("Error getting all orders:", error);
            return [];
        }
    },

    /**
     * Update order status
     */
    async updateStatus(orderId, newStatus) {
        const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(docRef, {
            status: newStatus,
            updatedAt: serverTimestamp()
        });
    },

    /**
     * Update order metadata (General purpose)
     */
    async updateOrder(orderId, data) {
        const docRef = doc(db, COLLECTIONS.ORDERS, orderId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp()
        });
    }
};
