/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║          ONEPC — FEATURE FLAGS (TOGGLE PANEL)            ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * Bu faylda sayt xususiyatlarini yoqish/o'chirish boshqariladi.
 * Xususiyatni yoqish uchun: false → true
 * Xususiyatni o'chirish uchun: true → false
 *
 * ⚠️  O'zgartirgandan keyin serverni qayta ishga tushiring:
 *     npm run dev  (yoki railway/vercel deploy)
 */

export const FEATURES = {
    /**
     * PC BUILDER PAGE
     * ─────────────────────────────────────────
     * false → page yashiriladi, /pc-builder → / ga redirect qiladi
     * true  → page to'liq ishlaydi (navbar, footer, sitemap da ko'rinadi)
     */
    PC_BUILDER: false,
};
