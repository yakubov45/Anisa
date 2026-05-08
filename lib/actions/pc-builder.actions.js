"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache, revalidateTag } from "next/cache";

const SETTINGS_COLLECTION = "settings";
const HERO_DOC = "pc_builder_hero";

// Helper for timeout
const withTimeout = (promise, ms, fallback) => {
    return Promise.race([
        promise,
        new Promise((resolve) => setTimeout(() => resolve(fallback), ms))
    ]);
};

export const getPCBuilderHeroAction = unstable_cache(
    async () => {
        if (!adminDb) return { video1: "/videos/0508.mp4", video2: "/videos/0508 (2).mp4" };
        
        try {
            const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(HERO_DOC);
            const snapshot = await withTimeout(docRef.get(), 5000, { exists: false });
            
            if (snapshot && snapshot.exists) {
                const data = snapshot.data();
                return {
                    ...data,
                    updatedAt: data.updatedAt || new Date().toISOString()
                };
            }
            
            return {
                video1: "/videos/0508.mp4",
                video2: "/videos/0508 (2).mp4"
            };
        } catch (error) {
            console.error("Error fetching PC Builder Hero:", error);
            return {
                video1: "/videos/0508.mp4",
                video2: "/videos/0508 (2).mp4"
            };
        }
    },
    ['pc-builder-hero-settings'],
    { revalidate: 3600, tags: ['pc-builder-hero'] }
);

export async function updatePCBuilderHeroAction(data) {
    if (!adminDb) return false;
    try {
        const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(HERO_DOC);
        await docRef.set({
            ...data,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        revalidateTag('pc-builder-hero');
        return true;
    } catch (error) {
        console.error("Error updating PC Builder Hero:", error);
        return false;
    }
}
