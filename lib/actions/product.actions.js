"use server";

import { adminDb } from "@/lib/firebase/admin";

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

export async function getProductsAction(limitCount = 12) {
    if (!adminDb) return [];
    try {
        const query = adminDb.collection(COLLECTIONS.PRODUCTS).orderBy("createdAt", "desc").limit(limitCount);
        const snapshot = await withTimeout(query.get(), 3000, null);
        if (!snapshot) return [];
        return snapshot.docs.map(serializeDoc).filter(Boolean);
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

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

export async function getCategoriesAction() {
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
}

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

export async function getBannersAction() {
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
}

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
