import { NextResponse } from "next/server";
import { orderService } from "@/lib/services/order.service";

export async function GET() {
    try {
        const orders = await orderService.getAllOrders();
        return NextResponse.json(orders);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const order = await orderService.create(body);
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}
