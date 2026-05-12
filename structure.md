# OnePc Loyihasi Arxitekturasi va Fayllar Tuzilmasi

Ushbu hujjat loyihaning papka va fayllari nimaga javob berishini, ularning vazifalari va tizimdagi o'rnini batafsil tushuntiradi. Loyiha **Next.js App Router** arxitekturasi asosida qurilgan.

## Asosiy Papkalar

### `app/` (Asosiy Ilova Routers)
Bu papkada saytning barcha sahifalari (URL manzillar) joylashgan. Har bir papka URL manzilini bildiradi, `page.js` esa o'sha manzilning vizual qismi.

*   **`layout.js`**: Global Layout. Saytning barcha sahifalarini o'rab turuvchi asosiy qobiq. Navbar (tepa qism), Footer (pastki qism) va barcha Context Provider-lar (Theme, Auth, Language) shu yerda ulanadi.
*   **`page.js`**: Bosh sahifa (`/`).
*   **`globals.css`**: Saytning asosiy dizayn kodlari va Tailwind CSS direktivalari.
*   **`loading.js`**: Sahifalar yuklanayotganda chiqadigan global animatsiya.
*   **`error.js`**: Tizimda qandaydir xatolik yuz bersa (sayt qotib qolmasligi uchun) ushlab qoluvchi va "Xatolik yuz berdi" deb ko'rsatuvchi fayl.
*   **`not-found.js`**: 404 sahifa (mavjud bo'lmagan URL kiritilganda ko'rsatiladi).
*   **`sitemap.js` va `robots.js`**: SEO (Qidiruv tizimlari) uchun javob beradi. Saytda qanday sahifalar borligini Google'ga tushuntiradi.

#### `app/(auth)/` (Autentifikatsiya)
Qavs ichidagi papkalar URL-ga ta'sir qilmaydi, faqat kodni guruhlash uchun.
*   **`login/page.js`**: Tizimga kirish sahifasi.
*   **`register/page.js`**: Yangi foydalanuvchini ro'yxatdan o'tkazish.

#### `app/(shop)/` (Mijozlar qismi - Magazin)
*   **`products/page.js`**: Barcha mahsulotlar ro'yxati (Katalog, filtrlar).
*   **`products/[id]/page.js`**: Bitta mahsulotning to'liq ma'lumoti. Bu yerda SEO uchun JSON-LD sxemalari ham joylashgan.
*   **`pc-builder/page.js`**: Kompyuter yig'ish (Konfigurator) sahifasi.
*   **`cart/` va `checkout/`**: Savatcha va xaridni rasmiylashtirish (to'lovga o'tish) sahifalari.
*   **`support/page.js`**: Kafolat, xizmat ko'rsatish va mijozlarni qo'llab-quvvatlash sahifasi.

#### `app/(dashboard)/` (Boshqaruv panellari)
Ushbu bo'lim faqat tizimga kirganlar uchun.
*   **`layout.js`**: Dashboard uchun maxsus yonga (Sidebar) ega layout.
*   **`user/`**: Oddiy mijoz profili va uning buyurtmalari tarixi.
*   **`admin/`**: Sayt egasi paneli. Mahsulot qo'shish, buyurtmalarni boshqarish, foydalanuvchilar va bannerlarni tahrirlash shu yerdan qilinadi.
*   **`delivery/`**: Kuryerlar uchun panel. Unga biriktirilgan buyurtmalarni yetkazib berilgan deb belgilash, QR-kod skanerlash imkoniyatlari bor.

#### `app/api/` (Backend Yo'nalishlari)
Next.js server-side API qismi. Brauzerdan mustaqil, serverda ishlaydigan xavfsiz kodlar.
*   **`auth/`**: Xavfsiz tizimga kirish mantiqlari.
*   **`products/`, `orders/`**: Ma'lumotlarni bazadan tortib kelish, yangilash va xavfsiz jo'natish endpointlari.

---

### `components/` (UI va Bo'laklar)
Sahifalarni qurishda ishlatiladigan qayta-qayta foydalanish mumkin bo'lgan qismlar (G'ishtlar).
*   **`layout/`**: Navbar, Footer, Sidebar kabi katta o'zgaruvchan qismlar.
*   **`ui/`**: Tugmalar, modallar, inputlar kabi kichik UI elementlar.
*   **`home/`**: Faqat bosh sahifaga tegishli maxsus bloklar (HeroSlider, Category showcase).

---

### `lib/` (Mantiq va Xizmatlar)
Bu papka ilovaning miyasi hisoblanadi. Barcha ma'lumotlar almashinuvi, xavfsizlik va yordamchi vositalar shu yerda.
*   **`services/`**: 
    *   Tashqi xizmatlar (API) bilan gaplashuvchi qatlam. Masalan, Firebase-dan mahsulotlarni o'qish/yozish, foydalanuvchini avtorizatsiya qilish (`auth.service.js`). 
*   **`firebase/`**:
    *   Firebase bazasiga ulanish sozlamalari (`client.js` yoki `config.js`). Barcha DB ulanishlari shu yerdan boshlanadi.
*   **`validations.js`**: (Xavfsizlik)
    *   Foydalanuvchi kiritgan ma'lumotlarni qat'iy tekshirish uchun (Zod yordamida). Masalan, mahsulot narxi minus bo'lmasligi, email to'g'riligini serverga yetmasdan tekshiradi.
*   **`redis.js`**: (Unumdorlik/Kesh)
    *   Ma'lumotlarni tezkor o'qish uchun Upstash Redis kesh tizimi xizmati. DB ga tushadigan nagruzkani kamaytiradi.
*   **`LanguageContext.js` / `translations.js`**: 
    *   Saytning ko'p tillilik (O'zbek, Rus, Ingliz) tizimi. Barcha matnlar shu yerdan boshqariladi.
*   **`UserContext.js`**: 
    *   Joriy foydalanuvchining ma'lumotlari (Roli, Ismi) va Dark/Light mode holatini butun loyiha bo'ylab saqlovchi vosita.
*   **`actions/*.actions.js`**: 
    *   Server Actions mantiqlari. Mijozdan serverga to'g'ridan-to'g'ri, xavfsiz so'rov yuborish (masalan, valyutani o'zgartirish).

---

### `store/` (Global State Management)
Zustand kutubxonasi yordamida brauzer xotirasidagi tezkor ma'lumotlar.
*   **`useStore.js`**: Savatchadagi (Cart) mahsulotlar va joriy valyuta qaysiligini saqlaydi. Sahifa yangilansa ham saqlanib qoladi (Local Storage orqali).
*   **`useBuildStore.js`**: PC Builder konfiguratoridagi jarayonni saqlaydi (qaysi protsessor, qaysi plata tanlangani).

---

### `features/` (Katta Modullar)
Murakkab biznes qoidalari mujassamlangan izolyatsiya qilingan papka (masalan, API va state birgalikda ishlaydigan murakkab sahifalar uchun).

---

### Root (Asosiy yo'lakdagi maxsus fayllar)
*   **`sentry.*.config.js`**: (Monitoring va Xavfsizlik) Foydalanuvchilarda xatolik chiqsa, serveringizga bu xatolik haqida hisobot jo'natuvchi vositalar.
*   **`jest.config.js` / `jest.setup.js`**: (Testlash) Kodlarni va yozilgan mantiqlarni avtomatik tarzda to'g'ri ishlayotganini tekshiruvchi mexanizm.
*   **`next.config.mjs`**: Next.js serverini, rasmlar xavfsizligini (qaysi domenlardan rasm yuklash mumkinligi) va HTTP Security Header-larni (X-Frame-Options va boshqalar) sozlovchi eng asosiy konfiguratsiya fayli.
*   **`tailwind.config.js`**: Tizimning ranglari, shriftlari va dizayn animatsiyalari qoidalari saqlanadigan joy.
