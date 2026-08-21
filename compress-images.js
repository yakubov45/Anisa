const fs = require('fs');
const path = require('path');

// Skriptni ishlatish uchun `npm install sharp` qiling
let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.error("Xatolik: 'sharp' moduli topilmadi. Iltimos terminalda: 'npm install sharp' deb yozib o'rnating.");
  process.exit(1);
}

const dir = path.join(__dirname, 'public', 'sichqoncha video frame');

console.log("Rasmlarni qidirish...");
fs.readdir(dir, async (err, files) => {
  if (err) {
    console.error("Katalogni o'qishda xatolik:", err);
    return;
  }

  const jpgs = files.filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'));
  
  if (jpgs.length === 0) {
    console.log("Konvertatsiya qilish uchun hech qanday .jpg rasm topilmadi. Balki oldin qilgandirsiz?");
    return;
  }

  console.log(`Jami ${jpgs.length} ta rasm topildi. Siqish jarayoni boshlandi...`);
  
  let successCount = 0;
  for (const file of jpgs) {
    const inPath = path.join(dir, file);
    const outPath = path.join(dir, file.replace(/\.jpe?g$/, '.webp'));
    
    try {
      await sharp(inPath)
        .webp({ quality: 75 }) // 75% sifat (juda zo'r sifat va kichik hajm)
        .toFile(outPath);
        
      console.log(`✅ Siqildi: ${file} -> ${path.basename(outPath)}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Xato: ${file} ni siqib bo'lmadi -`, error);
    }
  }

  console.log(`\n🎉 Jarayon tugadi! Jami ${successCount} ta rasm .webp formatiga muvaffaqiyatli o'tkazildi.`);
  console.log("Endi saytni yangilab, juda katta tezlikni his qilishingiz mumkin!");
});
