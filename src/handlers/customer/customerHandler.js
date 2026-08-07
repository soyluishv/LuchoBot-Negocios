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

    if (
        text === "1"
    ) {

        sessionStorage.updateSession(
            userId,
            {
                state:
                    "VIEWING_CATEGORIES"
            }
        );

        return buildCategoriesMenu();

    }

    if (
        text === "2"
    ) {

        const cart =
            cartService.getCart(
                userId
            );

        const subtotal =
            cartService.getSubtotal(
                userId
            );

        return cartTemplate.formatCart(
            cart,
            subtotal
        );

    }

    return (
        "🍔 Bienvenido a Rapicros Alita\n\n" +
        "1️⃣ Ver menú\n" +
        "2️⃣ Ver carrito\n" +
        "3️⃣ Finalizar pedido\n\n" +
        "0️⃣ Cancelar"
    );

}

    // ======================================
    // VIENDO CATEGORÍAS
    // ======================================

    if (
        session.state ===
        "VIEWING_CATEGORIES"
    ) {

        if (
            text === "0"
        ) {

            sessionStorage.updateSession(
                userId,
                {
                    state:
                        "MAIN_MENU"
                }
            );

            return (
                "🍔 Menú principal\n\n" +
                "1️⃣ Ver menú\n" +
                "2️⃣ Ver carrito\n" +
                "3️⃣ Finalizar pedido"
            );

        }

const categories =
    catalogService.getActiveCategories();

const selectedIndex =
    parseInt(text, 10) - 1;

if (
    selectedIndex >= 0 &&
    selectedIndex < categories.length
) {

    const category =
        categories[selectedIndex];

    sessionStorage.updateSession(
        userId,
        {
            state:
                "VIEWING_PRODUCTS",

            data: {
                categoryId:
                    category.id
            }
        }
    );

    return buildProductsMenu(
        category.id
    );

}

return (
    "📋 Selecciona una categoría válida."
);

    }
// ======================================
// VIENDO PRODUCTOS
// ======================================

if (
    session.state ===
    "VIEWING_PRODUCTS"
) {

    if (
        text === "0"
    ) {

        sessionStorage.updateSession(
            userId,
            {
                state:
                    "VIEWING_CATEGORIES"
            }
        );

        return buildCategoriesMenu();

    }

    const products =
        catalogService.getProductsByCategory(
            session.data.categoryId
        );

    const selectedIndex =
        parseInt(text, 10) - 1;

    if (
        selectedIndex >= 0 &&
        selectedIndex < products.length
    ) {

        const product =
            products[selectedIndex];

        cartService.addProduct(
            userId,
            product.id,
            1
        );

        return (
            "✅ Producto agregado al carrito\n\n" +
            `🍔 ${product.name}\n` +
            `💰 $${product.price.toLocaleString("es-CO")}\n\n` +
            "Puedes seguir agregando productos o escribir 0 para volver."
        );

    }

    return (
        "🍔 Selecciona un producto válido."
    );

}

    return "❌ Estado no reconocido.";

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    processCustomerMessage

};