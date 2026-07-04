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

        // 1. Fix existing categories in Firebase
        let fixedCount = 0;
        const productsRef = adminDb.collection(COLLECTIONS.PRODUCTS);
        
        // Find products with category 'Mice' or 'mouse' and fix to 'mice'
        const snapshotMiceCap = await productsRef.where("category", "==", "Mice").get();
        const snapshotMouse = await productsRef.where("category", "==", "mouse").get();

        const batch = adminDb.batch();
        snapshotMiceCap.docs.forEach(doc => {
            batch.update(doc.ref, { category: "mice" });
            fixedCount++;
        });
        snapshotMouse.docs.forEach(doc => {
            batch.update(doc.ref, { category: "mice" });
            fixedCount++;
        });

        if (fixedCount > 0) {
            await batch.commit();
        }

        // 2. Upload mice from local products.json to Firebase if they don't exist
        const productsPath = path.resolve('C:/Users/yoqub/OneDrive/Desktop/OnePC/products.json');
        const productsJson = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        const localMice = productsJson.filter(p => p.category === 'Mice' || p.category === 'mice');
        
        // Get existing mice names from Firebase to avoid duplicates
        const fbMiceSnapshot = await productsRef.where("category", "==", "mice").get();
        const fbMiceNames = fbMiceSnapshot.docs.map(doc => doc.data().name?.toLowerCase() || "");
        
        let uploadedCount = 0;
        const uploadBatch = adminDb.batch();

        for (const mouse of localMice) {
            if (!fbMiceNames.includes(mouse.name.toLowerCase())) {
                const newDocRef = productsRef.doc();
                
                // Ensure category is lowercase "mice"
                const productData = {
                    ...mouse,
                    category: "mice",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                // Convert ID to string if it exists
                if (productData.id) {
                    delete productData.id;
                }

                uploadBatch.set(newDocRef, productData);
                uploadedCount++;
                fbMiceNames.push(mouse.name.toLowerCase());
                
                // Commit every 400 documents to avoid batch limits
                if (uploadedCount % 400 === 0) {
                    await uploadBatch.commit();
                }
            }
        }

        if (uploadedCount > 0 && uploadedCount % 400 !== 0) {
            await uploadBatch.commit();
        }

        return NextResponse.json({ 
            success: true, 
            message: `Fixed ${fixedCount} categories in Firebase. Uploaded ${uploadedCount} new mice to Firebase from products.json.` 
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
