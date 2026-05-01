const admin = require("firebase-admin");
const dotenv = require("dotenv");
dotenv.config({ path: ".env.local" });

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        })
    });
}

const db = admin.firestore();
const auth = admin.auth();

async function seedUsers() {
    const users = [
        {
            email: "admin@onepc.uz",
            password: "admin123456",
            displayName: "System Admin",
            role: "admin"
        },
        {
            email: "delivery@onepc.uz",
            password: "delivery123456",
            displayName: "Fast Delivery",
            role: "delivery"
        }
    ];

    for (const u of users) {
        try {
            // Create user in Firebase Auth
            const userRecord = await auth.createUser({
                email: u.email,
                password: u.password,
                displayName: u.displayName,
            });

            // Create profile in Firestore
            await db.collection("users").doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: u.email,
                displayName: u.displayName,
                role: u.role,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Successfully created ${u.role}: ${u.email}`);
        } catch (error) {
            console.log(`Error creating ${u.email}:`, error.message);
        }
    }
    process.exit();
}

seedUsers();
