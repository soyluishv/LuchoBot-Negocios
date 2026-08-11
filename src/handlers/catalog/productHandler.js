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

function handleProducts(
    userId,
    text,
    session,
    buildCategoriesMenu,
    buildProductsMenu
) {

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

            const cart =
    cartService.getCart(userId);

const lastItem =
    cart.items[cart.items.length - 1];


            sessionStorage.updateSession(
                userId,
                {
                    state:
                        "PRODUCT_ADDED",

                    data: {
                        categoryId:
                            session.data.categoryId
                    }
                }
            );

return (
    "✅━━━━━━━━━━━━✅\n\n" +

"🛒 *PRODUCTO AGREGADO*\n\n" +

`${lastItem.emoji} [${lastItem.categoryName}]\n` +
`${lastItem.name}\n` +
`💰 $${product.price.toLocaleString("es-CO")}\n\n` +

    "━━━━━━━━━━━━━━\n\n" +

    "¿Qué deseas hacer ahora?\n\n" +

    "1️⃣ 🛍️ Seguir comprando\n\n" +

    "2️⃣ 📋 Ver categorías\n\n" +

    "3️⃣ 🛒 Ver carrito\n\n" +

    "4️⃣ 🏠 Menú principal"
);

        }

        return (
            "🍔 Selecciona un producto válido."
        );

    }

    if (
        session.state ===
        "PRODUCT_ADDED"
    ) {

        if (
            text === "1"
        ) {

            sessionStorage.updateSession(
                userId,
                {
                    state:
                        "VIEWING_PRODUCTS"
                }
            );

            return buildProductsMenu(
                session.data.categoryId
            );

        }

        if (
            text === "2"
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
    text === "3"
) {

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

        if (
            text === "4"
        ) {

            sessionStorage.updateSession(
                userId,
                {
                    state:
                        "MAIN_MENU"
                }
            );

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

        return (
            "Selecciona una opción válida."
        );

    }

    return null;

}

module.exports = {
    handleProducts
};