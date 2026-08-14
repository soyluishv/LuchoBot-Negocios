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

    if (
        text === "9"
    ) {

        if (
            global.whatsappClient
        ) {

            global.whatsappClient.sendFile(
                userId,
                "./media/carta.pdf",
                "Carta-Rapi-Crocks.pdf",
                "📖 Carta Oficial Rapi Crock's\n\n😋 Revisa nuestros productos, fotos y promociones."
            );

        }

return (
    "📖 Carta Oficial enviada correctamente.\n\n" +

    "🔥 Ya viste nuestros productos, promociones y fotografías.\n\n" +

    "📋 *MENÚ PRINCIPAL*\n\n" +

    "1️⃣ 🍢 Chuzo de Pollo\n\n" +
    "2️⃣ 🌭 Perros y Perras\n\n" +
    "3️⃣ 🫓 Arepaburguer\n\n" +
    "4️⃣ 🍗 Combos de Alas\n\n" +
    "5️⃣ 🍟 Salchipapas\n\n" +
    "6️⃣ 🍔 Hamburguesas\n\n" +
    "7️⃣ ➕ Adiciones\n\n" +
    "8️⃣ 🥤 Bebidas\n\n" +
    "9️⃣ 📖 Ver Carta Oficial\n\n" +

    "━━━━━━━━━━━━━━\n\n" +

    "0️⃣ 🔙 Volver\n\n" +

    "🛒 Tu pedido se agregará automáticamente al carrito.\n\n" +

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