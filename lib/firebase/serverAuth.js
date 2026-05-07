import { adminAuth, adminDb } from "./admin";

export async function verifyAuth(request) {
    if (!adminAuth || !adminDb) {
        console.warn("Server misconfiguration: Firebase Admin credentials missing.");
        return { error: "Server misconfiguration", status: 500 };
    }

    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return { error: "Unauthorized: Missing or invalid token", status: 401 };
    }

    const token = authHeader.split("Bearer ")[1];
    
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        // Custom Claims o'rniga ma'lumotlar bazasidan rolni olamiz (OnePC strukturasiga mos)
        const userDoc = await adminDb.collection("users").doc(decodedToken.uid).get();
        const role = userDoc.exists ? userDoc.data().role : 'user';

        return { 
            user: { 
                uid: decodedToken.uid, 
                email: decodedToken.email,
                role: role 
            } 
        };
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return { error: "Unauthorized: Invalid or expired token", status: 401 };
    }
}

export async function requireAdmin(request) {
    const authResult = await verifyAuth(request);
    if (authResult.error) return authResult;
    
    const role = authResult.user.role;
    if (role !== 'admin' && role !== 'superadmin') {
        return { error: "Forbidden: Admin access required", status: 403 };
    }
    
    return authResult; // Muvaffaqiyatli bo'lsa { user: {...} } qaytaradi
}

export async function requireDeliveryOrAdmin(request) {
    const authResult = await verifyAuth(request);
    if (authResult.error) return authResult;
    
    const role = authResult.user.role;
    if (role !== 'admin' && role !== 'superadmin' && role !== 'delivery') {
        return { error: "Forbidden: Elevated access required", status: 403 };
    }
    
    return authResult;
}

export async function requireSuperAdmin(request) {
    const authResult = await verifyAuth(request);
    if (authResult.error) return authResult;
    
    if (authResult.user.role !== 'superadmin') {
        return { error: "Forbidden: Super Admin access required", status: 403 };
    }
    
    return authResult;
}
