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
        }
    ];

    for (const u of users) {
        try {
            let userRecord;
            try {
                // Check if user exists
                userRecord = await auth.getUserByEmail(u.email);
                // Update password for existing user
                await auth.updateUser(userRecord.uid, {
                    password: u.password
                });
                console.log(`Updated password for existing user: ${u.email}`);
            } catch (e) {
                // Create new user
                userRecord = await auth.createUser({
                    email: u.email,
                    password: u.password,
                    displayName: u.displayName,
                });
                console.log(`Created new user: ${u.email}`);
            }

            // Sync with Firestore
            await db.collection("users").doc(userRecord.uid).set({
                uid: userRecord.uid,
                email: u.email,
                displayName: u.displayName,
                role: u.role,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            }, { merge: true });

            console.log(`Successfully synced ${u.role}: ${u.email}`);
        } catch (error) {
            console.log(`Error processing ${u.email}:`, error.message);
        }
    }
    process.exit();
}

seedUsers();
