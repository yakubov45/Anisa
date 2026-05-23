import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' }); // Muhit o'zgaruvchilarini o'qish (.env.local dan)

// Firebase sozlamalari
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kiritiladigan 3 xil tildagi kategoriyalar ro'yxati
const categories = [
    { name: "Noutbuklar", name_ru: "Ноутбуки", name_en: "Laptops", slug: "laptops", icon: "💻" },
    { name: "Tayyor kompyuterlar", name_ru: "Готовые ПК", name_en: "Prebuilts", slug: "prebuilts", icon: "🖥️" },
    { name: "Video kartalar", name_ru: "Видеокарты", name_en: "Graphics Cards", slug: "gpus", icon: "🎮" },
    { name: "Markaziy protsessorlar", name_ru: "Процессоры", name_en: "Processors", slug: "cpus", icon: "🧠" },
    { name: "Ona platalar", name_ru: "Материнские платы", name_en: "Motherboards", slug: "motherboards", icon: "⚙️" },
    { name: "Monitorlar", name_ru: "Мониторы", name_en: "Displays", slug: "monitors", icon: "📺" },
    { name: "Tezkor xotira (RAM)", name_ru: "Оперативная память", name_en: "Memory (RAM)", slug: "ram", icon: "⚡" },
    { name: "Xotira (SSD/HDD)", name_ru: "Накопители", name_en: "Storage", slug: "storage", icon: "💽" },
    { name: "Quvvat bloklari", name_ru: "Блоки питания", name_en: "Power Supplies", slug: "psu", icon: "🔌" },
    { name: "Korpuslar", name_ru: "Корпуса", name_en: "Cases", slug: "cases", icon: "📦" },
    { name: "Sovutish tizimlari", name_ru: "Охлаждение", name_en: "Cooling", slug: "cooling", icon: "❄️" },
    { name: "Klaviaturalar", name_ru: "Клавиатуры", name_en: "Keyboards", slug: "keyboards", icon: "⌨️" },
    { name: "Sichqonchalar", name_ru: "Мыши", name_en: "Mice", slug: "mice", icon: "🖱️" },
    { name: "Aksessuarlar", name_ru: "Аксессуары", name_en: "Accessories", slug: "accessories", icon: "🎧" }
];

async function seed() {
    console.log("Firebase Firestore'ga kategoriyalar kiritilmoqda...");
    try {
        const catRef = collection(db, "categories");
        
        // 1. Eski kategoriyalarni o'qib olish (ikkitadan tushib qolmasligi uchun)
        const snapshot = await getDocs(catRef);
        
        // 2. Eski kategoriyalarni o'chirish
        for (const docSnapshot of snapshot.docs) {
            await deleteDoc(docSnapshot.ref);
            console.log(`O'chirildi (eski): ${docSnapshot.id}`);
        }

        console.log("Yangi kategoriyalarni yuklash boshlandi...");

        // 3. Yangi kategoriyalarni bazaga saqlash
        for (const cat of categories) {
            const docRef = await addDoc(catRef, cat);
            console.log(`Qo'shildi: ${cat.name} (ID: ${docRef.id})`);
        }

        console.log("✅ Barcha kategoriyalar muvaffaqiyatli saqlandi!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Xatolik yuz berdi:", error);
        process.exit(1);
    }
}

seed();
