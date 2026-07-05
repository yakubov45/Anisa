import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { adminDb } from '@/lib/firebase/admin';

const COLLECTIONS = {
    PRODUCTS: "products"
};

export async function GET() {
    try {
        if (!adminDb) {
            return NextResponse.json({ success: false, error: 'Firebase Admin not initialized' }, { status: 500 });
        }

        const productsRef = adminDb.collection(COLLECTIONS.PRODUCTS);
        
        // 1. Clean Firebase: Get all products, delete those that are not "mice"
        const snapshot = await productsRef.get();
        let deletedCount = 0;
        let batch = adminDb.batch();
        let batchCount = 0;

        for (const doc of snapshot.docs) {
            const data = doc.data();
            if (data.category !== 'mice' && data.category !== 'Mice') {
                batch.delete(doc.ref);
                deletedCount++;
                batchCount++;

                if (batchCount === 400) {
                    await batch.commit();
                    batch = adminDb.batch();
                    batchCount = 0;
                }
            }
        }

        if (batchCount > 0) {
            await batch.commit();
        }

        // 2. Clean local products.json
        const productsPath = path.resolve('C:/Users/yoqub/OneDrive/Desktop/OnePC/products.json');
        if (fs.existsSync(productsPath)) {
            const productsJson = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
            const filteredProducts = productsJson.filter(p => p.category === 'Mice' || p.category === 'mice');
            fs.writeFileSync(productsPath, JSON.stringify(filteredProducts, null, 4));
            
            return NextResponse.json({ 
                success: true, 
                message: `Cleaned database! Deleted ${deletedCount} fake products from Firebase. Kept ${filteredProducts.length} mice in products.json.` 
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: `Cleaned database! Deleted ${deletedCount} fake products from Firebase.` 
        });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
