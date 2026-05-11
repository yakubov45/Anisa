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

const serializeDoc = (doc) => {
    if (!doc.exists) return null;
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        price: Number(data.price) || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
    };
};

const withTimeout = (promise, ms, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

// --- CACHED ACTIONS ---

/**
 * Fetches products with caching, ISR and true Pagination
 * @param {number} page - Current page number
 * @param {number} pageSize - Products per page
 * @returns {Promise<Array>}
 */
export const getProductsAction = unstable_cache(
    async (page = 1, pageSize = 12) => {
        if (!adminDb) return [];
        try {
            const offset = (page - 1) * pageSize;
            const query = adminDb.collection(COLLECTIONS.PRODUCTS)
                .orderBy("createdAt", "desc")
                .offset(offset)
                .limit(pageSize);
            
            const snapshot = await withTimeout(query.get(), 10000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(serializeDoc).filter(Boolean);
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },
    ["products-list"],
    { revalidate: 60, tags: ["products"] }
);

/**
 * Filtered and Paginated products (Cached)
 */
export const getFilteredProductsAction = unstable_cache(
    async ({ categoryId, sortBy = 'newest', page = 1, pageSize = 12 }) => {
        if (!adminDb) return [];
        try {
            const offset = (page - 1) * pageSize;
            let query = adminDb.collection(COLLECTIONS.PRODUCTS);

            if (categoryId) {
                query = query.where("category", "==", categoryId);
            }

            if (sortBy === 'price-low') {
                query = query.orderBy("price", "asc");
            } else if (sortBy === 'price-high') {
                query = query.orderBy("price", "desc");
            } else {
                query = query.orderBy("createdAt", "desc");
            }

            const snapshot = await withTimeout(query.offset(offset).limit(pageSize).get(), 5000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(serializeDoc).filter(Boolean);
        } catch (error) {
            console.error("Error in getFilteredProductsAction:", error);
            return [];
        }
    },
    ["filtered-products"],
    { revalidate: 60, tags: ["products"] }
);

/**
 * Total products count (Cached)
 */
export const getProductsCountAction = unstable_cache(
    async (categoryId = null) => {
        if (!adminDb) return 0;
        try {
            let query = adminDb.collection(COLLECTIONS.PRODUCTS);
            if (categoryId) {
                query = query.where("category", "==", categoryId);
            }
            const snapshot = await query.count().get();
            return snapshot.data().count;
        } catch (error) {
            console.error("Error fetching products count:", error);
            return 0;
        }
    },
    ["products-count"],
    { revalidate: 3600, tags: ["products"] }
);

export async function getProductsByIdsAction(ids) {
    if (!adminDb || !ids || ids.length === 0) return [];
    try {
        const limitedIds = ids.slice(0, 30);
        const query = adminDb.collection(COLLECTIONS.PRODUCTS).where("__name__", "in", limitedIds);
        const snapshot = await withTimeout(query.get(), 3000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(serializeDoc).filter(Boolean);
    } catch (error) {
        console.error("Error fetching products by IDs:", error);
        return [];
    }
}

export async function getCategoryProductsAction(categorySlug) {
    if (!adminDb || !categorySlug) return [];
    try {
        const query = adminDb.collection(COLLECTIONS.PRODUCTS).where("category", "==", categorySlug).limit(50);
        const snapshot = await withTimeout(query.get(), 3000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(serializeDoc).filter(Boolean);
    } catch (error) {
        console.error("Error fetching category products:", error);
        return [];
    }
}

export const getCategoriesAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.CATEGORIES).orderBy("name");
            const snapshot = await withTimeout(query.get(), 3000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    },
    ["categories-list"],
    { revalidate: 3600, tags: ["categories"] }
);

export async function getBrandsAction() {
    if (!adminDb) return [];
    try {
        const query = adminDb.collection(COLLECTIONS.BRANDS).orderBy("name");
        const snapshot = await withTimeout(query.get(), 3000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching brands:", error);
        return [];
    }
}

export const getBannersAction = unstable_cache(
    async () => {
        if (!adminDb) return [];
        try {
            const query = adminDb.collection(COLLECTIONS.BANNERS).orderBy("order", "asc");
            const snapshot = await withTimeout(query.get(), 3000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching banners:", error);
            return [];
        }
    },
    ["banners-list"],
    { revalidate: 300, tags: ["banners"] }
);

export async function getPreBuiltSystemsAction() {
    if (!adminDb) return [];
    try {
        const query = adminDb.collection(COLLECTIONS.PREBUILTS);
        const snapshot = await withTimeout(query.get(), 3000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching pre-builts:", error);
        return [];
    }
}
