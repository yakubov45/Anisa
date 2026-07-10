const fs = require('fs');

const data = `ASUS ROG THETA 7.1  170
ASUS ROG FUSION II 300  120
ATK Neptune N9 PRO White  45
ATK Neptune N9 PRO Black  45
ATK Neptune N9 Ultra Stellar Orange  55
ATK Neptune N9 Ultra Stellar Pink  55
COUGAR PHONTUM ESSENTIAL Pink  55
COUGAR SPETTRO  115
MCHOSE V9 Pro Black Red  45
MCHOSE V9 Pro Icy White  45
MCHOSE V9 Pro Rose Red  45
MCHOSE V9 Pro Sky White  45
MCHOSE V9 Pro Steel Black  45
MCHOSE X9 Black  55
MCHOSE X9 Rose Red  55
MCHOSE X9 White  55
RAPOO H150S  15
RAPOO VH160S  23
RAPOO VH160S WH  23
RAPOO VH300S  25
RAPOO VH350S  25
RAPOO VH500C  27
RAPOO VH650  35
RAPOO VH800  50
RAPOO VH850  50
IO GRAPHITE BLACK  45
IO GRAPHITE LIGHT  45
IO GRAPHITE ROSE GOLD  45
IO GRAPHITE DARK  45
IO GRAPHITE MINT  45
IO GRAPHITE 2 BLACK  55
IO GRAPHITE 2 WHITE  55
IO GRAPHITE 2 ROSE GOLD  55
IO GRAPHITE PRO BLACK  70
IO GRAPHITE PRO WHITE  70
IO HARMONY LIGHT  38
IO HARMONY DARK  38
CORSAIR HS55 STEREO (carbon)  60
RAZER BARRACUDA X  99
RAZER BARRACUDA X CHROMA  129
RAZER BARRACUDA X CHROMA WH  130
RAZER BARRACUDA X WH  99
RAZER BLACKSHARK v2 X  55
RAZER BLACKSHARK v2 X WH  55
RAZER BLACKSHARK v2 X HYPERSPEED  120
RAZER BLACKSHARK v2 X HYPERSPEED WH  120
RAZER BLACKSHARK v2 PRO   175
RAZER BLACKSHARK v2 PRO WH  175
RAZER BLACKSHARK v3 X HYPERSPEED  105
RAZER BLACKSHARK v3  150
RAZER BLACKSHARK v3 WH  150
RAZER BLACKSHARK v3 PRO  225
RAZER BLACKSHARK v3 PRO WH  225
RAZER KRAKEN Kitty Edition (black)  120
RAZER KRAKEN Kitty Edition (quartz)  135
RAZER KRAKEN v4 X (Minecraft Edition)  110
RAZER KRAKEN X Lite  36
RAZER OPUS X green  70`;

const generateSpecs = (name, price) => {
    const isWireless = name.toLowerCase().includes('wireless') || name.toLowerCase().includes('pro') || name.toLowerCase().includes('hyperspeed') || name.toLowerCase().includes('barracuda') || name.toLowerCase().includes('opus') || price > 90;
    const hasRGB = name.toLowerCase().includes('chroma') || name.toLowerCase().includes('rgb') || name.toLowerCase().includes('kitty') || name.toLowerCase().includes('rog') || name.toLowerCase().includes('n9');
    
    let specs = {
        "Ulanish": isWireless ? "Simsiz (2.4GHz / Bluetooth) / Simli (3.5mm)" : "Simli (USB / 3.5mm)",
        "Mikrofon": name.toLowerCase().includes('opus') ? "O'rnatilgan (Ichki)" : "Yechiluvchan / Buklanadigan (Noise-Canceling)",
        "Chastota diapazoni": "20 Hz - 20 kHz",
        "Qarshilik": "32 Ohm",
        "Ovoz tizimi": price > 70 ? "7.1 Surround Sound" : "Stereo 2.0",
        "RGB yoritish": hasRGB ? "Bor" : "Yo'q",
        "Drayver o'lchami": price > 100 ? "50mm Titanium" : (price > 40 ? "50mm Neodymium" : "40mm"),
        "Og'irlik": Math.floor(Math.random() * (350 - 240 + 1) + 240) + " g"
    };

    if (isWireless) {
        specs["Batareya"] = price > 150 ? "70 soatgacha" : "40-50 soatgacha";
    }

    return specs;
};

const getBrand = (name) => {
    const brands = ['ASUS', 'ATK', 'COUGAR', 'MCHOSE', 'RAPOO', 'IO', 'CORSAIR', 'RAZER'];
    const firstWord = name.split(' ')[0].toUpperCase();
    if (brands.includes(firstWord)) return firstWord;
    return 'Boshqa';
};

const products = data.split('\n').filter(line => line.trim()).map(line => {
    // Regular expression to match the name and the price at the end
    const match = line.match(/(.+?)\s+(\d+)$/);
    if (!match) return null;
    
    const name = match[1].trim();
    const price = parseInt(match[2].trim());
    
    return {
        name,
        price,
        oldPrice: Math.floor(price * 1.15), // 15% qimmatroq eski narx
        category: "headsets",
        brand: getBrand(name),
        description: `${name} - yuqori sifatli va qulay geymerlar uchun mo'ljallangan quloqchin. Uzoq vaqt davomida o'ynash uchun ideal tanlov.`,
        isAvailable: true,
        stock: Math.floor(Math.random() * 20) + 5,
        rating: 5,
        reviewsCount: Math.floor(Math.random() * 50) + 1,
        images: [],
        specs: generateSpecs(name, price)
    };
}).filter(Boolean);

fs.writeFileSync('C:/Users/yoqub/OneDrive/Desktop/OnePC/products_headsets.json', JSON.stringify(products, null, 4), 'utf-8');
console.log('Fayl yaratildi: products_headsets.json');
