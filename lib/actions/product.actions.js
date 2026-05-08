"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache } from "next/cache";

const COLLECTIONS = {
    PRODUCTS: "products",
    CATEGORIES: "categories",
    BRANDS: "brands",
    BANNERS: "banners",
    PREBUILTS: "preBuiltSystems",
    SETTINGS: "settings"
};

// Helper for timeout
const withTimeout = (promise, ms, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

export const getProductsAction = unstable_cache(
    async (limitCount = 12) => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.PRODUCTS).orderBy("createdAt", "desc").limit(limitCount);
            const snapshot = await withTimeout(query.get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            }));
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },
    ['products-list'],
    { revalidate: 3600, tags: ['products'] }
);

export const getProductsByIdsAction = async (ids) => {
    if (!adminDb || !ids || ids.length === 0) return [];
    try {
        const limitedIds = ids.slice(0, 30);
        const query = adminDb.collection(COLLECTIONS.PRODUCTS).where("__name__", "in", limitedIds);
        const snapshot = await withTimeout(query.get(), 5000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        }));
    } catch (error) {
        console.error("Error fetching products by IDs:", error);
        return [];
    }
};

export const getCategoriesAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.CATEGORIES).orderBy("name");
            const snapshot = await withTimeout(query.get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    },
    ['categories-list'],
    { revalidate: 3600, tags: ['categories'] }
);

export const getBrandsAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.BRANDS).orderBy("name");
            const snapshot = await withTimeout(query.get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching brands:", error);
            return [];
        }
    },
    ['brands-list'],
    { revalidate: 3600, tags: ['brands'] }
);

export const getBannersAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.BANNERS).orderBy("order", "asc");
            const snapshot = await withTimeout(query.get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },
    ['banners-list'],
    { revalidate: 3600, tags: ['banners'] }
);

export const getPreBuiltSystemsAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.PREBUILTS);
            const snapshot = await withTimeout(query.get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching pre-builts:", error);
            return [];
        }
    },
    ['prebuilts-list'],
    { revalidate: 3600, tags: ['prebuilts'] }
);
