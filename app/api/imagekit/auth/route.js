import { NextResponse } from "next/server";

// ImageKit is deprecated in favor of Cloudflare R2
export async function GET() {
    return NextResponse.json(
        { error: "ImageKit service has been deprecated and disabled." },
        { status: 403 }
    );
}
