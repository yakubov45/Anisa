// scripts/seed.js
// Run this with "node scripts/seed.js" if you have firebase-admin credentials set up
// or use it as a reference for manual filling.

const admin = require("firebase-admin");

// Initialize with your service account key
// const serviceAccount = require("./serviceAccountKey.json");
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const seedProducts = async () => {
    const products = [
        {
            name: "MacBook Pro 14 M3",
            price: 1999,
            category: "laptop",
            specs: "M3 Pro, 18GB RAM, 512GB SSD",
            image: "https://images.unsplash.com/photo-1517336714460-4c5049c07173",
            brand: "Apple",
            countInStock: 10,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        },
        {
            name: "ASUS ROG Strix G16",
            price: 1450,
            category: "laptop",
            specs: "RTX 4060, i7-13650HX, 16GB RAM",
            image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302",
            brand: "ASUS",
            countInStock: 5,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        }
    ];

    for (const product of products) {
        await db.collection("products").add(product);
        console.log(`Added product: ${product.name}`);
    }
};

const seedCategories = async () => {
    const categories = [
        { name: "Laptop", slug: "laptop" },
        { name: "PC", slug: "pc" },
        { name: "Monitor", slug: "monitor" },
        { name: "Accessories", slug: "accessories" }
    ];

    for (const cat of categories) {
        await db.collection("categories").doc(cat.slug).set(cat);
        console.log(`Added category: ${cat.name}`);
    }
};

// Uncomment to run:
// seedCategories().then(() => seedProducts());
