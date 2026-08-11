const cartEditorService = require(
    "../../services/cart/cartEditorService"
);

const customerDataService = require(
    "../../services/checkout/customerDataService"
);

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
const {
    handleCart
} = require(
    "../cart/cartHandler"
);
// ==========================================
// MENÚ DE CATEGORÍAS
// ==========================================

function buildCategoriesMenu() {

    const categories =
        catalogService.getActiveCategories();

let menuText =
    "🍔━━━━━━━━━━━━🍔\n\n" +

    "📋 *MENÚ PRINCIPAL*\n\n";

categories.forEach(
    (category, index) => {

        let icon = "🍽️";

        if (category.name.includes("Chuzo")) {
            icon = "🍢";
        }
        else if (category.name.includes("Perro")) {
            icon = "🌭";
        }
        else if (category.name.includes("Arepa")) {
            icon = "🫓";
        }
        else if (category.name.includes("Alas")) {
            icon = "🍗";
        }
        else if (category.name.includes("Salchipapas")) {
            icon = "🍟";
        }
        else if (category.name.includes("Hamburguesas")) {
            icon = "🍔";
        }
        else if (category.name.includes("Adiciones")) {
            icon = "➕";
        }
        else if (category.name.includes("Bebidas")) {
            icon = "🥤";
        }

        menuText +=
            `${index + 1}️⃣ ${icon} ${category.name}\n\n`;

    }
);

menuText +=
    "━━━━━━━━━━━━━━\n\n" +

    "0️⃣ 🔙 Volver";

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
    "🍔━━━━━━━━━━━━🍔\n\n" +

    `📋 ${category.name.toUpperCase()}\n\n` +

    "━━━━━━━━━━━━━━\n\n";

products.forEach(
    (product, index) => {

        menuText +=
            `${index + 1}️⃣ ${product.name}\n` +

            `💰 $${product.price.toLocaleString("es-CO")}\n\n`;

    }
);

menuText +=
    "━━━━━━━━━━━━━━\n\n" +

    "0️⃣ 🔙 Volver\n\n" +

    "👇 Elige un producto";

return menuText;

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

if (
    session.state ===
    "VIEWING_CART"
) {

    return handleCart(
        userId,
        text,
        session,
        buildCategoriesMenu
    );

}

if (
    session.state ===
    "SELECTING_QUANTITY_PRODUCT"
) {

    const position =
        parseInt(text, 10);

    const item =
        cartEditorService.getItemByPosition(
            userId,
            position
        );

    if (!item) {

        return (
            "❌ Producto inválido.\n\n" +
            "👇 Escribe un número válido"
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "ENTERING_NEW_QUANTITY",

            selectedPosition:
                position
        }
    );

    return (
        "🔢 *NUEVA CANTIDAD*\n\n" +
        "👇 Escribe la nueva cantidad"
    );

}

if (
    session.state ===
    "ENTERING_NEW_QUANTITY"
) {

    const quantity =
        parseInt(text, 10);

    if (
        isNaN(quantity) ||
        quantity < 1
    ) {

        return (
            "❌ Cantidad inválida."
        );

    }

    const result =
        cartEditorService.setQuantityByPosition(
            userId,
            session.selectedPosition,
            quantity
        );

    if (!result.ok) {

        return (
            "❌ Cantidad inválida."
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "VIEWING_CART",
            selectedPosition:
                null
        }
    );

    const cart =
        cartService.getCart(
            userId
        );

    const subtotal =
        cartService.getSubtotal(
            userId
        );

    return (
        "✅ Cantidad actualizada\n\n" +
        cartTemplate.formatCart(
            cart,
            subtotal
        )
    );

}

if (
    session.state ===
    "REMOVING_PRODUCT"
) {

    const position =
        parseInt(text, 10);

    const result =
        cartEditorService.removeByPosition(
            userId,
            position
        );

    if (!result.ok) {

        return (
            "❌ Producto inválido."
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "VIEWING_CART"
        }
    );

    const cart =
        cartService.getCart(
            userId
        );

    if (
        cart.items.length === 0
    ) {

        sessionStorage.updateSession(
            userId,
            {
                state:
                    "VIEWING_CATEGORIES"
            }
        );

        return (
            "✅ Producto eliminado.\n\n" +
            buildCategoriesMenu()
        );

    }

    const subtotal =
        cartService.getSubtotal(
            userId
        );

    return (
        "✅ Producto eliminado\n\n" +
        cartTemplate.formatCart(
            cart,
            subtotal
        )
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