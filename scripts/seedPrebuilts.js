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

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const prebuilts = [
    {
        name: "OnePC Quantum Strike",
        price: 18500000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["New", "Hot"],
        description: "Optimal gaming performance for 1440p gaming. Featuring the latest Intel Core i5 and RTX 4060 Ti.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672", "https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "Intel Core i5-13400F", gpu: "RTX 4060 Ti 8GB", ram: "16GB DDR5 5200MHz", storage: "1TB M.2 NVMe Gen4" },
        specifications: [
            { name: "CPU", value: "Intel Core i5-13400F" },
            { name: "GPU", value: "NVIDIA GeForce RTX 4060 Ti 8GB" },
            { name: "RAM", value: "16GB DDR5 5200MHz Corsair Vengeance" },
            { name: "Storage", value: "1TB M.2 NVMe Gen4 Kingston" },
            { name: "Motherboard", value: "B760M DDR5 Wi-Fi" },
            { name: "PSU", value: "650W 80+ Bronze" },
            { name: "Cooling", value: "240mm AIO Liquid Cooler" }
        ],
        stock: 5
    },
    {
        name: "OnePC Titan Extreme",
        price: 35000000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["Premium"],
        description: "Uncompromised 4K gaming and heavy rendering. The Titan Extreme destroys any workload you throw at it.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "Intel Core i9-14900K", gpu: "RTX 4080 Super 16GB", ram: "32GB DDR5 6400MHz", storage: "2TB M.2 NVMe Gen4" },
        specifications: [
            { name: "CPU", value: "Intel Core i9-14900K" },
            { name: "GPU", value: "NVIDIA GeForce RTX 4080 Super 16GB" },
            { name: "RAM", value: "32GB DDR5 6400MHz G.Skill Trident Z5 RGB" },
            { name: "Storage", value: "2TB Samsung 990 Pro M.2 NVMe" },
            { name: "Motherboard", value: "Z790 ATX Wi-Fi 7" },
            { name: "PSU", value: "850W 80+ Gold Fully Modular" },
            { name: "Cooling", value: "360mm AIO LCD Liquid Cooler" }
        ],
        stock: 2
    },
    {
        name: "OnePC Shadow Edge",
        price: 24000000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["Bestseller"],
        description: "The ultimate sweet spot for hardcore gamers. Sleek, stealthy, and deadly in competitive matches.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "AMD Ryzen 7 7800X3D", gpu: "RTX 4070 Super 12GB", ram: "32GB DDR5 6000MHz", storage: "1TB M.2 NVMe Gen4" },
        specifications: [
            { name: "CPU", value: "AMD Ryzen 7 7800X3D" },
            { name: "GPU", value: "NVIDIA GeForce RTX 4070 Super 12GB" },
            { name: "RAM", value: "32GB DDR5 6000MHz Kingston Fury Beast" },
            { name: "Storage", value: "1TB WD Black SN850X" },
            { name: "Motherboard", value: "B650 ATX Wi-Fi" },
            { name: "PSU", value: "750W 80+ Gold" },
            { name: "Cooling", value: "Dual Tower Air Cooler" }
        ],
        stock: 8
    },
    {
        name: "OnePC Apex Legend",
        price: 15500000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["Esports"],
        description: "Built strictly for high FPS in Esports titles. Never drop a frame when it matters most.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "AMD Ryzen 5 7600X", gpu: "RTX 4060 8GB", ram: "16GB DDR5 5600MHz", storage: "1TB M.2 NVMe" },
        specifications: [
            { name: "CPU", value: "AMD Ryzen 5 7600X" },
            { name: "GPU", value: "NVIDIA GeForce RTX 4060 8GB" },
            { name: "RAM", value: "16GB DDR5 5600MHz" },
            { name: "Storage", value: "1TB M.2 NVMe" },
            { name: "Motherboard", value: "A620M Wi-Fi" },
            { name: "PSU", value: "600W 80+ Bronze" },
            { name: "Cooling", value: "120mm Tower Air Cooler" }
        ],
        stock: 12
    },
    {
        name: "OnePC Creator Pro",
        price: 42000000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["Workstation"],
        description: "For professionals who need maximum multi-core performance for 3D rendering and video editing.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "AMD Ryzen 9 7950X", gpu: "RTX 4090 24GB", ram: "64GB DDR5 6000MHz", storage: "4TB M.2 NVMe Gen4" },
        specifications: [
            { name: "CPU", value: "AMD Ryzen 9 7950X" },
            { name: "GPU", value: "NVIDIA GeForce RTX 4090 24GB" },
            { name: "RAM", value: "64GB DDR5 6000MHz (2x32GB)" },
            { name: "Storage", value: "4TB (2x2TB) M.2 NVMe Gen4" },
            { name: "Motherboard", value: "X670E E-ATX Wi-Fi 6E" },
            { name: "PSU", value: "1200W 80+ Platinum" },
            { name: "Cooling", value: "Custom Loop Liquid Cooling Ready / 360mm AIO" }
        ],
        stock: 1
    }
];

// Add 10 more random prebuilts to reach 15 total
for(let i=1; i<=10; i++) {
    const isBudget = i % 3 === 0;
    prebuilts.push({
        name: `OnePC Custom Build v${i}`,
        price: isBudget ? (12000000 + i * 500000) : (20000000 + i * 1500000),
        category: "prebuilt",
        isFeatured: false,
        badges: isBudget ? ["Budget"] : ["RGB"],
        description: "Reliable and powerful prebuilt PC tailored for smooth gaming and multitasking.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { 
            cpu: isBudget ? "Intel Core i5-12400F" : "Intel Core i7-13700F", 
            gpu: isBudget ? "RTX 3060 12GB" : "RTX 4070 12GB", 
            ram: "16GB DDR4 3200MHz", 
            storage: "1TB M.2 NVMe" 
        },
        specifications: [
            { name: "CPU", value: isBudget ? "Intel Core i5-12400F" : "Intel Core i7-13700F" },
            { name: "GPU", value: isBudget ? "NVIDIA GeForce RTX 3060 12GB" : "NVIDIA GeForce RTX 4070 12GB" },
            { name: "RAM", value: "16GB DDR4 3200MHz" },
            { name: "Storage", value: "1TB M.2 NVMe SSD" }
        ],
        stock: Math.floor(Math.random() * 10) + 1
    });
}

// ARZON KOMPYUTERLAR (5 MLN - 10 MLN UZS)
const budgetPCs = [
    {
        name: "OnePC Starter Pack",
        price: 5500000,
        category: "prebuilt",
        isFeatured: false,
        badges: ["Budget", "Sale"],
        description: "Ofis ishlari, o'qish va yengil o'yinlar (CS:GO, Valorant) uchun ideal byudjet kompyuter.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "Intel Core i3-12100F", gpu: "GTX 1650 4GB", ram: "16GB DDR4 3200MHz", storage: "500GB M.2 NVMe" },
        specifications: [
            { name: "CPU", value: "Intel Core i3-12100F" },
            { name: "GPU", value: "NVIDIA GeForce GTX 1650 4GB" },
            { name: "RAM", value: "16GB DDR4 3200MHz" },
            { name: "Storage", value: "500GB M.2 NVMe SSD" },
            { name: "Motherboard", value: "H610M" },
            { name: "PSU", value: "500W 80+" }
        ],
        stock: 10
    },
    {
        name: "OnePC Esports Lite",
        price: 7200000,
        category: "prebuilt",
        isFeatured: false,
        badges: ["Budget", "Hot"],
        description: "Kibersport o'yinlarida silliq FPS berishga moslashtirilgan o'rta-byudjet sistemasi.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "AMD Ryzen 5 5600G", gpu: "RTX 3050 6GB", ram: "16GB DDR4 3200MHz", storage: "512GB M.2 NVMe" },
        specifications: [
            { name: "CPU", value: "AMD Ryzen 5 5600G" },
            { name: "GPU", value: "NVIDIA GeForce RTX 3050 6GB" },
            { name: "RAM", value: "16GB DDR4 3200MHz RGB" },
            { name: "Storage", value: "512GB M.2 NVMe SSD" },
            { name: "Motherboard", value: "B550M" },
            { name: "PSU", value: "550W 80+ Bronze" }
        ],
        stock: 7
    },
    {
        name: "OnePC Casual Gamer",
        price: 9800000,
        category: "prebuilt",
        isFeatured: true,
        badges: ["Best Value"],
        description: "Eng yaxshi narx-navo mutanosibligi. Hamma o'yinlarni O'rta grafikalarda qotmasdan o'ynash uchun.",
        images: ["https://nzxt.com/assets/cms/34299/1615563446-bld-hero-system.png?auto=format&fit=max&h=900&w=672"],
        quick_specs: { cpu: "Intel Core i5-12400F", gpu: "RX 6600 8GB", ram: "16GB DDR4 3200MHz", storage: "1TB M.2 NVMe" },
        specifications: [
            { name: "CPU", value: "Intel Core i5-12400F" },
            { name: "GPU", value: "AMD Radeon RX 6600 8GB" },
            { name: "RAM", value: "16GB DDR4 3200MHz" },
            { name: "Storage", value: "1TB M.2 NVMe" },
            { name: "Motherboard", value: "B660M" },
            { name: "PSU", value: "600W 80+ Bronze" }
        ],
        stock: 5
    }
];

prebuilts.push(...budgetPCs);

const seed = async () => {
    console.log("Starting to seed Prebuilts...");
    let added = 0;
    for (const pc of prebuilts) {
        pc.createdAt = admin.firestore.FieldValue.serverTimestamp();
        await db.collection("prebuilts").add(pc);
        added++;
        console.log(`Added: ${pc.name}`);
    }
    console.log(`Successfully added ${added} prebuilt PCs to the 'prebuilts' collection!`);
    process.exit(0);
};

seed().catch(err => {
    console.error("Failed to seed:", err);
    process.exit(1);
});
