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

const cartService = require(
    "../../services/cart/cartService"
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

    const neighborhood =
        text.trim();

    if (
        neighborhood.length < 3 ||
        /^\d+$/.test(neighborhood)
    ) {

        return (
            "❌ Barrio inválido.\n\n" +
            "Ejemplo: Belén, Calasanz, Laureles, La Mota."
        );

    }

    customerDataService.setNeighborhood(
        userId,
        neighborhood
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

    sessionStorage.updateSession(
        userId,
        {
            state: "CONFIRM_ORDER"
        }
    );

    const customer =
        customerDataService.getCustomerData(
            userId
        );

    const cart =
        cartService.getCart(
            userId
        );

    const subtotal =
        cartService.getSubtotal(
            userId
        );

    let orderSummary =
        "🛒 Resumen del pedido\n\n";

    cart.items.forEach(
        item => {

            orderSummary +=
                `${item.quantity}x [${item.categoryName}] ${item.name}\n`;

        }
    );

    orderSummary += "\n";

    let notesText = "";

    if (
        customer.notes &&
        customer.notes !==
        "SIN OBSERVACIONES"
    ) {

        notesText =
            `📝 Observaciones: ${customer.notes}\n\n`;

    }

    return (
        "📋 *CONFIRMAR PEDIDO*\n\n" +

        `👤 Nombre: ${customer.name}\n` +
        `📱 Teléfono: ${customer.phone}\n` +
        `📍 Dirección: ${customer.address}\n` +
        `🏘️ Barrio: ${customer.neighborhood}\n\n` +

        "━━━━━━━━━━━━━━\n\n" +

        orderSummary +

        notesText +

        `💰 Subtotal: $${subtotal.toLocaleString("es-CO")}\n` +
        "🚚 Domicilio: $3.000\n\n" +
        `💵 TOTAL: $${(subtotal + 3000).toLocaleString("es-CO")}\n\n` +

        "━━━━━━━━━━━━━━\n\n" +

        "1️⃣ ✅ Confirmar pedido\n\n" +
        "2️⃣ ✏️ Modificar datos\n\n" +
        "0️⃣ ❌ Cancelar pedido"
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

    sessionStorage.updateSession(
        userId,
        {
            state: "CONFIRM_ORDER"
        }
    );

    const cart =
        cartService.getCart(userId);

    const subtotal =
        cartService.getSubtotal(userId);

    const customer =
        customerDataService.getCustomerData(
            userId
        );

    let orderSummary =
        "🛒 Resumen del pedido\n\n";

    cart.items.forEach(
        item => {

            orderSummary +=
                `${item.quantity}x [${item.categoryName}] ${item.name}\n`;

        }
    );

    orderSummary += "\n";

    let notesText = "";

    if (
        customer.notes &&
        customer.notes !==
        "SIN OBSERVACIONES"
    ) {

        notesText =
            `📝 Observaciones: ${customer.notes}\n\n`;

    }

    return (
        "📋 *CONFIRMAR PEDIDO*\n\n" +

        `👤 Nombre: ${customer.name}\n` +
        `📱 Teléfono: ${customer.phone}\n\n` +

        "━━━━━━━━━━━━━━\n\n" +

        orderSummary +

        notesText +

        `💰 TOTAL: $${subtotal.toLocaleString("es-CO")}\n\n` +

        "━━━━━━━━━━━━━━\n\n" +

        "1️⃣ ✅ Confirmar pedido\n\n" +
        "2️⃣ ✏️ Modificar datos\n\n" +
        "0️⃣ ❌ Cancelar pedido"
    );

}

// ======================================
// CONFIRMAR PEDIDO
// ======================================

if (
    session.state ===
    "CONFIRM_ORDER"
)

{

    if (text === "1") {

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

        let deliveryText = "";

        if (
            result.order.delivery &&
            result.order.delivery.type ===
            "delivery"
        ) {

            deliveryText =
                "🚚 Domicilio\n" +
                `📍 Dirección: ${result.order.customer.address}\n` +
                `🏘️ Barrio: ${result.order.customer.neighborhood}\n\n`;

        }
        else {

            deliveryText =
                "📍 Recoger en punto\n\n";

        }

        return (
            "✅ Pedido registrado correctamente\n\n" +

            `📦 Pedido #${result.order.orderNumber}\n\n` +

            `👤 Nombre: ${result.order.customer.name}\n` +
            `📱 Teléfono: ${result.order.customer.phone}\n\n` +

orderSummary +

(
    result.order.delivery &&
    result.order.delivery.type === "delivery"

        ? (
            `💰 Subtotal: $${result.order.subtotal.toLocaleString("es-CO")}\n` +
            `🚚 Domicilio: $${result.order.delivery.price.toLocaleString("es-CO")}\n\n` +
            `💵 TOTAL: $${result.order.total.toLocaleString("es-CO")}\n\n`
        )

        : (
            `💵 TOTAL: $${result.order.total.toLocaleString("es-CO")}\n\n`
        )
) +

notesText +

            deliveryText +

            (
                result.order.delivery &&
                result.order.delivery.type ===
                "delivery"
                    ? "Muy pronto uno de nuestros asesores te contactará."
                    : "Tu pedido quedará listo para recoger."
            )
        );

    }

    if (text === "2") {

        sessionStorage.updateSession(
            userId,
            {
                state: "ASK_NAME"
            }
        );

        return (
            "✏️ Modificación de datos\n\n" +
            "👤 Escribe nuevamente tu nombre:"
        );

    }

if (text === "0") {

    checkoutService.cancelCheckout(
        userId
    );

    cartService.clearCart(
        userId
    );

    sessionStorage.updateSession(
        userId,
        {
            state: "MAIN_MENU"
        }
    );

    return (
        "❌ Pedido cancelado.\n\n" +
        "🛒 El carrito fue vaciado correctamente."
    );

}

    return (
        "❌ Selecciona 1, 2 o 0."
    );

}

return null;

}

module.exports = {
    handleCheckout
};