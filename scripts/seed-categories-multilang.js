const admin = require("firebase-admin");
const dotenv = require("dotenv");
const path = require("path");

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

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

const categories = [
    { name: "Noutbuklar", name_ru: "Ноутбуки", name_en: "Laptops", slug: "laptops", icon: "💻" },
    { name: "Kompyuterlar", name_ru: "Компьютеры", name_en: "Workstations", slug: "workstations", icon: "🖥️" },
    { name: "Monitorlar", name_ru: "Мониторы", name_en: "Monitors", slug: "monitors", icon: "🖥️" },
    { name: "Sichqonchalar", name_ru: "Мыши", name_en: "Mice", slug: "mice", icon: "🖱️" },
    { name: "Klaviaturalar", name_ru: "Клавиатуры", name_en: "Keyboards", slug: "keyboards", icon: "⌨️" },
    { name: "Quloqchinlar", name_ru: "Наушники", name_en: "Headsets", slug: "headsets", icon: "🎧" },
    { name: "Protsessorlar", name_ru: "Процессоры", name_en: "Processors", slug: "processors", icon: "⚡" },
    { name: "Videokartalar", name_ru: "Видеокарты", name_en: "Graphics Cards", slug: "graphics", icon: "🎮" },
    { name: "Operativ xotira", name_ru: "Оперативная память", name_en: "Memory", slug: "memory", icon: "📟" },
    { name: "Xotira disklari", name_ru: "Накопители", name_en: "Storage", slug: "storage", icon: "💾" },
    { name: "Quvvat manbalari", name_ru: "Блоки питания", name_en: "Power Supplies", slug: "psus", icon: "🔌" },
    { name: "Kompyuter korpuslari", name_ru: "Корпуса", name_en: "Cases", slug: "cases", icon: "📦" },
    { name: "Sovitish tizimlari", name_ru: "Системы охлаждения", name_en: "Cooling", slug: "cooling", icon: "❄️" },
    { name: "Ona platalar", name_ru: "Материнские платы", name_en: "Motherboards", slug: "motherboards", icon: "🧩" },
    { name: "Tayyor kompyuterlar", name_ru: "Готовые ПК", name_en: "Prebuilt PCs", slug: "prebuilts", icon: "🚀" }
];

async function seedCategories() {
    console.log("Seeding multilingual categories into Firestore...");

    for (const cat of categories) {
        // Set document with slug as ID
        await db.collection("categories").doc(cat.slug).set({
            name: cat.name,
            name_ru: cat.name_ru,
            name_en: cat.name_en,
            slug: cat.slug,
            icon: cat.icon,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        console.log(`✅ Category seeded: ${cat.name} / ${cat.name_ru} / ${cat.name_en} (${cat.slug})`);
    }

    console.log("🎉 All categories successfully seeded into Firestore!");
    process.exit(0);
}

seedCategories().catch(err => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
});
