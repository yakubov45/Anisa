import { NextResponse } from "next/server";

// This endpoint has been disabled for security reasons to protect production data.
export async function GET() {
    return NextResponse.json(
        { error: "Seeding endpoint is permanently disabled in production." },
        { status: 403 }
    );
}
