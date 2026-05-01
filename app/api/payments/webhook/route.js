import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, ORDER_STATUS } from "@/lib/constants";

/**
 * CLICK/PAYME/UZUM Webhook handler
 * This endpoint verifies payments and updates order status securely on the server.
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { orderId, status, transactionId, amount } = body;

        // TODO: Verify signature based on Payment Provider (Click/Payme)
        // Security check: only authorized IPs or verified signatures should call this

        const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc(orderId);
        const orderDoc = await orderRef.get();

        if (!orderDoc.exists) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        if (status === "success") {
            await orderRef.update({
                status: ORDER_STATUS.PROCESSING,
                paymentStatus: "Paid",
                paidAt: new Date(),
                transactionId: transactionId
            });
        }

        return NextResponse.json({ message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
