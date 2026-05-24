import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/order.service";
import { rateLimit } from "@/lib/rateLimit";
import { requireAdmin } from "@/lib/firebase/serverAuth";

export async function GET(request) {
    // Faqat admin barcha buyurtmalarni ko'ra oladi
    const auth = await requireAdmin(request);
    if (auth.error) {
        return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    try {
        const orders = await orderService.getAllOrders();
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(request) {
    // Rate limit: 1 daqiqada bitta IP dan maksimum 5 ta buyurtma
    const { limited, response } = await rateLimit(request, { 
        limit: 5, 
        windowMs: 60_000, 
        keyPrefix: "order" 
    });
    if (limited) return response;

    try {
        const body = await request.json();
        // orderService method called createOrder based on previous check
        const orderId = await orderService.createOrder(body);
        return NextResponse.json({ id: orderId, ...body }, { status: 201 });
    } catch (error) {
        console.error("Order Creation API Error:", error);
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
