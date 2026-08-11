
const sessionStorage = require(
    "../../storage/sessionStorage"
);

const cartService = require(
"../../services/cart/cartService"
);

function handleCart(
    userId,
    text,
    session,
    buildCategoriesMenu
) {

    if (text === "1") {

        sessionStorage.updateSession(
            userId,
            {
                state: "VIEWING_CATEGORIES"
            }
        );

        return buildCategoriesMenu();

    }

if (text === "2") {

    const cart =
        cartService.getCart(userId);

    if (
        !cart ||
        cart.items.length === 0
    ) {

        return "🛒 Tu carrito está vacío.";

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "SELECTING_QUANTITY_PRODUCT"
        }
    );

    let message =
        "🔢 *CAMBIAR CANTIDAD*\n\n";

    cart.items.forEach(
        (item, index) => {

            message +=
                `${index + 1}️⃣ ${item.name}\n`;

        }
    );

    message +=
        "\n👇 Escribe el número del producto";

    return message;

}

if (text === "3") {

    const cart =
        cartService.getCart(
            userId
        );

    if (
        !cart ||
        cart.items.length === 0
    ) {

        return "🛒 Tu carrito está vacío.";

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "REMOVING_PRODUCT"
        }
    );

    let message =
        "🗑️ *ELIMINAR PRODUCTO*\n\n";

    cart.items.forEach(
        (item, index) => {

            message +=
                `${index + 1}️⃣ ${item.name}\n`;

        }
    );

    message +=
        "\n👇 Escribe el número del producto";

    return message;

}

    if (text === "4") {

        sessionStorage.updateSession(
            userId,
            {
                state: "SELECTING_DELIVERY"
            }
        );

        return (
            "🚚━━━━━━━━━━━━🚚\n\n" +
            "1️⃣ 🏠 Domicilio\n\n" +
            "2️⃣ 🛍️ Recoger en punto"
        );

    }

    if (text === "0") {

        sessionStorage.updateSession(
            userId,
            {
                state: "MAIN_MENU"
            }
        );

        return (
            "🏠 Regresando al menú principal..."
        );

    }

    return "❌ Opción no válida.";

}

module.exports = {
    handleCart
};