"use server"

import { adminDb } from "@/lib/firebase/admin";
import { db } from "@/lib/firebase/client";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { COLLECTIONS } from "@/lib/constants";

export async function getBusinessAnalyticsAction(range = "30d") {
    try {
        const useAdmin = !!adminDb;
        let orders = [];

        if (useAdmin) {
            const snapshot = await adminDb.collection(COLLECTIONS.ORDERS).get();
            orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } else {
            const snapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
            orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        // 1. Determine days count
        let days = 30;
        if (range === "7d") days = 7;
        if (range === "90d") days = 90;
        if (range === "1y") days = 365;

        // 2. Sales Over Time
        const salesByDate = {};
        const now = new Date();
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date();
            d.setDate(now.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            salesByDate[dateStr] = 0;
        }

        const cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - days);

        orders.forEach(order => {
            const orderDate = order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000) : new Date(order.createdAt);
            if (orderDate >= cutoffDate) {
                const dateStr = orderDate.toISOString().split('T')[0];
                if (salesByDate[dateStr] !== undefined) {
                    salesByDate[dateStr] += order.totalAmount || 0;
                }
            }
        });

        const salesChartData = Object.keys(salesByDate).map(date => ({
            date,
            amount: salesByDate[date]
        }));

        // 3. Stats for selected period
        const periodOrders = orders.filter(o => {
            const d = o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000) : new Date(o.createdAt);
            return d >= cutoffDate;
        });

        const totalRevenue = periodOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
        const totalOrders = periodOrders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // 3. Top Performers
        const productStats = {};
        orders.forEach(order => {
            order.items?.forEach(item => {
                if (!productStats[item.name]) {
                    productStats[item.name] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productStats[item.name].quantity += item.quantity || 0;
                productStats[item.name].revenue += (item.price * item.quantity) || 0;
            });
        });

        const topPerformers = Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        // 4. Status Breakdown
        const statusBreakdown = {};
        orders.forEach(order => {
            statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1;
        });

        return {
            success: true,
            stats: {
                totalRevenue,
                totalOrders,
                avgOrderValue,
                salesChartData,
                topPerformers,
                statusBreakdown
            }
        };

    } catch (error) {
        console.error("Analytics Error:", error);
        return { success: false, error: error.message };
    }
}
