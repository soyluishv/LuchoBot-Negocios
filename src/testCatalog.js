/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba y validación del catálogo
 * ==========================================
 */

const catalogService = require(
    "./services/catalog/catalogService"
);

console.log("======================================");
console.log("🍔 LuchoBot Negocios - Catálogo");
console.log("======================================");

const categories = catalogService.getCategories();
const products = catalogService.getProducts();

let errors = 0;

// ==========================================
// INFORMACIÓN GENERAL
// ==========================================

console.log(`📂 Categorías: ${categories.length}`);
console.log(`🍔 Productos: ${products.length}`);

console.log("");

// ==========================================
// VALIDAR IDs DE PRODUCTOS
// ==========================================

const productIds = new Set();

for (const product of products) {

    if (productIds.has(product.id)) {

        console.log(
            `❌ ID de producto repetido: ${product.id}`
        );

        errors++;

    }

    productIds.add(product.id);

}

// ==========================================
// VALIDAR PRECIOS
// ==========================================

for (const product of products) {

    if (
        typeof product.price !== "number" ||
        product.price < 0
    ) {

        console.log(
            `❌ Precio inválido: ${product.name}`
        );

        errors++;

    }

}

// ==========================================
// VALIDAR CATEGORÍAS
// ==========================================

const categoryIds = new Set(
    categories.map(category => category.id)
);

for (const product of products) {

    if (!categoryIds.has(product.categoryId)) {

        console.log(
            `❌ ${product.name} pertenece a una categoría inexistente: ${product.categoryId}`
        );

        errors++;

    }

}

// ==========================================
// MOSTRAR CATÁLOGO
// ==========================================

console.log("📋 CATÁLOGO ACTIVO");
console.log("--------------------------------------");

for (const category of categories) {

    if (!category.enabled) {

        continue;

    }

    const categoryProducts =
        catalogService.getProductsByCategory(
            category.id
        );

    console.log("");
    console.log(
        `${category.emoji} ${category.name.toUpperCase()}`
    );

    for (const product of categoryProducts) {

        const price = product.price.toLocaleString(
            "es-CO"
        );

        console.log(
            `   ${product.id} | ${product.name} | $${price}`
        );

    }

}

// ==========================================
// RESULTADO
// ==========================================

console.log("");
console.log("======================================");

if (errors === 0) {

    console.log("✅ CATÁLOGO VALIDADO CORRECTAMENTE");

} else {

    console.log(
        `❌ CATÁLOGO CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");