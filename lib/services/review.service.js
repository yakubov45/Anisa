import { db } from '../firebase/client';
import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc,
    updateDoc,
    query, 
    where, 
    orderBy, 
    serverTimestamp 
} from 'firebase/firestore';

const REVIEWS_COLLECTION = 'reviews';

export const reviewService = {
    async addReview(productId, reviewData) {
        try {
            // Add the review
            const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
                productId,
                ...reviewData,
                createdAt: serverTimestamp()
            });

            // Update product's average rating
            const q = query(
                collection(db, REVIEWS_COLLECTION),
                where('productId', '==', productId)
            );
            const snapshot = await getDocs(q);
            const reviews = snapshot.docs.map(d => d.data());
            const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

            const productRef = doc(db, 'products', productId);
            await updateDoc(productRef, {
                rating: Math.round(avgRating),
                reviewCount: reviews.length
            });

            return docRef.id;
        } catch (error) {
            console.error('Error adding review:', error);
            throw error;
        }
    },

    async getProductReviews(productId) {
        try {
            const q = query(
                collection(db, REVIEWS_COLLECTION),
                where('productId', '==', productId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate()
            }));
        } catch (error) {
            console.error('Error getting reviews:', error);
            return [];
        }
    }
};
