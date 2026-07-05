"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache } from "next/cache";

const COLLECTIONS = {
    PRODUCTS: "products",
    CATEGORIES: "categories",
    BRANDS: "brands",
    BANNERS: "banners",
    PREBUILTS: "prebuilts",
    SETTINGS: "settings"
};

const normalizeCategory = (cat) => {
    if (!cat) return cat;
    const lower = cat.toLowerCase();
    if (lower === 'psus') return 'PSUs';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
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

export async function getAdminProductsAction(page = 1, pageSize = 10) {
    if (!adminDb) return { products: [], total: 0 };
    try {
        const offset = (page - 1) * pageSize;
        const totalSnap = await adminDb.collection(COLLECTIONS.PRODUCTS).count().get();
        const total = totalSnap.data().count;

        const query = adminDb.collection(COLLECTIONS.PRODUCTS)
            .orderBy("createdAt", "desc")
            .offset(offset)
            .limit(pageSize);
        
        const snapshot = await query.get();
        const products = snapshot.docs.map(serializeDoc).filter(Boolean);
        return { products, total };
    } catch (error) {
        console.error("Error fetching admin products:", error);
        return { products: [], total: 0 };
    }
}

/**
 * Filtered and Paginated products
 */
export async function getFilteredProductsAction({ categoryId, sortBy = 'newest', page = 1, pageSize = 12 }) {
    if (!adminDb) return [];
    
    // Create a dynamic cache key
    const cacheKey = `filtered-${categoryId || 'all'}-${sortBy}-${page}-${pageSize}`;
    
    const fetcher = unstable_cache(
        async () => {
            try {
                let query = adminDb.collection(COLLECTIONS.PRODUCTS);

                const normalizedCategoryId = normalizeCategory(categoryId);

                if (normalizedCategoryId) {
                    query = query.where("category", "==", normalizedCategoryId);
                }

                // If no category filter, we can safely use orderBy since it only needs single-field index
                // If category is present, doing where + orderBy requires a Composite Index.
                // To prevent breaking for users without the index, we won't use orderBy here 
                // when categoryId is present. We will sort in JS.
                if (!normalizedCategoryId) {
                    if (sortBy === 'price-low') {
                        query = query.orderBy("price", "asc");
                    } else if (sortBy === 'price-high') {
                        query = query.orderBy("price", "desc");
                    } else {
                        query = query.orderBy("createdAt", "desc");
                    }
                }

                // We fetch a larger limit to safely sort in memory if categoryId is present
                const fetchLimit = normalizedCategoryId ? 200 : pageSize;
                const offset = normalizedCategoryId ? 0 : (page - 1) * pageSize;

                const snapshot = await withTimeout(query.offset(offset).limit(fetchLimit).get(), 5000, null);
                if (!snapshot) return [];
                
                let products = snapshot.docs.map(serializeDoc).filter(Boolean);

                // Manual sorting in JS if we skipped orderBy
                if (normalizedCategoryId) {
                    if (sortBy === 'price-low') {
                        products.sort((a, b) => a.price - b.price);
                    } else if (sortBy === 'price-high') {
                        products.sort((a, b) => b.price - a.price);
                    } else {
                        products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    }
                    
                    // Manual pagination
                    const start = (page - 1) * pageSize;
                    products = products.slice(start, start + pageSize);
                }

                return products;
            } catch (error) {
                console.error("Error in getFilteredProductsAction:", error);
                return [];
            }
        },
        [cacheKey],
        { revalidate: 60, tags: ["products"] }
    );

    return fetcher();
}

/**
 * Total products count (Cached)
 */
export async function getProductsCountAction(categoryId = null) {
    if (!adminDb) return 0;
    
    const normalizedCategoryId = normalizeCategory(categoryId);
    const cacheKey = `products-count-${normalizedCategoryId || 'all'}`;
    
    const fetcher = unstable_cache(
        async () => {
            try {
                let query = adminDb.collection(COLLECTIONS.PRODUCTS);
                if (normalizedCategoryId) {
                    query = query.where("category", "==", normalizedCategoryId);
                }
                const snapshot = await query.count().get();
                return snapshot.data().count;
            } catch (error) {
                console.error("Error fetching products count:", error);
                return 0;
            }
        },
        [cacheKey],
        { revalidate: 3600, tags: ["products"] }
    );
    
    return fetcher();
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
        const normalizedCategorySlug = normalizeCategory(categorySlug);
        const query = adminDb.collection(COLLECTIONS.PRODUCTS).where("category", "==", normalizedCategorySlug).limit(50);
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
            const snapshot = await withTimeout(query.get(), 10000, null);
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

export const getPreBuiltSystemsAction = unstable_cache(
    async (filters = {}) => {
        if (!adminDb) return [];
        try {
            let query = adminDb.collection(COLLECTIONS.PREBUILTS);
            
            if (filters.isFeatured) {
                query = query.where("isFeatured", "==", true);
            } else {
                query = query.orderBy("createdAt", "desc");
            }
            
            if (filters.limit) {
                query = query.limit(filters.limit);
            }

            const snapshot = await withTimeout(query.get(), 10000, null);
            if (!snapshot) return [];
            return snapshot.docs.map(serializeDoc).filter(Boolean);
        } catch (error) {
            console.error("Error fetching pre-builts:", error);
            return [];
        }
    },
    ["prebuilts-list"],
    { revalidate: 60, tags: ["prebuilts"] }
);

export async function getPreBuiltByIdAction(id) {
    if (!adminDb || !id) return null;
    try {
        const doc = await adminDb.collection(COLLECTIONS.PREBUILTS).doc(id).get();
        if (!doc.exists) return null;
        return serializeDoc(doc);
    } catch (error) {
        console.error("Error fetching prebuilt by id:", error);
        return null;
    }
}


export async function createPreBuiltSystemAction(data) {
    if (!adminDb) throw new Error("No db connection");
    try {
        const newRef = adminDb.collection(COLLECTIONS.PREBUILTS).doc();
        await newRef.set({
            ...data,
            createdAt: new Date().toISOString()
        });
        return { success: true, id: newRef.id };
    } catch (error) {
        console.error("Error creating pre-built:", error);
        return { success: false, error: error.message };
    }
}

export async function updatePreBuiltSystemAction(id, data) {
    if (!adminDb || !id) throw new Error("No database connection or invalid ID");
    try {
        await adminDb.collection(COLLECTIONS.PREBUILTS).doc(id).set({
            ...data,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return { success: true };
    } catch (error) {
        console.error("Error updating prebuilt system:", error);
        return { success: false, error: error.message };
    }
}

export async function deletePreBuiltSystemAction(id) {
    if (!adminDb || !id) throw new Error("No database connection or invalid ID");
    try {
        await adminDb.collection(COLLECTIONS.PREBUILTS).doc(id).delete();
        return { success: true };
    } catch (error) {
        console.error("Error deleting prebuilt system:", error);
        return { success: false, error: error.message };
    }
}

export async function getSearchProductsAction(searchQuery = "", limit = 50) {
    if (!adminDb) return [];
    try {
        const snapshot = await adminDb.collection(COLLECTIONS.PRODUCTS).limit(300).get();
        const products = snapshot.docs.map(serializeDoc).filter(Boolean);
        if (!searchQuery) return products.slice(0, limit);
        const query = searchQuery.toLowerCase().trim();
        const filtered = products.filter(p => 
            p.name?.toLowerCase().includes(query) || 
            p.category?.toLowerCase().includes(query) ||
            p.brand?.toLowerCase().includes(query) ||
            p.description?.toLowerCase().includes(query)
        );
        return filtered.slice(0, limit);
    } catch (error) {
        console.error("Error searching products:", error);
        return [];
    }
}
