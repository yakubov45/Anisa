import { db } from "@/lib/firebase/client"
import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore"

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

// Helper to fetch from Firestore REST API (Stable for Server-side)
async function fetchFromRest(collectionName, limitCount = null) {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${collectionName}?pageSize=300`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        const results = data.documents?.map(d => {
            const fields = d.fields;
            const result = { id: d.name.split('/').pop() };
            for (const key in fields) {
                const valueObj = fields[key];
                const typeKey = Object.keys(valueObj)[0];
                result[key] = typeKey === 'integerValue' || typeKey === 'doubleValue' ? Number(valueObj[typeKey]) : valueObj[typeKey];
            }
            return result;
        }) || [];

        // Sort by createdAt descending
        const sorted = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return limitCount ? sorted.slice(0, limitCount) : sorted;
    } catch (error) {
        console.error("REST API failed:", error.message);
        return [];
    }
}

export async function getProducts(limitCount = null) {
    if (typeof window === "undefined") {
        try {
            return await fetchFromRest("products", limitCount);
        } catch (error) {
            console.error("Server-side REST fetch failed:", error.message);
        }
    }

    try {
        let q = query(collection(db, "products"), orderBy("createdAt", "desc"));
        if (limitCount) {
            q = query(q, limit(limitCount));
        }
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products from Firestore SDK:", error.message);
        return [];
    }
}

export async function getPreBuiltSystems() {
    if (typeof window === "undefined") {
        try {
            return await fetchFromRest("preBuiltSystems");
        } catch (error) {
            console.error("Server-side REST fetch failed:", error.message);
        }
    }

    try {
        const querySnapshot = await getDocs(collection(db, "preBuiltSystems"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching pre-builts:", error.message);
        return [];
    }
}

export async function getPreBuiltById(id) {
    try {
        const docRef = doc(db, "preBuiltSystems", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error fetching build by ID:", error.message);
        return null;
    }
}

export async function getBrands() {
    if (typeof window === "undefined") {
        try {
            return await fetchFromRest("brands");
        } catch (error) {
            console.error("Server-side REST fetch failed:", error.message);
        }
    }

    try {
        const querySnapshot = await getDocs(collection(db, "brands"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching brands:", error.message);
        return [];
    }
}

export async function getProductById(id) {
    if (!id) return null;
    
    if (typeof window === "undefined") {
        try {
            if (!PROJECT_ID) {
                console.warn("NEXT_PUBLIC_FIREBASE_PROJECT_ID is missing for server-side fetch");
                return null;
            }
            const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/products/${id}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                console.error(`REST API error: ${response.status} for product ${id}`);
                return null;
            }

            const d = await response.json();
            if (d && d.fields) {
                const fields = d.fields;
                const result = { id: d.name.split('/').pop() };
                for (const key in fields) {
                    const valueObj = fields[key];
                    const typeKey = Object.keys(valueObj)[0];
                    result[key] = typeKey === 'integerValue' || typeKey === 'doubleValue' ? Number(valueObj[typeKey]) : valueObj[typeKey];
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
            return { id: docSnap.id, ...docSnap.data() };
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
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products by IDs:", error.message);
        return [];
    }
}
