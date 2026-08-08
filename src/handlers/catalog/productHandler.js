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
                "✅ Producto agregado al carrito\n\n" +
                `🍔 ${product.name}\n` +
                `💰 $${product.price.toLocaleString("es-CO")}\n\n` +
                "¿Qué deseas hacer ahora?\n\n" +
                "1️⃣ Seguir comprando en esta categoría\n" +
                "2️⃣ Ver otras categorías\n" +
                "3️⃣ Ver carrito\n" +
                "4️⃣ Menú principal"
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
                "🍔 Menú principal\n\n" +
                "1️⃣ Ver menú\n" +
                "2️⃣ Ver carrito\n" +
                "3️⃣ Finalizar pedido\n\n" +
                "0️⃣ Cancelar"
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