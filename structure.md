onepc/
├── app/
│   ├── layout.js               # Global Layout (Providers, Navbar, Footer)
│   ├── page.js                 # Bosh sahifa (Home)
│   ├── globals.css             # Global uslublar va Tailwind CSS
│   ├── loading.js              # Global yuklanish interfeysi
│   ├── error.js                # Xatoliklarni ushlash interfeysi
│   ├── not-found.js            # 404 xatolik sahifasi
│   │
│   ├── (auth)/                 # Autentifikatsiya sahifalari
│   │   ├── login/
│   │   │   └── page.js         # /login
│   │   ├── register/
│   │   │   └── page.js         # /register
│   │   └── forgot-password/
│   │       └── page.js         # /forgot-password
│   │
│   ├── (shop)/                 # Magazin sahifalari
│   │   ├── products/
│   │   │   ├── page.js         # /products (Katalog)
│   │   │   └── [id]/
│   │   │       └── page.js     # /products/[id] (Detallar)
│   │   ├── category/
│   │   │   └── [slug]/
│   │   │       └── page.js     # /category/[slug]
│   │   ├── pc-builder/
│   │   │   └── page.js         # /pc-builder (Konfigurator)
│   │   ├── cart/
│   │   │   └── page.js         # /cart
│   │   ├── checkout/
│   │   │   └── page.js         # /checkout
│   │   ├── wishlist/
│   │   │   └── page.js         # /wishlist
│   │   ├── compare/
│   │   │   └── page.js         # /compare
│   │   ├── search/
│   │   │   └── page.js         # /search?q=
│   │   └── support/
│   │       └── page.js         # /support
│   │
│   ├── (dashboard)/            # Boshqaruv panellari
│   │   ├── layout.js           # Shared Dashboard Layout (Sidebar)
│   │   │
│   │   ├── user/               # Foydalanuvchi kabineti
│   │   │   ├── page.js         # /dashboard/user (Profil)
│   │   │   └── orders/
│   │   │       ├── page.js     # Tarix
│   │   │       └── [id]/
│   │   │           └── page.js # Tafsilotlar
│   │   │
│   │   ├── admin/              # Admin paneli
│   │   │   ├── page.js         # Statistika
│   │   │   ├── products/       # Mahsulotlarni boshqarish
│   │   │   ├── orders/         # Buyurtmalar boshqaruvi
│   │   │   ├── users/          # Foydalanuvchilar ro'yxati
│   │   │   └── banners/        # Bannerlarni boshqarish
│   │   │
│   │   └── delivery/           # Yetkazib berish paneli
│   │       ├── page.js         # Faol buyurtmalar
│   │       └── history/        # Yetkazilganlar tarixi
│   │
│   └── api/                    # Server-side API yo'llari
│       ├── auth/               # Autentifikatsiya API
│       ├── products/           # Mahsulotlar API
│       ├── categories/         # Kategoriyalar API
│       ├── orders/             # Buyurtmalar API
│       ├── upload/             # Fayllarni yuklash API
│       └── brands/             # Brendlar API (MongoDB)
│
├── components/                 # Interfeys komponentlari
│   ├── layout/                 # Navbar, Footer, Sidebar, IntroOverlay
│   ├── ui/                     # Kichik elementlar (Button, Modal, Input)
│   ├── home/                   # Bosh sahifa uchun maxsus bloklar
│   └── orders/                 # Buyurtma kartochkalari va QR-kodlar
│
├── features/                   # Murakkab biznes funksiyalari
│   ├── builder/                # PC Builder mantiqi
│   ├── cart/                   # Savatcha mantiqi
│   └── product/                # Mahsulotlar filtri va qidiruvi
│
├── lib/                        # Yordamchi resurslar
│   ├── services/               # Firebase va API xizmatlari
│   ├── firebase/               # Firebase konfiguratsiyasi
│   ├── constants.js            # Tizim konstantalari (rollar, statuslar)
│   └── utils.js                # Yordamchi funksiyalar
│
├── store/                      # Global holat (Zustand)
│   ├── useStore.js             # Savatcha va umumiy holat
│   └── useBuildStore.js        # PC Builder holati
│
├── public/                     # Statik fayllar
│   ├── videos/                 # Mahsulot videolari
│   ├── images/                 # Logotiplar va rasmlar
│   └── uploads/                # Yuklangan fayllar
│
├── tailwind.config.js          # Dizayn tizimi sozlamalari
├── next.config.mjs             # Next.js sozlamalari
└── endPoint.json               # API dokumentatsiyasi
