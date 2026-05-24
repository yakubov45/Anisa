import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth.service";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(request) {
    const { limited, response } = await rateLimit(request, { 
        limit: 5,           // 5 urinish
        windowMs: 15 * 60_000, // 15 daqiqa ichida
        keyPrefix: "auth"
    });
    if (limited) return response;

    const { email, password, action } = await request.json();
    
    // Simplistic sanitization
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
        return NextResponse.json({ error: "Invalid input format" }, { status: 400 });
    }

    try {
        if (action === "login") {
            await authService.login(email, password);
        } else if (action === "register") {
            await authService.register({ email, password });
        } else {
             return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Auth operation failed" }, { status: 401 });
    }
}
