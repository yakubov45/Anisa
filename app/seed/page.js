"use client"

import { useState } from "react"
import { db } from "@/lib/firebase/client"
import { collection, writeBatch, doc, getDocs, deleteDoc } from "firebase/firestore"

// Templates for generating diverse products
const generateProducts = () => {
    const products = [];
    
    const categories = [
        { name: 'Processors', brands: ['Intel', 'AMD'], items: [
            { name: 'Core i3-12100F', price: 95, socket: 'LGA1700', tdp: 58 },
            { name: 'Core i5-13400F', price: 210, socket: 'LGA1700', tdp: 65 },
            { name: 'Core i5-14600K', price: 320, socket: 'LGA1700', tdp: 125 },
            { name: 'Core i7-13700K', price: 380, socket: 'LGA1700', tdp: 125 },
            { name: 'Core i7-14700K', price: 410, socket: 'LGA1700', tdp: 125 },
            { name: 'Core i9-14900KS', price: 680, socket: 'LGA1700', tdp: 150 },
            { name: 'Ryzen 5 5600', price: 135, socket: 'AM4', tdp: 65 },
            { name: 'Ryzen 7 5800X', price: 210, socket: 'AM4', tdp: 105 },
            { name: 'Ryzen 5 7600X', price: 230, socket: 'AM5', tdp: 105 },
            { name: 'Ryzen 7 7800X3D', price: 450, socket: 'AM5', tdp: 120 },
            { name: 'Ryzen 9 7950X', price: 540, socket: 'AM5', tdp: 170 },
        ]},
        { name: 'Graphics', brands: ['ASUS', 'MSI', 'Gigabyte', 'Zotac'], items: [
            { name: 'GTX 1650 4GB', price: 160, tdp: 75 },
            { name: 'RTX 3060 12GB', price: 290, tdp: 170 },
            { name: 'RTX 4060 8GB', price: 299, tdp: 115 },
            { name: 'RTX 4060 Ti 16GB', price: 449, tdp: 165 },
            { name: 'RTX 4070 Super', price: 599, tdp: 220 },
            { name: 'RTX 4070 Ti Super', price: 799, tdp: 285 },
            { name: 'RTX 4080 Super', price: 999, tdp: 320 },
            { name: 'RTX 4090 24GB', price: 1799, tdp: 450 },
            { name: 'RX 6600 8GB', price: 200, tdp: 132 },
            { name: 'RX 7600 8GB', price: 260, tdp: 165 },
            { name: 'RX 7800 XT 16GB', price: 499, tdp: 263 },
            { name: 'RX 7900 XTX 24GB', price: 930, tdp: 355 },
        ]},
        { name: 'Motherboards', brands: ['ASUS', 'MSI', 'Gigabyte', 'ASRock'], items: [
            { name: 'H610M-K D4', price: 85, socket: 'LGA1700', ddr: 'DDR4', formFactor: 'mATX' },
            { name: 'B760M Bomber', price: 125, socket: 'LGA1700', ddr: 'DDR5', formFactor: 'mATX' },
            { name: 'Z790-P WiFi', price: 220, socket: 'LGA1700', ddr: 'DDR5', formFactor: 'ATX' },
            { name: 'ROG Strix Z790-E', price: 450, socket: 'LGA1700', ddr: 'DDR5', formFactor: 'ATX' },
            { name: 'B550M-A WiFi', price: 110, socket: 'AM4', ddr: 'DDR4', formFactor: 'mATX' },
            { name: 'B650 Gaming Plus', price: 180, socket: 'AM5', ddr: 'DDR5', formFactor: 'ATX' },
            { name: 'X670E Carbon WiFi', price: 460, socket: 'AM5', ddr: 'DDR5', formFactor: 'ATX' },
        ]},
        { name: 'Memory', brands: ['Corsair', 'Kingston', 'G.Skill', 'TeamGroup'], items: [
            { name: '16GB (2x8) DDR4 3200MHz', price: 45, ddr: 'DDR4' },
            { name: '32GB (2x16) DDR4 3600MHz', price: 85, ddr: 'DDR4' },
            { name: '16GB (2x8) DDR5 5200MHz', price: 75, ddr: 'DDR5' },
            { name: '32GB (2x16) DDR5 6000MHz', price: 115, ddr: 'DDR5' },
            { name: '64GB (2x32) DDR5 6400MHz', price: 210, ddr: 'DDR5' },
        ]},
        { name: 'Storage', brands: ['Samsung', 'Crucial', 'WD', 'Kingston'], items: [
            { name: '500GB NVMe M.2', price: 45 },
            { name: '1TB NVMe Gen4', price: 85 },
            { name: '2TB NVMe Gen4', price: 155 },
            { name: '4TB NVMe Gen4', price: 290 },
            { name: '1TB SATA SSD', price: 65 },
            { name: '2TB HDD 7200RPM', price: 55 },
        ]},
        { name: 'PSUs', brands: ['Corsair', 'Deepcool', 'EVGA', 'Seasonic'], items: [
            { name: '550W 80+ Bronze', price: 55, wattage: 550 },
            { name: '650W 80+ Gold', price: 85, wattage: 650 },
            { name: '750W 80+ Gold Fully Modular', price: 110, wattage: 750 },
            { name: '850W 80+ Gold Fully Modular', price: 135, wattage: 850 },
            { name: '1000W 80+ Platinum', price: 210, wattage: 1000 },
        ]},
        { name: 'Cases', brands: ['NZXT', 'Cougar', 'Fractal', 'Lian Li'], items: [
            { name: 'H510 Flow', price: 85, maxFormFactor: 'ATX' },
            { name: 'Duoface RGB', price: 75, maxFormFactor: 'ATX' },
            { name: 'Meshify 2 Compact', price: 125, maxFormFactor: 'ATX' },
            { name: 'O11 Dynamic EVO', price: 170, maxFormFactor: 'ATX' },
            { name: 'CH370 Micro-ATX', price: 65, maxFormFactor: 'mATX' },
        ]},
        { name: 'Cooling', brands: ['Deepcool', 'Noctua', 'Be Quiet', 'NZXT'], items: [
            { name: 'AK400 Air Cooler', price: 35 },
            { name: 'AK620 Digital', price: 75 },
            { name: 'NH-D15 chromax.black', price: 120 },
            { name: 'LS520 240mm AIO', price: 110 },
            { name: 'LS720 360mm AIO', price: 145 },
            { name: 'Kraken Elite 360', price: 280 },
        ]},
    ];

    // Images mapping for variety
    const images = {
        'Processors': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500',
        'Graphics': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500',
        'Motherboards': 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500',
        'Memory': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=500',
        'Storage': 'https://images.unsplash.com/photo-1597872200370-493ced2bb925?w=500',
        'PSUs': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500',
        'Cases': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500',
        'Cooling': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500',
    };

    // Generate ~150 items
    let count = 0;
    while (count < 150) {
        const cat = categories[count % categories.length];
        const template = cat.items[Math.floor(Math.random() * cat.items.length)];
        const brand = cat.brands[Math.floor(Math.random() * cat.brands.length)];
        
        products.push({
            ...template,
            name: `${brand} ${template.name} ${count}`, // Add index to keep name unique
            brand: brand,
            category: cat.name,
            image: images[cat.name],
            stock: Math.floor(Math.random() * 50) + 10,
            discount: count < 10 ? 15 : null, // Limit discount to first 10
            createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString() // Randomized dates
        });
        count++;
    }

    return products;
};

const preBuiltSystems = [
    { id: 'p1', name: 'OnePC Genesis V2', price: 949, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', specs: 'RTX 4060, i5-13400, 16GB RAM', desc: 'Balanced for 1080p competitive gaming.', target: 'E-Sports' },
    { id: 'p2', name: 'OnePC Horizon', price: 1499, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', specs: 'RTX 4070, i7-13700, 32GB RAM', desc: 'High-refresh 1440p gaming machine.', target: 'Professional Gaming' },
    { id: 'p3', name: 'OnePC Titan', price: 4299, image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800', specs: 'RTX 4090, i9-14900K, 128GB RAM', desc: 'The ultimate workstation and gaming beast.', target: 'Ultra 4K & Workstation' },
];

const brands = [
    { name: "ASUS", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2e/ASUS_Logo.svg" },
    { name: "MSI", logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/MSI_Logo.svg" },
    { name: "Gigabyte", logo: "https://upload.wikimedia.org/wikipedia/commons/a/af/Gigabyte_Technology_logo.svg" },
    { name: "NVIDIA", logo: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
    { name: "Intel", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Intel-logo.svg" },
    { name: "AMD", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg" },
    { name: "Corsair", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Corsair_Logo.svg" },
    { name: "Logitech", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c9/Logitech_logo.svg" },
];

export default function SeedPage() {
    const [status, setStatus] = useState("System Standby...")
    const [loading, setLoading] = useState(false)

    const clearDatabase = async () => {
        setLoading(true)
        setStatus("Wiping core database...")
        try {
            const collections = ["products", "preBuiltSystems", "brands"]
            for (const coll of collections) {
                const snapshot = await getDocs(collection(db, coll))
                for (const d of snapshot.docs) {
                    await deleteDoc(doc(db, coll, d.id))
                }
            }
            setStatus("Wipe complete. System ready for data injection.")
        } catch (error) {
            setStatus(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const seedData = async () => {
        setLoading(true)
        setStatus("Generating 150 unique hardware profiles...")
        const products = generateProducts();
        
        try {
            // Firestore batches are limited to 500 operations
            const batch = writeBatch(db)

            products.forEach((product) => {
                const docRef = doc(collection(db, "products"))
                batch.set(docRef, product)
            })

            preBuiltSystems.forEach(system => {
                const docRef = doc(db, "preBuiltSystems", system.id)
                batch.set(docRef, { ...system, createdAt: new Date().toISOString() })
            })

            brands.forEach(brand => {
                const docRef = doc(collection(db, "brands"))
                batch.set(docRef, brand)
            })

            setStatus("Injecting data into Firestore clusters...")
            await batch.commit()
            setStatus(`Mission Success: 150 items, 3 systems, and 8 brands deployed.`)
        } catch (error) {
            console.error(error)
            setStatus(`Critical Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="pt-40 flex flex-col items-center justify-center space-y-8 pb-20">
            <div className="w-20 h-1 bg-primary rounded-full animate-pulse" />
            <h1 className="text-5xl font-black uppercase tracking-tighter">Inventory Generator v3.0</h1>
            <p className="text-surface-500 font-mono text-xs bg-surface-100 px-4 py-2 rounded-lg">{status}</p>
            
            <div className="flex gap-6">
                <button 
                    onClick={clearDatabase}
                    disabled={loading}
                    className="bg-zinc-800 text-white font-black px-12 py-6 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50 border border-white/5"
                >
                    {loading ? "WIPING..." : "WIPE DATABASE"}
                </button>

                <button 
                    onClick={seedData}
                    disabled={loading}
                    className="bg-primary text-white font-black px-12 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-primary/40"
                >
                    {loading ? "INJECTING..." : "INJECT 150 ITEMS"}
                </button>
            </div>

            <div className="max-w-xl text-center space-y-6 pt-12 border-t border-border-alpha">
                <div className="flex items-center justify-center gap-4 opacity-30">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <p className="text-[10px] text-surface-400 leading-relaxed font-bold uppercase tracking-[0.2em]">
                    Ushbu modul 150 ta noyob mahsulot profillarini yaratadi. Har bir detal o'ziga xos narx, brend va texnik xususiyatlarga ega. 
                    Ma'lumotlar duplikatsiyasini oldini olish uchun avval "WIPE DATABASE" tugmasini bosing.
                </p>
            </div>
        </div>
    )
}
