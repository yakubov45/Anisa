import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("onepc");
        const brands = await db.collection("brands").find({}).toArray();
        return NextResponse.json(brands);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db("onepc");
        const body = await request.json();
        
        // Check limit (max 14 brands)
        const count = await db.collection("brands").countDocuments();
        if (count >= 14) {
            return NextResponse.json({ error: "Maximum brand capacity reached (14)" }, { status: 400 });
        }

        const result = await db.collection("brands").insertOne({
            ...body,
            createdAt: new Date()
        });
        
        return NextResponse.json(result);
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const client = await clientPromise;
        const db = client.db("onepc");
        
        await db.collection("brands").deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
