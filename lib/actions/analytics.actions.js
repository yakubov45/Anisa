"use server";

import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS } from "../constants";

export async function getDashboardStatsAction() {
    if (!adminDb) return null;
    
    try {
        const [productsSnap, usersSnap, ordersSnap] = await Promise.all([
            adminDb.collection(COLLECTIONS.PRODUCTS).get(),
            adminDb.collection(COLLECTIONS.USERS).get(),
            adminDb.collection(COLLECTIONS.ORDERS).get()
        ]);

        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

        return {
            totalProducts: productsSnap.size,
            totalUsers: usersSnap.size,
            totalOrders: ordersSnap.size,
            totalRevenue
        };
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return null;
    }
}

// Fixed missing export for Analytics page
export async function getBusinessAnalyticsAction() {
    return await getDashboardStatsAction();
}
