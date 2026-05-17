const https = require('https');

// 1️⃣ BU YERGA O'ZINGIZNING BOT TOKENINGIZNI QO'YING
// (BotFather'dan olingan token. Masalan: '123456789:AAHxxxxxxxxxxxxxxxxxxxxxxx')
const BOT_TOKEN = '8754582885:AAFsKQeRYj4w1gWYcKzhRJOvS1M21KAYA_E';

if (BOT_TOKEN === 'BU_YERGA_TOKEN_YOZING') {
    console.log("XATOLIK: Iltimos, fayl ichiga Telegram Bot Tokeningizni yozing!");
    console.log("1. Telegramda @BotFather ga kiring.");
    console.log("2. /newbot yozing va bot oching.");
    console.log("3. Berilgan tokenni shu faylning 5-qatoriga qo'ying.");
    process.exit(1);
}

console.log("⏳ Botga yozgan foydalanuvchilarning xabarlari tekshirilmoqda...");
console.log("DIQQAT: Telegramga kirib botingizga /start deb yozing yoki biron xabar yuboring!\n");

const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const response = JSON.parse(data);
            if (!response.ok) {
                console.log("XATOLIK: Token noto'g'ri bo'lishi mumkin:", response.description);
                return;
            }

            const messages = response.result;
            if (messages.length === 0) {
                console.log("❌ Hali hech kim botga xabar yozmabdi.");
                console.log("👉 Iltimos, Telegram orqali botingizga kirib 'Salom' deb yozing va bu skriptni qaytadan ishga tushiring.");
                return;
            }

            // Oxirgi yozgan odamni topish
            const lastMessage = messages[messages.length - 1].message;
            if (!lastMessage) return;

            const chatId = lastMessage.chat.id;
            const firstName = lastMessage.chat.first_name || "Foydalanuvchi";
            const text = lastMessage.text;

            console.log("✅ XABAR TOPILDI!");
            console.log(`👤 Ismi: ${firstName}`);
            console.log(`💬 Yozgan xabari: ${text}`);
            console.log(`\n======================================================`);
            console.log(`🆔 SIZNING CHAT ID RAQAMINGIZ: >>> ${chatId} <<<`);
            console.log(`======================================================\n`);
            console.log("🚀 Ushbu Chat ID ni loyihadagi .env.local faylidagi TELEGRAM_CHAT_ID o'rniga yozing!\n");

            // Test xabar jo'natib ko'rish
            sendTestMessage(chatId);

        } catch (e) {
            console.log("Xatolik yuz berdi:", e.message);
        }
    });
}).on("error", (err) => {
    console.log("Internet bilan muammo:", err.message);
});

function sendTestMessage(chatId) {
    console.log("📲 Bot orqali test xabar yuborilmoqda...");

    const message = encodeURIComponent("🎉 Tabriklayman! Bot muvaffaqiyatli ulandi va endi buyurtmalarni shu yerda qabul qilasiz!");
    const sendUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage?chat_id=${chatId}&text=${message}`;

    https.get(sendUrl, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
            const result = JSON.parse(data);
            if (result.ok) {
                console.log("✅ Test xabar muvaffaqiyatli yuborildi! Telegramingizni tekshiring.");
            } else {
                console.log("❌ Xabar yuborishda xatolik:", result.description);
            }
        });
    });
}
