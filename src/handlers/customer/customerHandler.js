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

        return (
            "📋 Selecciona una categoría válida."
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