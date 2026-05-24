import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { COLLECTIONS, ORDER_STATUS } from "@/lib/constants";
import { createHmac } from "crypto";

function verifyClickSignature(body) {
    const { click_trans_id, service_id, merchant_trans_id, amount, sign_time, sign_string } = body;
    const secretKey = process.env.CLICK_SECRET_KEY || "dummy_secret_key";
    const expectedSign = createHmac("md5", secretKey)
        .update(`${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${amount}${sign_time}`)
        .digest("hex");
    return expectedSign === sign_string;
}

function verifyPaymeSignature(request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) return false;
    const token = authHeader.replace("Basic ", "");
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const [login, password] = decoded.split(":");
    return login === "Paycom" && password === (process.env.PAYME_KEY || "dummy_payme_key");
}

/**
 * CLICK/PAYME/UZUM Webhook handler
 * This endpoint verifies payments and updates order status securely on the server.
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { orderId, status, transactionId, amount } = body;
        const provider = request.headers.get("x-payment-provider") || "unknown";

        let isValid = false;
        if (provider === "click") {
            isValid = verifyClickSignature(body);
        } else if (provider === "payme") {
            isValid = verifyPaymeSignature(request);
        } else {
            // For now, if no provider header is matched, we'll reject it
            return NextResponse.json({ error: "Unsupported payment provider" }, { status: 400 });
        }
        
        if (!isValid) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
        }

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
