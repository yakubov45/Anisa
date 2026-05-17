"use server"

import { adminDb } from "@/lib/firebase/admin";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, writeBatch, serverTimestamp, collection } from "firebase/firestore";
import { COLLECTIONS, ORDER_STATUS } from "@/lib/constants";
import { cookies } from "next/headers";

export async function createOrderAction(formData, cartItems) {
    try {
        const useAdmin = !!adminDb;
        // 1. AUTH CHECK
        const cookieStore = await cookies();
        const sessionCookie = cookieStore.get("__session")?.value;
        
        // In a real app, you'd verify the Firebase Session Cookie here
        // For now, we'll assume the user is authenticated if they pass a userId in the formData
        // but we'll do basic checks.
        if (!formData.userId) {
            throw new Error("Authentication required to place an order.");
        }

        // 2. FORM VALIDATION
        if (!formData.fullName || !formData.phone || !formData.address || !formData.region) {
            throw new Error("All shipping fields are required.");
        }

        // 3. SERVER-SIDE PRICE & STOCK VALIDATION
        let validatedItems = [];
        let totalAmount = 0;

        // Use Admin Batch or Client Batch
        const batch = useAdmin ? adminDb.batch() : writeBatch(db);

        for (const item of cartItems) {
            let productData;
            let productRef;

            if (useAdmin) {
                productRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(item.id);
                const productDoc = await productRef.get();
                if (!productDoc.exists) throw new Error(`Product ${item.name} not found.`);
                productData = productDoc.data();
            } else {
                productRef = doc(db, COLLECTIONS.PRODUCTS, item.id);
                const productSnap = await getDoc(productRef);
                if (!productSnap.exists()) throw new Error(`Product ${item.name} not found.`);
                productData = productSnap.data();
            }

            // Check Price
            if (productData.price !== item.price) {
                throw new Error(`ERR_PRICE_CHANGED|${item.name}`);
            }

            // Check Stock
            if (productData.stock < item.quantity) {
                throw new Error(`ERR_INSUFFICIENT_STOCK|${item.name}`);
            }

            validatedItems.push({
                id: item.id,
                name: item.name,
                price: productData.price,
                quantity: item.quantity,
                image: item.image
            });

            totalAmount += productData.price * item.quantity;

            // Update Stock
            if (useAdmin) {
                batch.update(productRef, { stock: productData.stock - item.quantity });
            } else {
                batch.update(productRef, { stock: productData.stock - item.quantity });
            }
        }

        // 4. CREATE ORDER DOCUMENT
        const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        
        // Generate 6-digit OTP for high-value orders (> $1000)
        const otp = totalAmount > 1000 ? Math.floor(100000 + Math.random() * 900000).toString() : null;
        
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 72); // 72 hour expiration

        let orderId;
        const baseOrderData = {
            userId: formData.userId,
            customer: {
                fullName: formData.fullName,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                region: formData.region
            },
            items: validatedItems,
            totalAmount,
            status: ORDER_STATUS.PENDING,
            paymentMethod: formData.paymentMethod,
            delivery: {
                assignedTo: null,
                deliveredAt: null,
                otpRequired: !!otp,
                otp: otp // In production, send this via SMS and don't return to frontend easily
            },
            verification: {
                token: verificationToken,
                qrUsed: false,
                expiresAt: expiresAt.toISOString(),
                createdAt: new Date().toISOString()
            }
        };

        if (useAdmin) {
            const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc();
            orderId = orderRef.id;
            batch.set(orderRef, {
                id: orderId,
                ...baseOrderData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        } else {
            const orderRef = doc(collection(db, COLLECTIONS.ORDERS));
            orderId = orderRef.id;
            batch.set(orderRef, {
                id: orderId,
                ...baseOrderData,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
        }

        // 5. COMMIT
        await batch.commit();

        // 6. TELEGRAM NOTIFICATION (Fire and forget)
        try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            if (botToken && chatId) {
                const message = `🔔 *Yangi Buyurtma!* 🔔\n\n` +
                                `👤 *Mijoz:* ${formData.fullName}\n` +
                                `📞 *Tel:* ${formData.phone}\n` +
                                `📍 *Manzil:* ${formData.region}, ${formData.address}\n\n` +
                                `🛒 *Mahsulotlar:* ${cartItems.length} ta\n` +
                                `💰 *Umumiy summa:* $${totalAmount}\n\n` +
                                `📦 *Buyurtma ID:* \`${orderId}\``;
                                
                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'Markdown'
                    })
                }).catch(e => console.error("Telegram notification failed", e));
            }
        } catch (e) {
            console.error("Telegram error:", e);
        }

        return { success: true, orderId, otpRequired: !!otp };

    } catch (error) {
        console.error("Order Creation Failed:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * VERIFY ORDER ACTION
 * Used by delivery personnel to confirm delivery via QR scan or manual ID
 */
export async function verifyOrderAction(orderId, token, options = {}) {
    try {
        const useAdmin = !!adminDb;
        const { otp, deliveryUserId, location } = options;

        let orderData;
        let orderRef;

        // 1. FETCH ORDER
        if (useAdmin) {
            orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc(orderId);
            const snapshot = await orderRef.get();
            if (!snapshot.exists) throw new Error("Order not found.");
            orderData = snapshot.data();
        } else {
            orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
            const snapshot = await getDoc(orderRef);
            if (!snapshot.exists()) throw new Error("Order not found.");
            orderData = snapshot.data();
        }

        // 2. SECURITY QATLAMI (VALIDATION STACK)
        
        // A. Token Check
        if (orderData.verification.token !== token) {
            throw new Error("Invalid security token. Authentication failed.");
        }

        // B. One-Time Use Check
        if (orderData.verification.qrUsed) {
            throw new Error("Already Consumed: This QR code has already been used for delivery.");
        }

        // C. Expiration Check
        if (new Date(orderData.verification.expiresAt) < new Date()) {
            throw new Error("Expired Protocol: This verification token is no longer valid.");
        }

        // D. OTP Check (For High Value)
        if (orderData.delivery.otpRequired && orderData.delivery.otp !== otp) {
            throw new Error("Invalid OTP: High-value orders require the customer's 6-digit confirmation code.");
        }

        // E. Status Check
        const allowedStatuses = [ORDER_STATUS.PENDING, ORDER_STATUS.CONFIRMED, ORDER_STATUS.SHIPPED];
        if (!allowedStatuses.includes(orderData.status)) {
            throw new Error(`Invalid Status: Order is currently ${orderData.status}.`);
        }

        // 3. UPDATE ORDER (ATOMIC)
        const updateData = {
            status: ORDER_STATUS.DELIVERED,
            "verification.qrUsed": true,
            "delivery.deliveredAt": new Date().toISOString(),
            "delivery.verifiedBy": deliveryUserId || "Unknown",
            "delivery.location": location || null,
            updatedAt: useAdmin ? new Date().toISOString() : serverTimestamp()
        };

        if (useAdmin) {
            await orderRef.update(updateData);
        } else {
            const { updateDoc } = await import("firebase/firestore");
            await updateDoc(orderRef, updateData);
        }

        // 4. GENERATE SERVER-SIDE RECEIPT
        return { 
            success: true, 
            message: "Protocol Authenticated: Order successfully delivered.",
            receipt: {
                id: orderId,
                customer: orderData.customer.fullName,
                items: orderData.items.length,
                total: orderData.totalAmount,
                date: new Date().toISOString(),
                authId: Math.random().toString(36).substring(7).toUpperCase()
            }
        };

    } catch (error) {
        console.error("Verification Failed:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * GET ALL ORDERS (Admin SDK — bypasses security rules)
 * Used by delivery panel to fetch orders without permission issues
 */
export async function getDeliveryOrdersAction(deliveryUserId = null, filterType = "all") {
    try {
        if (!adminDb) throw new Error("Admin DB not initialized");
        
        let snapshot;
        const ordersRef = adminDb.collection(COLLECTIONS.ORDERS);
        
        if (filterType === "my" && deliveryUserId) {
            snapshot = await ordersRef.where("deliveryId", "==", deliveryUserId).get();
        } else if (filterType === "available") {
            snapshot = await ordersRef.where("status", "==", ORDER_STATUS.CONFIRMED).get();
        } else {
            snapshot = await ordersRef.get();
        }
        
        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
            };
        });
        
        // Sort by createdAt descending
        orders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });
        
        return { success: true, orders };
    } catch (error) {
        console.error("getDeliveryOrdersAction Error:", error.message);
        return { success: false, orders: [], error: error.message };
    }
}

/**
 * UPDATE ORDER (Admin SDK)
 */
export async function updateOrderAction(orderId, data) {
    try {
        if (!adminDb) throw new Error("Admin DB not initialized");
        await adminDb.collection(COLLECTIONS.ORDERS).doc(orderId).update({
            ...data,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error("updateOrderAction Error:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * GET SINGLE ORDER BY ID (Admin SDK)
 */
export async function getOrderByIdAction(orderId) {
    try {
        if (!adminDb) throw new Error("Admin DB not initialized");
        const doc = await adminDb.collection(COLLECTIONS.ORDERS).doc(orderId).get();
        if (!doc.exists) return { success: false, error: "Order not found" };
        const data = doc.data();
        return { 
            success: true, 
            order: { 
                id: doc.id, 
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
            } 
        };
    } catch (error) {
        console.error("getOrderByIdAction Error:", error.message);
        return { success: false, error: error.message };
    }
}

/**
 * GET USER ORDERS (Admin SDK)
 * Fetches history for a specific customer
 */
export async function getUserOrdersAction(userId) {
    try {
        if (!adminDb) throw new Error("Admin DB not initialized");
        if (!userId) throw new Error("UserId required");

        const snapshot = await adminDb.collection(COLLECTIONS.ORDERS)
            .where("userId", "==", userId)
            .get();

        const orders = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
            };
        });

        // Sort by date desc
        orders.sort((a, b) => {
            const dateA = new Date(a.createdAt || 0);
            const dateB = new Date(b.createdAt || 0);
            return dateB - dateA;
        });

        return { success: true, orders };
    } catch (error) {
        console.error("getUserOrdersAction Error:", error.message);
        return { success: false, orders: [], error: error.message };
    }
}
