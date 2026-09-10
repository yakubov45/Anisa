import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Cucina Studio database...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Categories
  const catCookware = await prisma.category.create({
    data: {
      name: 'Cookware',
      slug: 'cookware',
      description: 'Premium pots, pans, and cooking essentials crafted for performance',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop&q=80',
    }
  });

  const catKnives = await prisma.category.create({
    data: {
      name: 'Knives & Cutlery',
      slug: 'knives-cutlery',
      description: 'Precision-forged blades for the discerning chef',
      image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80',
    }
  });

  const catTableware = await prisma.category.create({
    data: {
      name: 'Tableware & Serving',
      slug: 'tableware-serving',
      description: 'Elegant dinnerware and serving pieces for memorable meals',
      image: 'https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=800&auto=format&fit=crop&q=80',
    }
  });

  const catAppliances = await prisma.category.create({
    data: {
      name: 'Small Appliances',
      slug: 'small-appliances',
      description: 'Professional-grade kitchen appliances for culinary mastery',
      image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80',
    }
  });

  const categories = [catCookware, catKnives, catTableware, catAppliances];

  // Products & Variants
  const p1 = await prisma.product.create({
    data: {
      title: 'Tefal Unlimited Frying Pan',
      slug: 'tefal-unlimited-frying-pan',
      description: 'The Tefal Unlimited frying pan features exclusive Titanium Mineral coating for exceptional durability. Its Thermo-Signal technology indicates the perfect cooking temperature, while the reinforced titanium exterior ensures scratch resistance and long-lasting performance on all stovetops including induction.',
      basePrice: 89.99,
      discountPrice: 74.99,
      brand: 'Tefal',
      material: 'Titanium Non-Stick',
      stovetopCompatibility: ['Induction', 'Gas', 'Electric', 'Ceramic'],
      primaryImage: 'https://images.unsplash.com/photo-1585442738766-5be5528f0826?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      rating: 4.7,
      reviewCount: 124,
      categoryId: catCookware.id,
      variants: {
        create: [
          { capacity: '24cm', stock: 45, priceDelta: 0, sku: 'TEF-UNL-24', color: 'Black', colorHex: '#1A1A1A' },
          { capacity: '28cm', stock: 32, priceDelta: 10.00, sku: 'TEF-UNL-28', color: 'Black', colorHex: '#1A1A1A' },
          { capacity: '32cm', stock: 18, priceDelta: 20.00, sku: 'TEF-UNL-32', color: 'Black', colorHex: '#1A1A1A' }
        ]
      }
    }
  });

  const p2 = await prisma.product.create({
    data: {
      title: 'Le Creuset Signature Dutch Oven',
      slug: 'le-creuset-signature-dutch-oven',
      description: 'The iconic Le Creuset Signature Dutch Oven is crafted from premium enameled cast iron for superior heat distribution and retention. Each piece is hand-inspected by artisans and features ergonomic composite knobs, colorful exterior enamel, and a sand-colored interior for easy monitoring of cooking progress.',
      basePrice: 379.99,
      brand: 'Le Creuset',
      material: 'Enameled Cast Iron',
      stovetopCompatibility: ['Induction', 'Gas', 'Electric', 'Oven'],
      primaryImage: 'https://images.unsplash.com/photo-1585442738766-5be5528f0826?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 312,
      categoryId: catCookware.id,
      variants: {
        create: [
          { capacity: '3.5 Qt', stock: 12, priceDelta: 0, sku: 'LC-SIG-35-CH', color: 'Cherry', colorHex: '#C41E3A' },
          { capacity: '5.5 Qt', stock: 8, priceDelta: 50.00, sku: 'LC-SIG-55-MS', color: 'Marseille', colorHex: '#2E5090' },
          { capacity: '7.25 Qt', stock: 5, priceDelta: 100.00, sku: 'LC-SIG-72-AR', color: 'Artichaut', colorHex: '#4A6741' },
          { capacity: '9 Qt', stock: 3, priceDelta: 170.00, sku: 'LC-SIG-90-WH', color: 'White', colorHex: '#F5F5F0' }
        ]
      }
    }
  });

  const p3 = await prisma.product.create({
    data: {
      title: 'Victorinox Swiss Classic Chef\'s Knife',
      slug: 'victorinox-swiss-classic-chefs-knife',
      description: 'Swiss precision meets culinary excellence. The Victorinox Swiss Classic Chef\'s Knife features a laser-tested, tapered edge ground for long-lasting sharpness. The ergonomic Fibrox Pro handle ensures a secure, comfortable grip even when wet.',
      basePrice: 49.99,
      discountPrice: 39.99,
      brand: 'Victorinox',
      material: 'High Carbon Stainless Steel',
      stovetopCompatibility: [],
      primaryImage: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      rating: 4.6,
      reviewCount: 267,
      categoryId: catKnives.id,
      variants: {
        create: [
          { capacity: '6 inch', stock: 60, priceDelta: 0, sku: 'VIC-SC-6', color: 'Black', colorHex: '#1A1A1A' },
          { capacity: '8 inch', stock: 45, priceDelta: 10.00, sku: 'VIC-SC-8', color: 'Black', colorHex: '#1A1A1A' },
          { capacity: '10 inch', stock: 25, priceDelta: 20.00, sku: 'VIC-SC-10', color: 'Black', colorHex: '#1A1A1A' }
        ]
      }
    }
  });

  const p4 = await prisma.product.create({
    data: {
      title: 'Korkmaz Proline Stockpot',
      slug: 'korkmaz-proline-stockpot',
      description: 'The Korkmaz Proline Stockpot is crafted from premium 18/10 stainless steel with an encapsulated aluminum base for optimal heat distribution. Features graduated measurement markings, a tempered glass lid, and riveted stainless steel handles for safe, comfortable use.',
      basePrice: 119.99,
      brand: 'Korkmaz',
      material: '18/10 Stainless Steel',
      stovetopCompatibility: ['Induction', 'Gas', 'Electric'],
      primaryImage: 'https://images.unsplash.com/photo-1584990347449-a6e0e1c0b380?w=800&auto=format&fit=crop&q=80',
      isFeatured: false,
      rating: 4.4,
      reviewCount: 89,
      categoryId: catCookware.id,
      variants: {
        create: [
          { capacity: '4L', stock: 30, priceDelta: 0, sku: 'KRK-PL-4L', color: 'Silver', colorHex: '#C0C0C0' },
          { capacity: '6L', stock: 25, priceDelta: 20.00, sku: 'KRK-PL-6L', color: 'Silver', colorHex: '#C0C0C0' },
          { capacity: '8L', stock: 15, priceDelta: 40.00, sku: 'KRK-PL-8L', color: 'Silver', colorHex: '#C0C0C0' }
        ]
      }
    }
  });

  const p5 = await prisma.product.create({
    data: {
      title: 'Staub Cocotte Round',
      slug: 'staub-cocotte-round',
      description: 'The Staub Cocotte Round features a black matte enamel interior that develops a natural non-stick patina over time. The self-basting lid with signature spikes continuously bastes food with its own juices. Made in France, each cocotte is individually numbered.',
      basePrice: 329.99,
      discountPrice: 299.99,
      brand: 'Staub',
      material: 'Cast Iron',
      stovetopCompatibility: ['Induction', 'Gas', 'Electric', 'Oven'],
      primaryImage: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      rating: 4.8,
      reviewCount: 198,
      categoryId: catCookware.id,
      variants: {
        create: [
          { capacity: '2.75 Qt', stock: 10, priceDelta: 0, sku: 'STB-RD-275-BK', color: 'Matte Black', colorHex: '#2C2C2C' },
          { capacity: '4 Qt', stock: 14, priceDelta: 40.00, sku: 'STB-RD-4-GR', color: 'Graphite Grey', colorHex: '#5C5C5C' },
          { capacity: '5.5 Qt', stock: 7, priceDelta: 80.00, sku: 'STB-RD-55-CR', color: 'Cherry', colorHex: '#8B0000' }
        ]
      }
    }
  });

  const p6 = await prisma.product.create({
    data: {
      title: 'Villeroy & Boch Artesano Dinnerware Set',
      slug: 'villeroy-boch-artesano-dinnerware',
      description: 'The Villeroy & Boch Artesano Original collection combines natural materials with modern design. Each piece features organic shapes, natural acacia wood accents, and premium porcelain construction. Dishwasher safe and microwave safe for everyday elegance.',
      basePrice: 249.99,
      brand: 'Villeroy & Boch',
      material: 'Premium Porcelain',
      stovetopCompatibility: ['Dishwasher Safe', 'Microwave Safe'],
      primaryImage: 'https://images.unsplash.com/photo-1595981234058-a9302fb97229?w=800&auto=format&fit=crop&q=80',
      isFeatured: false,
      rating: 4.5,
      reviewCount: 76,
      categoryId: catTableware.id,
      variants: {
        create: [
          { capacity: '12-Piece Set', stock: 20, priceDelta: 0, sku: 'VB-ART-12', color: 'White', colorHex: '#FEFEFE' },
          { capacity: '18-Piece Set', stock: 12, priceDelta: 80.00, sku: 'VB-ART-18', color: 'White', colorHex: '#FEFEFE' }
        ]
      }
    }
  });

  const p7 = await prisma.product.create({
    data: {
      title: 'KitchenAid Artisan Stand Mixer',
      slug: 'kitchenaid-artisan-stand-mixer',
      description: 'The iconic KitchenAid Artisan Stand Mixer features a powerful direct-drive motor, 10+ speed settings, and a 4.8L stainless steel bowl with comfortable handle. Compatible with over 15 optional attachments to make everything from pasta to ice cream. A true kitchen essential.',
      basePrice: 449.99,
      discountPrice: 399.99,
      brand: 'KitchenAid',
      material: 'Die-Cast Zinc Alloy',
      stovetopCompatibility: [],
      primaryImage: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=800&auto=format&fit=crop&q=80',
      isFeatured: true,
      rating: 4.9,
      reviewCount: 543,
      categoryId: catAppliances.id,
      variants: {
        create: [
          { capacity: '4.8L', stock: 15, priceDelta: 0, sku: 'KA-ART-48-ER', color: 'Empire Red', colorHex: '#C8102E' },
          { capacity: '4.8L', stock: 20, priceDelta: 0, sku: 'KA-ART-48-OW', color: 'Onyx White', colorHex: '#F0EDE8' },
          { capacity: '4.8L', stock: 8, priceDelta: 0, sku: 'KA-ART-48-MB', color: 'Matte Black', colorHex: '#28282B' },
          { capacity: '6.6L Pro', stock: 6, priceDelta: 150.00, sku: 'KA-PRO-66-SR', color: 'Silver', colorHex: '#C0C0C0' }
        ]
      }
    }
  });

  const p8 = await prisma.product.create({
    data: {
      title: 'Zwilling Pro Knife Block Set',
      slug: 'zwilling-pro-knife-block-set',
      description: 'The Zwilling Pro Knife Block Set includes 7 essential knives made from Zwilling\'s special formula steel, hardened to 57 Rockwell. Features the iconic asymmetric bolster for superior balance, a full tang for strength, and a traditional three-rivet handle. Comes in a natural bamboo knife block.',
      basePrice: 599.99,
      discountPrice: 499.99,
      brand: 'Zwilling',
      material: 'Forged Special Formula Steel',
      stovetopCompatibility: [],
      primaryImage: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800&auto=format&fit=crop&q=80',
      isFeatured: false,
      rating: 4.7,
      reviewCount: 156,
      categoryId: catKnives.id,
      variants: {
        create: [
          { capacity: '7-Piece Set', stock: 10, priceDelta: 0, sku: 'ZW-PRO-7', color: 'Natural', colorHex: '#C4A882' },
          { capacity: '10-Piece Set', stock: 6, priceDelta: 200.00, sku: 'ZW-PRO-10', color: 'Natural', colorHex: '#C4A882' }
        ]
      }
    }
  });

  // Demo User
  const demoUser = await prisma.user.create({
    data: {
      name: 'Culinary Enthusiast',
      email: 'demo@cucinastudio.com',
      role: 'USER',
      passwordHash: '$2b$10$placeholder_hash_for_demo_user',
    }
  });

  // Reviews
  await prisma.review.create({
    data: {
      userId: demoUser.id,
      productId: p2.id,
      rating: 5,
      title: 'Absolute kitchen essential',
      comment: 'This Dutch oven has completely transformed my cooking. The heat retention is phenomenal...',
      isVerified: true
    }
  });

  await prisma.review.create({
    data: {
      userId: demoUser.id,
      productId: p7.id,
      rating: 5,
      title: 'Worth every penny',
      comment: "I've had my KitchenAid for over a year and use it almost daily...",
      isVerified: true
    }
  });

  console.log('✅ Seeding complete!');
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Products: 8`);
  console.log(`   Users: 1`);
  console.log(`   Reviews: 2`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
