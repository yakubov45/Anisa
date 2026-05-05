const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

if (!process.env.FIREBASE_PRIVATE_KEY || !process.env.FIREBASE_CLIENT_EMAIL) {
    console.error("Missing Firebase credentials in .env.local");
    process.exit(1);
}

const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "one-pc-42454",
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const categories = [
    "Cases", "Cooling", "Graphics", "Klaviaturalar", "Kompyuterlar", 
    "Kullerlar", "Memory", "Motherboards", "Noutbuklar", "Processors", 
    "PSUs", "Quloqchinlar", "Sichqonchalar", "Storage"
];

const brands = ["ASUS", "MSI", "Gigabyte", "Corsair", "Razer", "Logitech", "Samsung", "Intel", "AMD", "DeepCool"];

const generateProduct = (categoryName) => {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const price = Math.floor(Math.random() * 1000) + 50;
    const stock = Math.floor(Math.random() * 50);
    const rating = (Math.random() * 2 + 3).toFixed(1); // 3.0 to 5.0
    
    return {
        name: `${brand} High-Performance ${categoryName.slice(0, -1)}`,
        price: price * 12500, // UZS approximation
        category: categoryName,
        brand: brand,
        stock: stock,
        rating: parseFloat(rating),
        description: `Premium ${categoryName} designed for extreme performance and reliability. Perfect for professional gaming and workstation deployments.`,
        image: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000000)}?w=800&auto=format&fit=crop`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        specs: "High-speed components, Durable build, 2-year warranty"
    };
};

const seed = async () => {
    console.log("Starting seed process...");

    for (const catName of categories) {
        // Create category doc
        const catId = catName.toLowerCase();
        await db.collection("categories").doc(catId).set({
            name: catName,
            id: catId,
            slug: catId
        }, { merge: true });
        console.log(`Verified category: ${catName}`);

        // Add 5 products per category
        for (let i = 0; i < 5; i++) {
            const product = generateProduct(catName);
            // Specific names for some categories
            if (catName === "Processors") {
                const cpu = i % 2 === 0 ? "Core i9-14900K" : "Ryzen 9 7950X";
                product.name = `${brand = brands[i%brands.length]} ${cpu} Special Edition`;
            } else if (catName === "Graphics") {
                const gpu = i % 2 === 0 ? "RTX 4090" : "RX 7900 XTX";
                product.name = `${brand = brands[i%brands.length]} ${gpu} 24GB Gaming OC`;
            }

            await db.collection("products").add(product);
        }
        console.log(`Added 5 products to ${catName}`);
    }

    console.log("Seeding completed successfully!");
    process.exit(0);
};

seed().catch(err => {
    console.error("Seed failed:", err);
    process.exit(1);
});
