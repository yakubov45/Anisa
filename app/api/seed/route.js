import { adminDb } from "@/lib/firebase/admin";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const seedData = [
            {
                name: "Obliterate v1",
                price: 45000000,
                images: [
                    "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600&q=80",
                    "https://images.unsplash.com/photo-1547082299-de1b6e0766d9?w=600&q=80"
                ],
                quick_specs: { cpu: "Ryzen 7 9800X3D", gpu: "RTX 5080", ram: "32GB DDR5", storage: "2TB SSD" },
                specifications: [
                    { name: "CPU", value: "AMD Ryzen 7 9800X3D", isFeatured: true },
                    { name: "GPU", value: "MSI Shadow 3x OC RTX 5080", isFeatured: true },
                    { name: "RAM", value: "T-Force Delta RGB Black DDR5 32GB 6000MHz", isFeatured: true },
                    { name: "SSD", value: "Teamgroup MP44L Gen 4 2TB NVMe", isFeatured: true },
                    { name: "Mobo", value: "MSI MAG B650 Tomahawk WiFi", isFeatured: false },
                    { name: "PSU", value: "MSI MAG A850GL 80+ Gold", isFeatured: false },
                    { name: "AIO", value: "Thermalright Aqua Elite 360 v4 Black", isFeatured: false },
                    { name: "Case", value: "Montech XR Black", isFeatured: false },
                    { name: "Extra", value: "Silverstone Black GPU Support Bracket", isFeatured: false }
                ],
                badges: ["Bestseller", "New"],
                isFeatured: true
            },
            {
                name: "Apex Predator v2",
                price: 32000000,
                images: [
                    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&q=80",
                    "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80"
                ],
                quick_specs: { cpu: "Ryzen 7 7800X3D", gpu: "RTX 4070 Ti Super", ram: "32GB DDR5", storage: "2TB NVMe" },
                specifications: [
                    { name: "CPU", value: "AMD Ryzen 7 7800X3D", isFeatured: true },
                    { name: "GPU", value: "Gigabyte Windforce RTX 4070 Ti Super 16GB", isFeatured: true },
                    { name: "RAM", value: "Kingston Fenty Beast 32GB DDR5 5600MHz", isFeatured: true },
                    { name: "SSD", value: "Samsung 990 Pro 2TB NVMe", isFeatured: true },
                    { name: "Mobo", value: "ASUS ROG STRIX B650-A Gaming", isFeatured: false },
                    { name: "PSU", value: "Deepcool PX850G 850W Gold", isFeatured: false },
                    { name: "Case", value: "Lian Li O11 Vision White", isFeatured: false }
                ],
                badges: ["Popular"],
                isFeatured: true
            },
            {
                name: "Neon Beast v3",
                price: 18000000,
                images: [
                    "https://images.unsplash.com/photo-1603481546238-487240415921?w=600&q=80",
                    "https://images.unsplash.com/photo-1552831388-6a0b35077328?w=600&q=80"
                ],
                quick_specs: { cpu: "Core i5-13400F", gpu: "RTX 4065", ram: "16GB DDR4", storage: "1TB SSD" },
                specifications: [
                    { name: "CPU", value: "Intel Core i5-13400F", isFeatured: true },
                    { name: "GPU", value: "Palit Dual RTX 4060 8GB", isFeatured: true },
                    { name: "RAM", value: "Corsair Vengeance LPX 16GB DDR4 3200MHz", isFeatured: true },
                    { name: "SSD", value: "Crucial P3 1TB NVMe M.2", isFeatured: true },
                    { name: "Mobo", value: "Gigabyte H610M H V2", isFeatured: false },
                    { name: "PSU", value: "Cougar XTC 600W 80+", isFeatured: false },
                    { name: "Case", value: "AeroCool Cylon Black", isFeatured: false }
                ],
                badges: ["Budget"],
                isFeatured: true
            },
            {
                name: "Glacier Pro Elite",
                price: 65000000,
                images: [
                    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
                    "https://images.unsplash.com/photo-1620288627228-55447a12cb59?w=600&q=80"
                ],
                quick_specs: { cpu: "Core i9-14900KS", gpu: "RTX 4090 White", ram: "64GB DDR5", storage: "4TB SSD" },
                specifications: [
                    { name: "CPU", value: "Intel Core i9-14900KS Elite", isFeatured: true },
                    { name: "GPU", value: "ROG Strix RTX 4090 White Edition 24GB", isFeatured: true },
                    { name: "RAM", value: "G.Skill Trident Z5 RGB 64GB DDR5 6400MHz White", isFeatured: true },
                    { name: "SSD", value: "Lexar NM790 4TB Gen4 NVMe", isFeatured: true },
                    { name: "Mobo", value: "ASUS ROG MAXIMUS Z790 FORMULA", isFeatured: false },
                    { name: "PSU", value: "Seasonic Vertex GX-1200 White Gold", isFeatured: false },
                    { name: "AIO", value: "Lian Li Galahad II LCD 360 Trinity White", isFeatured: false },
                    { name: "Case", value: "HYTE Y70 Touch Infinite White", isFeatured: false }
                ],
                badges: ["Extreme", "Limited"],
                isFeatured: true
            }
        ];
        
        // Remove existing prebuilts first to prevent duplicate bloat
        const prebuiltsRef = adminDb.collection("prebuilts");
        const existingDocs = await prebuiltsRef.get();
        const deleteBatch = adminDb.batch();
        existingDocs.docs.forEach(doc => {
            deleteBatch.delete(doc.ref);
        });
        await deleteBatch.commit();

        // Seed new rich data
        const batch = adminDb.batch();
        for (const pc of seedData) {
            const docRef = prebuiltsRef.doc();
            batch.set(docRef, { ...pc, createdAt: new Date().toISOString() });
        }
        await batch.commit();
        
        return NextResponse.json({ success: true, message: "Successfully deleted old data and seeded 4 rich prebuilts!" });
    } catch (e) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
