const cartService = require(
    "../../services/cart/cartService"
);

const cartTemplate = require(
    "../../templates/cartTemplate"
);

const catalogService = require(
    "../../services/catalog/catalogService"
);

const sessionStorage = require(
    "../../storage/sessionStorage"
);

const customerDataService = require(
    "../../services/checkout/customerDataService"
);
const {
    handleMainMenu
} = require(
    "../main/mainMenuHandler"
);
const {
    handleCategories
} = require(
    "../catalog/categoryHandler"
);
const {
    handleProducts
} = require(
    "../catalog/productHandler"
);
const {
    handleCheckout
} = require(
    "../checkout/checkoutHandler"
);

// ==========================================
// MENÚ DE CATEGORÍAS
// ==========================================

function buildCategoriesMenu() {

    const categories =
        catalogService.getActiveCategories();

    let menuText =
        "📋 MENÚ\n\n";

    categories.forEach(
        (category, index) => {

            menuText +=
                `${index + 1}️⃣ ${category.name}\n`;

        }
    );

    menuText += "\n0️⃣ Volver";

    return menuText;

}

// ==========================================
// MENÚ DE PRODUCTOS
// ==========================================

function buildProductsMenu(
    categoryId
) {

    const category =
        catalogService.getCategoryById(
            categoryId
        );

    const products =
        catalogService.getProductsByCategory(
            categoryId
        );

    let menuText =
        `🍔 ${category.name.toUpperCase()}\n\n`;

    products.forEach(
        (product, index) => {

            menuText +=
                `${index + 1}️⃣ ${product.name} - $${product.price.toLocaleString("es-CO")}\n`;

        }
    );

    menuText += "\n0️⃣ Volver";

    return menuText;

}

// ==========================================
// PROCESAR MENSAJE CLIENTE
// ==========================================

function processCustomerMessage(
    userId,
    message
) {

    const session =
        sessionStorage.getSession(
            userId
        );

    const text =
        message.trim();

// ======================================
// MENÚ PRINCIPAL
// ======================================

if (
    session.state === "MAIN_MENU"
) {

    return handleMainMenu(
        userId,
        text,
        buildCategoriesMenu
    );

}
// ======================================
// VIENDO CATEGORÍAS
// ======================================

if (
    session.state ===
    "VIEWING_CATEGORIES"
) {

    return handleCategories(
        userId,
        text,
        buildProductsMenu
    );

}

// ======================================
// VIENDO PRODUCTOS
// ======================================

if (
    session.state ===
    "VIEWING_PRODUCTS"
) {

    return handleProducts(
        userId,
        text,
        session,
        buildCategoriesMenu,
        buildProductsMenu
    );

}

if (
    session.state ===
    "PRODUCT_ADDED"
) {

    return handleProducts(
        userId,
        text,
        session,
        buildCategoriesMenu,
        buildProductsMenu
    );

}

const checkoutResponse =
handleCheckout(
    userId,
    text,
    session
);

if (
    checkoutResponse
) {

    return checkoutResponse;

}

return "❌ Estado no reconocido.";

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    processCustomerMessage

};