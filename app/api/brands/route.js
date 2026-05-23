import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';
import * as admin from 'firebase-admin';

export async function GET() {
    try {
        if (!adminDb) return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });
        
        const snapshot = await adminDb.collection("brands").orderBy("createdAt", "desc").get();
        const brands = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json(brands);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

import { z } from 'zod';

const BrandSchema = z.object({
    name: z.string().min(2, "Brand name must be at least 2 characters"),
    logo: z.string().url("Logo must be a valid URL")
});

export async function POST(request) {
    try {
        if (!adminDb) return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });

        const body = await request.json();
        
        // Zod validation
        const validatedBody = BrandSchema.parse(body);
        
        // Check limit (max 14 brands)
        const snapshot = await adminDb.collection("brands").get();
        if (snapshot.size >= 14) {
            return NextResponse.json({ error: "Maximum brand capacity reached (14)" }, { status: 400 });
        }

        const docRef = await adminDb.collection("brands").add({
            ...validatedBody,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        
        return NextResponse.json({ id: docRef.id, ...validatedBody });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        if (!adminDb) return NextResponse.json({ error: "Firebase admin not configured" }, { status: 500 });

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        await adminDb.collection("brands").doc(id).delete();
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
