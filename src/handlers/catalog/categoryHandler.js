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
            "🍔 Menú principal\n\n" +
            "1️⃣ Ver menú\n" +
            "2️⃣ Ver carrito\n" +
            "3️⃣ Finalizar pedido\n\n" +
            "0️⃣ Cancelar"
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