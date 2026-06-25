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
export async function getBusinessAnalyticsAction(range = "30d") {
    if (!adminDb) return { success: false, error: "DB connection failed" };
    try {
        const ordersSnap = await adminDb.collection(COLLECTIONS.ORDERS).get();
        const orders = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        const statusBreakdown = orders.reduce((acc, order) => {
            const status = order.status || "pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
        }, {});

        // Mock data for chart & performers since we don't have detailed historical queries implemented
        const salesChartData = Array.from({ length: 30 }).map((_, i) => ({
            date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
            amount: Math.floor(Math.random() * 5000) + 500
        }));

        const topPerformers = [
            { name: "Intel Core i9-14900K System", revenue: 15000, quantity: 5 },
            { name: "RTX 4090 Ultimate Build", revenue: 12000, quantity: 3 },
            { name: "Ryzen 7 7800X3D Gaming", revenue: 8500, quantity: 7 },
        ];

        return {
            success: true,
            stats: {
                totalRevenue,
                avgOrderValue,
                totalOrders,
                statusBreakdown,
                salesChartData,
                topPerformers
            }
        };
    } catch (error) {
        console.error("Error fetching analytics:", error);
        return { success: false, error: "Failed to fetch" };
    }
}
