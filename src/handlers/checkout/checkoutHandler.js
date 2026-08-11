const orderService = require(
    "../../services/order/orderService"
);
const sessionStorage = require(
    "../../storage/sessionStorage"
);

const customerDataService = require(
    "../../services/checkout/customerDataService"
);

const checkoutService = require(
    "../../services/checkout/checkoutService"
);

function handleCheckout(
    userId,
    text,
    session
) {

    // ======================================
    // SELECCIONAR ENTREGA
    // ======================================

    if (
        session.state ===
        "SELECTING_DELIVERY"
    ) {

        if (
            text === "1"
        ) {

            checkoutService.createCheckout(
                userId
            );

            checkoutService.selectDelivery(
                userId
            );

            sessionStorage.updateSession(
                userId,
                {
                    state: "ASK_NAME"
                }
            );

            return (
                "👤 Escribe tu nombre:"
            );

        }

        if (
            text === "2"
        ) {

            checkoutService.createCheckout(
                userId
            );

            checkoutService.selectPickup(
                userId
            );

            sessionStorage.updateSession(
                userId,
                {
                    state: "ASK_NAME"
                }
            );

            return (
                "👤 Escribe tu nombre:"
            );

        }

        return (
            "Selecciona 1 o 2."
        );

    }

    // ======================================
    // PEDIR NOMBRE
    // ======================================

    if (
        session.state ===
        "ASK_NAME"
    ) {

        customerDataService.setName(
            userId,
            text
        );

        sessionStorage.updateSession(
            userId,
            {
                state: "ASK_PHONE"
            }
        );

        return (
            "📱 Escribe tu teléfono:"
        );

    }
// ======================================
// PEDIR DIRECCIÓN
// ======================================

if (
    session.state ===
    "ASK_ADDRESS"
) {

    customerDataService.setAddress(
        userId,
        text
    );

    sessionStorage.updateSession(
        userId,
        {
            state: "ASK_NEIGHBORHOOD"
        }
    );

    return (
        "🏘️ Escribe tu barrio:"
    );

}

// ======================================
// PEDIR TELÉFONO
// ======================================

if (
    session.state ===
    "ASK_PHONE"
) {

    const phone =
        text.trim();

    if (
        !/^3\d{9}$/.test(phone)
    ) {

        return (
            "❌ Número de celular inválido.\n\n" +
            "Debe comenzar por 3 y tener exactamente 10 dígitos.\n\n" +
            "Ejemplo: 3046578264"
        );

    }

    customerDataService.setPhone(
        userId,
        phone
    );

    const checkout =
        checkoutService.getCheckout(
            userId
        );

    if (
        checkout &&
        checkout.deliveryType ===
        "pickup"
    ) {

        customerDataService.setAddress(
            userId,
            "RECOGE EN PUNTO"
        );

        customerDataService.setNeighborhood(
            userId,
            "RECOGE EN PUNTO"
        );

        sessionStorage.updateSession(
            userId,
            {
                state: "ASK_NOTES_PICKUP"
            }
        );

        return (
            "📝 Observaciones del pedido (o escribe NO):"
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state: "ASK_ADDRESS"
        }
    );

    return (
        "📍 Escribe tu dirección:"
    );

}

    // ======================================
    // PEDIR BARRIO
    // ======================================

if (
    session.state ===
    "ASK_NEIGHBORHOOD"
) {

    customerDataService.setNeighborhood(
        userId,
        text
    );

    sessionStorage.updateSession(
        userId,
        {
            state: "ASK_NOTES"
        }
    );

    return (
        "📝 Observaciones del pedido (o escribe NO):"
    );

}

// ======================================
// PEDIR OBSERVACIONES
// ======================================

if (
    session.state ===
    "ASK_NOTES"
) {

    customerDataService.setNotes(
        userId,
        text.toUpperCase() === "NO"
            ? "SIN OBSERVACIONES"
            : text
    );

    const result =
        orderService.confirmOrder(
            userId
        );

    if (!result.ok) {

        return (
            "❌ Error al registrar el pedido.\n\n" +
            result.message
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state: "MAIN_MENU"
        }
    );

    let orderSummary =
        "🛒 Resumen del pedido\n\n";

    result.order.items.forEach(
        item => {

            orderSummary +=
                `${item.quantity}x [${item.categoryName}] ${item.name}\n`;

        }
    );

    orderSummary += "\n";

    let notesText = "";

    if (
        result.order.customer &&
        result.order.customer.notes &&
        result.order.customer.notes !==
        "SIN OBSERVACIONES"
    ) {

        notesText =
            `📝 Observaciones: ${result.order.customer.notes}\n\n`;

    }

    return (
        "✅ Pedido registrado correctamente\n\n" +
        `📦 Pedido #${result.order.orderNumber}\n\n` +
        orderSummary +
        `💰 Total: $${result.order.total.toLocaleString("es-CO")}\n\n` +
        notesText +
        "🚚 Domicilio\n\n" +
        "Muy pronto uno de nuestros asesores te contactará."
    );

}

// ======================================
// OBSERVACIONES RECOGER EN PUNTO
// ======================================


if (
    session.state ===
    "ASK_NOTES_PICKUP"
) {

customerDataService.setNotes(
    userId,
    text.trim().toUpperCase() === "NO"
        ? "SIN OBSERVACIONES"
        : text
);
    const result =
        orderService.confirmOrder(
            userId
        );

    if (!result.ok) {

        return (
            "❌ Error al registrar el pedido.\n\n" +
            result.message
        );

    }

    sessionStorage.updateSession(
        userId,
        {
            state: "MAIN_MENU"
        }
    );

    let orderSummary =
        "🛒 Resumen del pedido\n\n";

    result.order.items.forEach(
        item => {

            orderSummary +=
                `${item.quantity}x [${item.categoryName}] ${item.name}\n`;

        }
    );

    orderSummary += "\n";

let notesText = "";

if (
    result.order.customer &&
    result.order.customer.notes &&
    result.order.customer.notes !==
    "SIN OBSERVACIONES"
) {

    notesText =
        `📝 Observaciones: ${result.order.customer.notes}\n\n`;

}

return (
    "✅ Pedido registrado correctamente\n\n" +
    `📦 Pedido #${result.order.orderNumber}\n\n` +
    orderSummary +
    `💰 Total: $${result.order.total.toLocaleString("es-CO")}\n\n` +
    notesText +
    "📍 Recoger en punto\n\n" +
    "Tu pedido quedará listo para recoger."
);

}

return null;

}

module.exports = {
    handleCheckout
};