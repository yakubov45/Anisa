import { db } from "@/lib/firebase/client"
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore"

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'one-pc-42454';

// Helper to normalize data from Firestore SDK (handles References and Timestamps)
function normalizeDoc(doc) {
    const data = doc.data() || {};
    const result = { id: doc.id };

    for (const key in data) {
        const val = data[key];

        if (val === null || val === undefined) {
            result[key] = null;
        }
        else if (typeof val.toDate === 'function') {
            result[key] = val.toDate().toISOString();
        }
        else if (val && typeof val === 'object' && val.path && typeof val.path === 'string') {
            result[key] = val.id || val.path.split('/').pop();
        }
        else if (Array.isArray(val)) {
            result[key] = val.map(v => {
                if (v && typeof v === 'object' && v.path) return (v.id || v.path.split('/').pop());
                return v;
            });
        }
        else {
            result[key] = val;
        }
    }
    return result;
}

// REST API parsing helper
function parseRestValue(valueObj) {
    if (!valueObj) return null;
    const typeKey = Object.keys(valueObj)[0];
    const val = valueObj[typeKey];

    if (typeKey === 'integerValue' || typeKey === 'doubleValue') return Number(val);
    if (typeKey === 'booleanValue') return Boolean(val);
    if (typeKey === 'stringValue') return String(val);
    if (typeKey === 'referenceValue') return val.split('/').pop();
    if (typeKey === 'timestampValue') return val;
    if (typeKey === 'nullValue') return null;
    if (typeKey === 'arrayValue') {
        return (val.values || []).map(parseRestValue);
    }
    if (typeKey === 'mapValue') {
        const res = {};
        const fields = val.fields || {};
        for (const k in fields) {
            res[k] = parseRestValue(fields[k]);
        }
        return res;
    }
    return val;
}

// Helper to fetch from Firestore REST API (Stable for Server-side)
async function fetchFromRest(collectionName, limitCount = null) {
    if (!PROJECT_ID) {
        console.error("FIREBASE_PROJECT_ID is missing for REST API fetch");
        return [];
    }
    
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}?pageSize=300`;
    try {
        const response = await fetch(url, { next: { revalidate: 60 } });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        const data = await response.json();

        const results = data.documents?.map(d => {
            const fields = d.fields || {};
            const result = { id: d.name.split('/').pop() };
            for (const key in fields) {
                result[key] = parseRestValue(fields[key]);
            }
            return result;
        }) || [];

        const sorted = results.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
            const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
            return dateB - dateA;
        });

        return limitCount ? sorted.slice(0, limitCount) : sorted;
    } catch (error) {
        console.error(`REST API failed for ${collectionName}:`, error.message);
        return [];
    }
}

export async function getProducts(limitCount = null, categoryId = null) {
    const products = (typeof window === "undefined") 
        ? await fetchFromRest("products", limitCount)
        : await (async () => {
            try {
                const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
                const snap = await getDocs(q);
                return snap.docs.map(normalizeDoc);
            } catch (e) { return []; }
          })();

    if (!categoryId) return limitCount ? products.slice(0, limitCount) : products;

    const lowSearch = categoryId.toLowerCase().trim();
    
    // Yadroviy qidiruv: Kategoriya, nom yoki brend bo'yicha moslikni tekshirish
    const filtered = products.filter(p => {
        // 1. Kategoriya maydonini tekshirish
        const cat = p.category;
        if (cat) {
            const catStr = (typeof cat === 'object' ? (cat.id || cat.name || "") : cat).toString().toLowerCase();
            if (catStr.includes(lowSearch) || lowSearch.includes(catStr)) return true;
        }

        // 2. Mahsulot nomi yoki brendida kategoriya nomi bormi? (Fallback)
        const nameMatch = p.name?.toLowerCase().includes(lowSearch);
        const brandMatch = p.brand?.toLowerCase().includes(lowSearch);
        const typeMatch = p.type?.toLowerCase().includes(lowSearch);
        
        return nameMatch || brandMatch || typeMatch;
    });

    // Agar kategoriya bo'yicha hech narsa topilmasa, foydalanuvchiga hech bo'lmaganda hamma mahsulotni ko'rsatishdan ko'ra 
    // qidiruv natijasini aniqroq qaytarish muhim.
    return limitCount ? filtered.slice(0, limitCount) : filtered;
}

export async function getPreBuiltSystems() {
    if (typeof window === "undefined") {
        return await fetchFromRest("preBuiltSystems");
    }

    try {
        const querySnapshot = await getDocs(collection(db, "preBuiltSystems"));
        return querySnapshot.docs.map(normalizeDoc);
    } catch (error) {
        console.error("Error fetching pre-builts:", error.message);
        return [];
    }
}

export async function getPreBuiltById(id) {
    if (!id) return null;

    if (typeof window === "undefined") {
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/preBuiltSystems/${id}`;
            const response = await fetch(url);
            if (!response.ok) return null;

            const d = await response.json();
            if (d && d.fields) {
                const result = { id: d.name.split('/').pop() };
                for (const key in d.fields) {
                    result[key] = parseRestValue(d.fields[key]);
                }
                return result;
            }
        } catch (error) {
            console.error("Error in getPreBuiltById REST:", error?.message || error);
        }
    }

    try {
        const docRef = doc(db, "preBuiltSystems", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return normalizeDoc(docSnap);
        }
        return null;
    } catch (error) {
        console.error("Error fetching build by ID SDK:", error.message);
        return null;
    }
}

export async function getBrands() {
    if (typeof window === "undefined") {
        return await fetchFromRest("brands");
    }

    try {
        const querySnapshot = await getDocs(collection(db, "brands"));
        return querySnapshot.docs.map(normalizeDoc);
    } catch (error) {
        console.error("Error fetching brands:", error.message);
        return [];
    }
}

export async function getProductById(id) {
    if (!id) return null;
    
    if (typeof window === "undefined") {
        try {
            const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${id}`;
            const response = await fetch(url);
            if (!response.ok) return null;

            const d = await response.json();
            if (d && d.fields) {
                const result = { id: d.name.split('/').pop() };
                for (const key in d.fields) {
                    result[key] = parseRestValue(d.fields[key]);
                }
                return result;
            }
        } catch (error) {
            console.error("Error in getProductById REST:", error?.message || error);
        }
    }

    try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return normalizeDoc(docSnap);
        }
        return null;
    } catch (error) {
        console.error("Error in getProductById SDK:", error?.message || error);
        return null;
    }
}

export async function getProductsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    try {
        const q = query(collection(db, "products"), where("__name__", "in", ids));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(normalizeDoc);
    } catch (error) {
        console.error("Error fetching products by IDs:", error.message);
        return [];
    }
}

export async function getCategories() {
    if (typeof window === "undefined") {
        return await fetchFromRest("categories");
    }

    try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        return querySnapshot.docs.map(normalizeDoc);
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        return [];
    }
}