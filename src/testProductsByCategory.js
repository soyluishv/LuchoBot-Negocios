const catalogService = require(
    "./services/catalog/catalogService"
);

console.log("======================================");
console.log("🍔 PRODUCTOS HAMBURGUESAS");
console.log("======================================");

const products =
    catalogService.getProductsByCategory(
        "hamburguesas"
    );

products.forEach(
    (product, index) => {

        console.log(
            `${index + 1}. ${product.name} - $${product.price.toLocaleString("es-CO")}`
        );

    }
);

console.log("======================================");
console.log(
    `Total productos: ${products.length}`
);
console.log("======================================");