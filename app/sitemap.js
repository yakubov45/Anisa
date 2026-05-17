import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export const revalidate = 3600; // 1 hour cache

export default async function sitemap() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://onepc.uz";

  const currentDate = new Date().toISOString();

  /*
   |--------------------------------------------------------------------------
   | STATIC ROUTES
   |--------------------------------------------------------------------------
   */

  const staticRoutes = [
    {
      path: "",
      priority: 1.0,
      changeFrequency: "daily",
    },
    {
      path: "/products",
      priority: 0.9,
      changeFrequency: "daily",
    },
    {
      path: "/pc-builder",
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      path: "/about",
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      path: "/faq",
      priority: 0.5,
      changeFrequency: "monthly",
    },
    {
      path: "/support",
      priority: 0.5,
      changeFrequency: "weekly",
    },
    {
      path: "/compare",
      priority: 0.5,
      changeFrequency: "weekly",
    },
    {
      path: "/wishlist",
      priority: 0.4,
      changeFrequency: "weekly",
    },
    {
      path: "/cart",
      priority: 0.3,
      changeFrequency: "daily",
    },
    {
      path: "/search",
      priority: 0.4,
      changeFrequency: "daily",
    },
  ].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: currentDate,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  /*
   |--------------------------------------------------------------------------
   | PRODUCTS
   |--------------------------------------------------------------------------
   */

  let productRoutes = [];

  try {
    const productsQuery = query(
      collection(db, "products"),
      limit(5000)
    );

    const snapshot = await getDocs(productsQuery);

    productRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();

      const updatedAt =
        data.updatedAt?.toDate?.()?.toISOString() ||
        currentDate;

      return {
        url: `${baseUrl}/products/${data.slug || doc.id}`,
        lastModified: updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,

        images: data.images?.map((img) => ({
          url: img,
        })),
      };
    });
  } catch (error) {
    console.error("SITEMAP PRODUCTS ERROR:", error);
  }

  /*
   |--------------------------------------------------------------------------
   | CATEGORIES
   |--------------------------------------------------------------------------
   */

  let categoryRoutes = [];

  try {
    const categoriesQuery = query(
      collection(db, "categories"),
      limit(500)
    );

    const snapshot = await getDocs(categoriesQuery);

    categoryRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        url: `${baseUrl}/category/${data.slug || doc.id}`,
        lastModified:
          data.updatedAt?.toDate?.()?.toISOString() ||
          currentDate,
        changeFrequency: "daily",
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("SITEMAP CATEGORY ERROR:", error);
  }

  /*
   |--------------------------------------------------------------------------
   | BRANDS
   |--------------------------------------------------------------------------
   */

  let brandRoutes = [];

  try {
    const brandsQuery = query(
      collection(db, "brands"),
      limit(200)
    );

    const snapshot = await getDocs(brandsQuery);

    brandRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        url: `${baseUrl}/brands/${data.slug || doc.id}`,
        lastModified: currentDate,
        changeFrequency: "weekly",
        priority: 0.7,
      };
    });
  } catch (error) {
    console.error("SITEMAP BRANDS ERROR:", error);
  }

  /*
   |--------------------------------------------------------------------------
   | PREBUILTS
   |--------------------------------------------------------------------------
   */

  let prebuiltRoutes = [];

  try {
    const prebuiltsQuery = query(
      collection(db, "prebuilts"),
      limit(500)
    );

    const snapshot = await getDocs(prebuiltsQuery);

    prebuiltRoutes = snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        url: `${baseUrl}/prebuilts/${data.slug || doc.id}`,
        lastModified:
          data.updatedAt?.toDate?.()?.toISOString() ||
          currentDate,
        changeFrequency: "weekly",
        priority: 0.9,
      };
    });
  } catch (error) {
    console.error("SITEMAP PREBUILTS ERROR:", error);
  }

  /*
   |--------------------------------------------------------------------------
   | RETURN ALL ROUTES
   |--------------------------------------------------------------------------
   */

  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...brandRoutes,
    ...setupRoutes,
    ...prebuiltRoutes,
  ];
}