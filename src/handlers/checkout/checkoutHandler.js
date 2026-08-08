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

    customerDataService.setPhone(
        userId,
        text
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

        customerDataService.setNotes(
            userId,
            "SIN OBSERVACIONES"
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
                            `${item.quantity}x ${item.name}\n`;

                        }
                    );

                    orderSummary += "\n";

                        return (
                        "✅ Pedido registrado correctamente\n\n" +
                        `📦 Pedido #${result.order.orderNumber}\n\n` +
                            orderSummary +
                        `💰 Total: $${result.order.total.toLocaleString("es-CO")}\n\n` +
                        "📍 Recoger en punto\n\n" +
                        "Tu pedido quedará listo para recoger."
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
        text
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
            `${item.quantity}x ${item.name}\n`;

    }
);

orderSummary += "\n";

        return (
            "✅ Pedido registrado correctamente\n\n" +
            `📦 Pedido #${result.order.orderNumber}\n\n` +
            orderSummary +
            `💰 Total: $${result.order.total.toLocaleString("es-CO")}\n\n` +
            "🚚 Domicilio\n\n" +
            "Muy pronto uno de nuestros asesores te contactará."
        );

}

return null;

}

module.exports = {
    handleCheckout
};