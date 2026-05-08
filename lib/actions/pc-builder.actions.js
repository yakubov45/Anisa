"use server";

import { adminDb } from "@/lib/firebase/admin";
import { unstable_cache, revalidateTag } from "next/cache";

const SETTINGS_COLLECTION = "settings";
const HERO_DOC = "pc_builder_hero";

export const getPCBuilderHeroAction = unstable_cache(
    async () => {
        try {
            if (!adminDb) {
                console.warn("adminDb is null, returning default PC Builder videos");
                return {
                    video1: "/videos/0508.mp4",
                    video2: "/videos/0508 (2).mp4"
                };
            }
            const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(HERO_DOC);
            const snapshot = await docRef.get();
            
            if (snapshot.exists) {
                return snapshot.data();
            }
            
            // Default fallback videos
            return {
                video1: "/videos/0508.mp4",
                video2: "/videos/0508 (2).mp4"
            };
        } catch (error) {
            console.error("Error fetching PC Builder Hero via Server Action:", error);
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
    try {
        const docRef = adminDb.collection(SETTINGS_COLLECTION).doc(HERO_DOC);
        await docRef.set({
            ...data,
            updatedAt: new Date().toISOString()
        }, { merge: true });
        
        revalidateTag('pc-builder-hero');
        return true;
    } catch (error) {
        console.error("Error updating PC Builder Hero via Server Action:", error);
        return false;
    }
}
