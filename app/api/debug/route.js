import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/admin';

export async function GET() {
    try {
        const catSnap = await adminDb.collection("categories").get();
        const cats = catSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const prodSnap = await adminDb.collection("products").get();
        const prods = prodSnap.docs.map(d => ({ id: d.id, name: d.data().name, category: d.data().category }));

        return NextResponse.json({ cats, prods });
    } catch (e) {
        return NextResponse.json({ error: e.message });
    }
}
