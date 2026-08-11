const cartService = require(
    "../../services/cart/cartService"
);

const cartTemplate = require(
    "../../templates/cartTemplate"
);

const sessionStorage = require(
    "../../storage/sessionStorage"
);

function handleMainMenu(
    userId,
    text,
    buildCategoriesMenu
) {

    if (text === "1") {

        sessionStorage.updateSession(
            userId,
            {
                state:
                    "VIEWING_CATEGORIES"
            }
        );

        return buildCategoriesMenu();

    }

if (text === "2") {

    sessionStorage.updateSession(
        userId,
        {
            state: "VIEWING_CART"
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

    return cartTemplate.formatCart(
        cart,
        subtotal
    );

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

            return (
                "🛒 Tu carrito está vacío."
            );

        }

        sessionStorage.updateSession(
            userId,
            {
                state:
                    "SELECTING_DELIVERY"
            }
        );

return (
    "🚚━━━━━━━━━━━━🚚\n\n" +

    "📦 *ENTREGA DEL PEDIDO*\n\n" +

    "━━━━━━━━━━━━━━\n\n" +

    "1️⃣ 🏠 Domicilio\n\n" +

    "2️⃣ 🛍️ Recoger en punto\n\n" +

    "━━━━━━━━━━━━━━\n\n" +

    "👇 Elige una opción"
);

    }

return (
    "🔥🍔 *RAPI CROCK'S* 🍔🔥\n\n" +
    "━━━━━━━━━━━━━━━━━━\n\n" +
    "😋 *¡Bienvenido!*\n\n" +
    "🌭 Perros Calientes\n" +
    "🍔 Hamburguesas\n" +
    "🍟 Papas\n" +
    "🥤 Bebidas\n\n" +
    "━━━━━━━━━━━━━━━━━━\n\n" +
    "1️⃣ 🍔 Ver Menú\n\n" +
    "2️⃣ 🛒 Ver Carrito\n\n" +
    "3️⃣ ✅ Finalizar Pedido\n\n" +
    "━━━━━━━━━━━━━━━━━━\n\n" +
    "0️⃣ ❌ Cancelar\n\n" +
    "👇 Responde con una opción"
);

}

module.exports = {
    handleMainMenu
};