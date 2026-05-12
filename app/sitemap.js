import { collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://onepc.uz';

  // Static routes
  const routes = [
    '',
    '/products',
    '/pc-builder',
    '/support',
    '/about',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic products
  let products = [];
  try {
    const q = query(collection(db, 'products'), limit(500));
    const querySnapshot = await getDocs(q);
    
    products = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        url: `${baseUrl}/products/${doc.id}`,
        lastModified: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.6,
      };
    });
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  return [...routes, ...products];
}
