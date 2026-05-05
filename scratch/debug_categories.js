const { getProducts, getCategories } = require('./features/product/api');

async function test() {
    const products = await getProducts();
    const categories = await getCategories();
    
    console.log('PRODUCTS COUNT:', products.length);
    if (products.length > 0) {
        console.log('SAMPLE PRODUCT CATEGORY:', products[0].category);
        console.log('PRODUCT KEYS:', Object.keys(products[0]));
    }
    
    console.log('CATEGORIES:', categories.map(c => ({ id: c.id, name: c.name })));
}

test();
