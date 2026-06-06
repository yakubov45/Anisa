"use server"

import { adminDb } from "@/lib/firebase/admin";
import { db } from "@/lib/firebase/client";
import { doc, getDoc, writeBatch, serverTimestamp, collection } from "firebase/firestore";
import { COLLECTIONS, ORDER_STATUS } from "@/lib/constants";
import { cookies } from "next/headers";

import { z } from "zod";

const OrderFormSchema = z.object({
    userId: z.string().min(1, "Authentication required"),
    fullName: z.string().min(3, "Ism-familiya kamida 3 ta harf bo'lishi kerak"),
    phone: z.string().min(9, "To'g'ri telefon raqami kiriting"),
    email: z.string().email("Xato email").optional().or(z.literal("")),
    address: z.string().min(5, "Manzil to'liq kiritilishi kerak"),
    region: z.string().min(2, "Viloyat tanlanishi kerak"),
    paymentMethod: z.enum(["cash", "payme", "click"]).default("cash"),
});

const CartItemsSchema = z.array(z.object({
    id: z.string(),
    baseProductId: z.string().optional(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
    image: z.string().optional(),
    category: z.string().optional(),
    variant: z.any().optional(),
}));

export async function createOrderAction(formData, cartItems) {
    try {
        const useAdmin = !!adminDb;
        if (!useAdmin) throw new Error("Server xatosi: Admin bazasiga ulanib bo'lmadi.");

        // 1. ZOD VALIDATION (XAVFSIZLIK)
        const validatedForm = OrderFormSchema.parse(formData);
        const validatedCart = CartItemsSchema.parse(cartItems);

        let validatedItems = [];
        let totalAmount = 0;
        let orderId;
        let otp;
        
        // 2. TRANSACTION (OMBOR QOLDIG'INI XAVFSIZ AYIRISH)
        await adminDb.runTransaction(async (transaction) => {
            validatedItems = [];
            totalAmount = 0;

            // Avval hamma mahsulotlarni o'qiymiz (Transaction qoidasi: avval o'qish, keyin yozish)
            const productRefs = validatedCart.map(item => {
                const collectionName = item.category === 'prebuilt' ? 'prebuilts' : COLLECTIONS.PRODUCTS;
                const docId = item.baseProductId || item.id;
                return { item, ref: adminDb.collection(collectionName).doc(docId) };
            });

            const productDocs = await Promise.all(productRefs.map(p => transaction.get(p.ref)));

            // Tekshiruv va hisob-kitob
            for (let i = 0; i < productDocs.length; i++) {
                const productDoc = productDocs[i];
                const { item, ref } = productRefs[i];

                if (!productDoc.exists) throw new Error(`Xato: ${item.name} topilmadi.`);
                const productData = productDoc.data();

                let currentStock = productData.stock ?? productData.countInStock;
                let currentPrice = productData.price || productData.basePrice;
                let variantIndex = -1;

                if (item.variant && productData.variants) {
                    variantIndex = productData.variants.findIndex(v => v.id === item.variant.id);
                    if (variantIndex !== -1) {
                        currentStock = productData.variants[variantIndex].stock;
                        currentPrice = productData.variants[variantIndex].price;
                    }
                }

                if (productData.discount > 0) {
                    currentPrice = currentPrice * (1 - productData.discount / 100);
                }

                if (currentPrice !== item.price) {
                    throw new Error(`Narx o'zgargan: ${item.name}. Iltimos savatni yangilang.`);
                }

                if (currentStock !== undefined && currentStock < item.quantity) {
                    throw new Error(`Kechirasiz, ${item.name} omborda yetarli emas. (Qoldiq: ${currentStock} ta)`);
                }

                validatedItems.push({
                    id: item.id,
                    baseProductId: item.baseProductId || item.id,
                    name: item.name,
                    price: currentPrice,
                    quantity: item.quantity,
                    image: item.image || "",
                    variant: item.variant || null
                });

                totalAmount += currentPrice * item.quantity;

                // Zaxirani ayirish (Stock deduction)
                if (variantIndex !== -1) {
                    const updatedVariants = [...productData.variants];
                    updatedVariants[variantIndex].stock -= item.quantity;
                    transaction.update(ref, { variants: updatedVariants });
                } else if (productData.stock !== undefined || productData.countInStock !== undefined) {
                    const fieldToUpdate = productData.stock !== undefined ? 'stock' : 'countInStock';
                    transaction.update(ref, { [fieldToUpdate]: currentStock - item.quantity });
                }
            }

            // Buyurtma hujjati yaratish (Order Document)
            const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            otp = totalAmount > 1000 ? Math.floor(100000 + Math.random() * 900000).toString() : null;
            
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 72);

            const orderRef = adminDb.collection(COLLECTIONS.ORDERS).doc();
            orderId = orderRef.id;

            const baseOrderData = {
                id: orderId,
                userId: validatedForm.userId,
                customer: {
                    fullName: validatedForm.fullName,
                    phone: validatedForm.phone,
                    email: validatedForm.email || "",
                    address: validatedForm.address,
                    region: validatedForm.region
                },
                items: validatedItems,
                totalAmount,
                status: ORDER_STATUS.PENDING,
                paymentMethod: validatedForm.paymentMethod,
                delivery: {
                    assignedTo: null,
                    deliveredAt: null,
                    otpRequired: !!otp,
                    otp: otp
                },
                verification: {
                    token: verificationToken,
                    qrUsed: false,
                    expiresAt: expiresAt.toISOString(),
                    createdAt: new Date().toISOString()
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            transaction.set(orderRef, baseOrderData);
        });

        // 6. TELEGRAM NOTIFICATION (Fire and forget)
        try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;
            
            if (botToken && chatId) {
                const formatTelegramPrice = (val) => {
                    const isUzs = val > 100000;
                    return isUzs 
                        ? `${Math.round(val).toLocaleString('uz-UZ')} UZS` 
                        : `$${val.toLocaleString('en-US')}`;
                };

                const itemsList = cartItems.map((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    return `${index + 1}. <b>${item.name}</b>\n` +
                           `   └─ ${item.quantity} ta × ${formatTelegramPrice(item.price)} = <b>${formatTelegramPrice(itemTotal)}</b>`;
                }).join('\n');

                const formattedTotal = formatTelegramPrice(totalAmount);
                const message = `🚀 <b>YANGI BUYURTMA QABUL QILINDI!</b> 🚀\n` +
                                `───────────────────────────\n` +
                                `🆔 <b>Buyurtma ID:</b> <code>#${orderId}</code>\n\n` +
                                `👤 <b>Mijoz:</b> <b>${formData.fullName}</b>\n` +
                                `📞 <b>Telefon:</b> <code>${formData.phone}</code>\n` +
                                `📍 <b>Manzil:</b> <code>${formData.region}, ${formData.address}</code>\n` +
                                `💳 <b>To'lov turi:</b> <code>${formData.paymentMethod === 'cash' ? "Naqd (Cash on Delivery)" : formData.paymentMethod.toUpperCase()}</code>\n\n` +
                                `───────────────────────────\n` +
                                `🛒 <b>Buyurtma tarkibi:</b>\n` +
                                `${itemsList}\n\n` +
                                `───────────────────────────\n` +
                                `💰 <b>Jami summa:</b> <b>${formattedTotal}</b>\n` +
                                `💼 <b>Status:</b> ⏳ Kutilmoqda (Pending)\n` +
                                `📅 <b>Vaqt:</b> <code>${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}</code>`;
                                
                fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: chatId,
                        text: message,
                        parse_mode: 'HTML'
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
