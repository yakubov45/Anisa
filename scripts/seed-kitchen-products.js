require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  initializeApp({
    credential: cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

const CATALOG_PRODUCTS = [
  {
    id: "artisanal-enameled-skillet-28cm",
    name: "Artisanal Enameled Skillet 28cm",
    title: "Artisanal Enameled Skillet 28cm",
    badge: "BEST SELLER",
    badgeType: "terracotta",
    category: "cookware",
    subcategory: "CAST IRON COOKWARE",
    material: "Cast Iron",
    price: 280,
    basePrice: 280,
    rating: 4.9,
    reviewCount: 48,
    image: "/images/editorial/cat-prod-skillet.png",
    images: ["/images/editorial/cat-prod-skillet.png"],
    description: "Hand-poured molten iron with dual-layer French enamel coating for superior heat retention and uniform searing.",
    inStock: true,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "tsuchime-damascus-santoku-180mm",
    name: "Tsuchime Damascus Santoku 180mm",
    title: "Tsuchime Damascus Santoku 180mm",
    badge: "CHEF'S CHOICE",
    badgeType: "terracotta",
    category: "knives",
    subcategory: "KNIVES & CUTLERY",
    material: "Damascus Steel",
    price: 345,
    basePrice: 345,
    rating: 5.0,
    reviewCount: 92,
    image: "/images/editorial/cat-prod-santoku.png",
    images: ["/images/editorial/cat-prod-santoku.png"],
    description: "67-layer VG-10 core steel with hammered finish preventing food from sticking during high-precision vegetable prep.",
    inStock: true,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: "reactive-glaze-stoneware-set-12pc",
    name: "Reactive Glaze Stoneware Set (12-Piece)",
    title: "Reactive Glaze Stoneware Set (12-Piece)",
    badge: "NEW RELEASE",
    badgeType: "green",
    category: "tableware",
    subcategory: "TABLEWARE",
    material: "Stoneware",
    price: 195,
    basePrice: 195,
    rating: 4.8,
    reviewCount: 24,
    image: "/images/editorial/cat-prod-stoneware.png",
    images: ["/images/editorial/cat-prod-stoneware.png"],
    description: "Hand-finished stoneware fired at ultra-high temperatures for durable chip-resistance and organic rustic charm.",
    inStock: true,
    isFeatured: true,
    sortOrder: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "french-copper-saucier-2l",
    name: "French Copper Saucier 2.0L",
    title: "French Copper Saucier 2.0L",
    badge: null,
    category: "cookware",
    subcategory: "COOKWARE",
    material: "Copper",
    price: 420,
    basePrice: 420,
    rating: 4.9,
    reviewCount: 31,
    image: "/images/editorial/cat-prod-copper.png",
    images: ["/images/editorial/cat-prod-copper.png"],
    description: "99.9% pure copper exterior bonded with stainless steel lining for instant heat conductivity and delicate sauce reduction.",
    inStock: true,
    isFeatured: false,
    sortOrder: 4,
    createdAt: new Date(Date.now() - 1000 * 60 * 40),
  },
  {
    id: "end-grain-walnut-butcher-block",
    name: "End-Grain Walnut Butcher Block",
    title: "End-Grain Walnut Butcher Block",
    badge: "LIMITED",
    badgeType: "terracotta",
    category: "knives",
    subcategory: "CUTLERY ACCESSORIES",
    material: "Walnut",
    price: 220,
    basePrice: 220,
    rating: 4.7,
    reviewCount: 15,
    image: "/images/editorial/cat-prod-butcher.png",
    images: ["/images/editorial/cat-prod-butcher.png"],
    description: "Self-healing American black walnut end-grain construction that protects sharp knife edges during heavy daily prep.",
    inStock: true,
    isFeatured: false,
    sortOrder: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 50),
  },
  {
    id: "precision-cold-press-juicer",
    name: "Precision Cold Press Juicer",
    title: "Precision Cold Press Juicer",
    badge: null,
    category: "appliances",
    subcategory: "APPLIANCES",
    material: "Stainless Steel",
    price: 490,
    basePrice: 490,
    rating: 4.9,
    reviewCount: 42,
    image: "/images/editorial/cat-prod-juicer.png",
    images: ["/images/editorial/cat-prod-juicer.png"],
    description: "Low-RPM masticating technology maximizing nutrient and enzyme extraction with quiet, smooth countertop operation.",
    inStock: true,
    isFeatured: false,
    sortOrder: 6,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "ceremonial-matcha-tea-set",
    name: "Ceremonial Matcha Tea Set",
    title: "Ceremonial Matcha Tea Set",
    badge: null,
    category: "tableware",
    subcategory: "TABLEWARE",
    material: "Stoneware",
    price: 145,
    basePrice: 145,
    rating: 4.8,
    reviewCount: 38,
    image: "/images/editorial/cat-prod-matcha.png",
    images: ["/images/editorial/cat-prod-matcha.png"],
    description: "Complete artisanal set including handcrafted chawan bowl, bamboo whisk and traditional ceramic scoop for mindful tea rituals.",
    inStock: true,
    isFeatured: false,
    sortOrder: 7,
    createdAt: new Date(Date.now() - 1000 * 60 * 70),
  },
  {
    id: "signature-enameled-dutch-oven-55l",
    name: "Signature Enameled Dutch Oven 5.5L",
    title: "Signature Enameled Dutch Oven 5.5L",
    badge: "AWARD WINNER",
    badgeType: "terracotta",
    category: "cookware",
    subcategory: "COOKWARE",
    material: "Cast Iron",
    price: 360,
    basePrice: 360,
    rating: 5.0,
    reviewCount: 67,
    image: "/images/editorial/cat-prod-dutch.png",
    images: ["/images/editorial/cat-prod-dutch.png"],
    description: "Self-basting spike lid design ensuring continuous moisture circulation for tender slow-simmered stews and rustic sourdough bread.",
    inStock: true,
    isFeatured: false,
    sortOrder: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 80),
  },
  {
    id: "master-chef-knife-block-set-5pc",
    name: "Master Chef Knife Block Set (5-Piece)",
    title: "Master Chef Knife Block Set (5-Piece)",
    badge: null,
    category: "knives",
    subcategory: "KNIVES & CUTLERY",
    material: "Walnut",
    price: 650,
    basePrice: 650,
    rating: 4.9,
    reviewCount: 53,
    image: "/images/editorial/cat-prod-block.png",
    images: ["/images/editorial/cat-prod-block.png"],
    description: "Full-tang German stainless steel blades paired with an angled walnut magnetic block for ergonomic storage and instant access.",
    inStock: true,
    isFeatured: false,
    sortOrder: 9,
    createdAt: new Date(Date.now() - 1000 * 60 * 90),
  },
];

async function seed() {
  console.log("Seeding all 9 catalog products into Firebase...");
  const batch = db.batch();

  for (const prod of CATALOG_PRODUCTS) {
    const docRef = db.collection("products").doc(prod.id);
    batch.set(docRef, prod, { merge: true });
  }

  await batch.commit();
  console.log("Successfully seeded 9 catalog products into Firebase!");
}

seed().catch(err => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
