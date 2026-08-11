const catalogService = require(
    "../../services/catalog/catalogService"
);

const sessionStorage = require(
    "../../storage/sessionStorage"
);

function handleCategories(
    userId,
    text,
    buildProductsMenu
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

module.exports = {
    handleCategories
};