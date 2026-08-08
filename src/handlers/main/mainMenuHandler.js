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
            "🚚 ¿Cómo deseas recibir tu pedido?\n\n" +
            "1️⃣ Domicilio\n" +
            "2️⃣ Recoger en punto"
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

module.exports = {
    handleMainMenu
};