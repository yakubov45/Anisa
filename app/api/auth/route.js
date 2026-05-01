import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth.service";

export async function POST(request) {
    const { email, password, action } = await request.json();
    try {
        if (action === "login") {
            await authService.login(email, password);
        } else if (action === "register") {
            await authService.register({ email, password });
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Auth operation failed" }, { status: 401 });
    }
}
