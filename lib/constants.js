export const ROLES = {
    SUPERADMIN: 'superadmin',
    ADMIN: 'admin',
    USER: 'user',
    DELIVERY: 'delivery'
};

export const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    ASSIGNED: 'assigned',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled'
};

export const REGIONS = [
    "Tashkent City",
    "Tashkent Region",
    "Samarkand",
    "Bukhara",
    "Andijan",
    "Fergana",
    "Namangan",
    "Navoi",
    "Kashkadarya",
    "Surkhandarya",
    "Jizzakh",
    "Syrdarya",
    "Khorezm",
    "Republic of Karakalpakstan"
];

export const REGION_MAP = {
    "Tashkent City": { uz: "Toshkent shahri", ru: "г. Ташкент", en: "Tashkent City" },
    "Tashkent Region": { uz: "Toshkent viloyati", ru: "Ташкентская область", en: "Tashkent Region" },
    "Samarkand": { uz: "Samarqand viloyati", ru: "Самаркандская область", en: "Samarkand" },
    "Bukhara": { uz: "Buxoro viloyati", ru: "Бухарская область", en: "Bukhara" },
    "Andijan": { uz: "Andijon viloyati", ru: "Андижанская область", en: "Andijan" },
    "Fergana": { uz: "Farg'ona viloyati", ru: "Ферганская область", en: "Fergana" },
    "Namangan": { uz: "Namangan viloyati", ru: "Наманганская область", en: "Namangan" },
    "Navoi": { uz: "Navoiy viloyati", ru: "Навоийская область", en: "Navoi" },
    "Kashkadarya": { uz: "Qashqadaryo viloyati", ru: "Кашкадарьинская область", en: "Kashkadarya" },
    "Surkhandarya": { uz: "Surxondaryo viloyati", ru: "Сурхандарьинская область", en: "Surkhandarya" },
    "Jizzakh": { uz: "Jizzax viloyati", ru: "Джизакская область", en: "Jizzakh" },
    "Syrdarya": { uz: "Sirdaryo viloyati", ru: "Сырдарьинская область", en: "Syrdarya" },
    "Khorezm": { uz: "Xorazm viloyati", ru: "Хорезмская область", en: "Khorezm" },
    "Republic of Karakalpakstan": { uz: "Qoraqalpog'iston Respublikasi", ru: "Республика Каракалпакстан", en: "Republic of Karakalpakstan" }
};

export function getRegionDisplayName(regionKey, lang = 'uz') {
    if (!regionKey) return '';
    if (REGION_MAP[regionKey]) {
        return REGION_MAP[regionKey][lang] || REGION_MAP[regionKey]['uz'] || regionKey;
    }
    return regionKey;
}

export const CATEGORY_TRANSLATIONS = {
    laptops: { uz: "Noutbuklar", ru: "Ноутбуки", en: "Laptops" },
    laptop: { uz: "Noutbuklar", ru: "Ноутбуки", en: "Laptops" },
    noutbuklar: { uz: "Noutbuklar", ru: "Ноутбуки", en: "Laptops" },
    workstations: { uz: "Kompyuterlar", ru: "Компьютеры", en: "Workstations" },
    pc: { uz: "Kompyuterlar", ru: "Компьютеры", en: "PCs" },
    kompyuterlar: { uz: "Kompyuterlar", ru: "Компьютеры", en: "Workstations" },
    displays: { uz: "Monitorlar", ru: "Мониторы", en: "Displays" },
    monitors: { uz: "Monitorlar", ru: "Мониторы", en: "Monitors" },
    monitor: { uz: "Monitorlar", ru: "Мониторы", en: "Monitors" },
    mice: { uz: "Sichqonchalar", ru: "Мыши", en: "Mice" },
    sichqonchalar: { uz: "Sichqonchalar", ru: "Мыши", en: "Mice" },
    keyboards: { uz: "Klaviaturalar", ru: "Клавиатуры", en: "Keyboards" },
    klaviaturalar: { uz: "Klaviaturalar", ru: "Клавиатуры", en: "Keyboards" },
    headsets: { uz: "Quloqchinlar", ru: "Наушники", en: "Headsets" },
    quloqchinlar: { uz: "Quloqchinlar", ru: "Наушники", en: "Headsets" },
    processors: { uz: "Protsessorlar", ru: "Процессоры", en: "Processors" },
    cpus: { uz: "Protsessorlar", ru: "Процессоры", en: "Processors" },
    graphics: { uz: "Videokartalar", ru: "Видеокарты", en: "Graphics Cards" },
    gpus: { uz: "Videokartalar", ru: "Видеокарты", en: "Graphics Cards" },
    memory: { uz: "Operativ xotira", ru: "Оперативная память", en: "Memory" },
    ram: { uz: "Operativ xotira", ru: "Оперативная память", en: "RAM" },
    storage: { uz: "Xotira disklari", ru: "Накопители", en: "Storage" },
    psus: { uz: "Quvvat manbalari", ru: "Блоки питания", en: "Power Supplies" },
    psu: { uz: "Quvvat manbalari", ru: "Блоки питания", en: "Power Supplies" },
    cases: { uz: "Kompyuter korpuslari", ru: "Корпуса", en: "Cases" },
    cooling: { uz: "Sovitish tizimlari", ru: "Системы охлаждения", en: "Cooling" },
    kullerlar: { uz: "Kullerlar", ru: "Кулеры", en: "Coolers" },
    motherboards: { uz: "Ona platalar", ru: "Материнские платы", en: "Motherboards" },
    prebuilts: { uz: "Tayyor kompyuterlar", ru: "Готовые ПК", en: "Prebuilt PCs" },
    accessories: { uz: "Aksessuarlar", ru: "Аксессуары", en: "Accessories" }
};

export function getCategoryDisplayName(category, lang = 'uz') {
    if (!category) return '';
    if (typeof category === 'string') {
        const key = category.toLowerCase().trim();
        if (CATEGORY_TRANSLATIONS[key]) {
            return CATEGORY_TRANSLATIONS[key][lang] || CATEGORY_TRANSLATIONS[key]['uz'] || category;
        }
        return category;
    }
    if (lang === 'ru' && category.name_ru) return category.name_ru;
    if (lang === 'en' && category.name_en) return category.name_en;
    if (lang === 'uz' && category.name) return category.name;
    
    const lookupKey = (category.slug || category.id || category.name || '').toLowerCase().trim();
    if (CATEGORY_TRANSLATIONS[lookupKey]) {
        return CATEGORY_TRANSLATIONS[lookupKey][lang] || CATEGORY_TRANSLATIONS[lookupKey]['uz'] || category.name;
    }
    return category.name || category.slug || '';
}

export const COLLECTIONS = {
    USERS: 'users',
    PRODUCTS: 'products',
    CATEGORIES: 'categories',
    ORDERS: 'orders',
    REVIEWS: 'reviews',
    COUPONS: 'coupons',
    WISHLIST: 'wishlist',
    CARTS: 'carts',
    STORES: 'stores',
    BANNERS: 'banners',
    PREBUILTS: 'prebuilts',
    BRANDS: 'brands',
    SETTINGS: 'settings'
};
