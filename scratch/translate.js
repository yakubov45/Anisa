const fs = require('fs');

const FILE_PATH = 'c:/Users/yoqub/OneDrive/Desktop/OnePC/products.json';
const data = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

data.forEach(product => {
    // Faqat o'zbek tiliga tarjima qilinmaganlarini aniqlaymiz
    if (product.description && !product.description.includes('tomonidan ishlab chiqarilgan')) {
        let dpi = "";
        if (product.specs) {
            dpi = product.specs["DPI"] || product.specs["Max DPI"] || "yuqori sifatli";
            if (dpi.includes(" - ")) {
                dpi = dpi.split(" - ")[1];
            }
        }
        
        let dpiText = dpi.includes("yuqori sifatli") ? "Yuqori sezuvchanlikka ega" : `${dpi} DPI sensor`;
        
        product.description = `${product.brand} tomonidan ishlab chiqarilgan yuqori aniqlikdagi ${product.name} geymerlar sichqonchasi. ${dpiText} va ergonomik tuzilishga ega.`;
    }
});

fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 4), 'utf8');
console.log("Barcha mahsulotlarning 'description' qismi o'zbek tiliga muvaffaqiyatli tarjima qilindi!");
