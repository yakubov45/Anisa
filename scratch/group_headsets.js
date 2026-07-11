const fs = require('fs');

const data = JSON.parse(fs.readFileSync('c:/Users/yoqub/OneDrive/Desktop/OnePC/products_headsets.json', 'utf8'));

const extractColor = (name) => {
    name = name.trim();
    const colorMap = {
        ' White': 'White',
        ' WH': 'White',
        ' Black Red': 'Black Red',
        ' Black': 'Black',
        ' Icy White': 'Icy White',
        ' Rose Red': 'Rose Red',
        ' Sky White': 'Sky White',
        ' Steel Black': 'Steel Black',
        ' Orange': 'Orange',
        ' Pink': 'Pink',
        ' LIGHT': 'Light',
        ' DARK': 'Dark',
        ' ROSE GOLD': 'Rose Gold',
        ' MINT': 'Mint',
        ' (black)': 'Black',
        ' (quartz)': 'Quartz',
        ' (carbon)': 'Carbon',
        ' green': 'Green'
    };

    for (const [key, color] of Object.entries(colorMap)) {
        if (name.toLowerCase().endsWith(key.toLowerCase())) {
            const baseName = name.slice(0, name.length - key.length);
            return { baseName, color };
        }
    }
    
    return { baseName: name, color: 'Standard' }; // default
};

// Custom groupings for tricky names like "RAPOO VH160S" vs "RAPOO VH160S WH"
// If a product has a Standard, but there are other colors, make standard 'Black'
const colorHexMap = {
    'White': '#ffffff',
    'Black': '#000000',
    'Standard': '#000000',
    'Pink': '#ffc0cb',
    'Quartz': '#ffc0cb',
    'Orange': '#ffa500',
    'Black Red': '#8b0000',
    'Icy White': '#f0f8ff',
    'Rose Red': '#ff007f',
    'Sky White': '#87ceeb',
    'Steel Black': '#2f4f4f',
    'Light': '#d3d3d3',
    'Dark': '#1a1a1a',
    'Rose Gold': '#b76e79',
    'Mint': '#98ff98',
    'Carbon': '#333333',
    'Green': '#008000'
};

const grouped = {};

data.forEach(item => {
    let { baseName, color } = extractColor(item.name);
    
    // Exception for "ATK Neptune N9 Ultra Stellar Orange/Pink"
    if (item.name.includes("ATK Neptune N9 Ultra Stellar")) {
        baseName = "ATK Neptune N9 Ultra Stellar";
        color = item.name.replace("ATK Neptune N9 Ultra Stellar ", "");
    }
    
    if (!grouped[baseName]) {
        grouped[baseName] = {
            name: baseName,
            category: "Headsets",
            brand: item.brand,
            basePrice: item.price,
            discount: 0,
            description: item.description,
            specs: item.specs,
            variants: []
        };
    }
    
    grouped[baseName].variants.push({
        colorName: color === 'WH' ? 'White' : (color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()),
        colorHex: colorHexMap[color] || '#000000',
        stock: item.stock || 15,
        sku: item.brand.substring(0,3).toUpperCase() + '-' + baseName.substring(0,5).replace(/\s/g,'').toUpperCase() + '-' + color.substring(0,3).toUpperCase(),
        price: item.price,
        images: []
    });
});

// Update standard to Black if there are multiple variants and one is standard
Object.values(grouped).forEach(product => {
    if (product.variants.length > 1) {
        product.variants.forEach(v => {
            if (v.colorName === 'Standard') {
                v.colorName = 'Black';
                v.colorHex = '#000000';
            }
        });
    }
});

fs.writeFileSync('c:/Users/yoqub/OneDrive/Desktop/OnePC/products_headsets_grouped.json', JSON.stringify(Object.values(grouped), null, 4));
console.log('Grouped products written to products_headsets_grouped.json');
