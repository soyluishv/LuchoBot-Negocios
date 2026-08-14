/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: checkoutHandler.js
 * Módulo: Flujo de Compra
 *
 * Descripción:
 * Controla paso a paso el proceso
 * de checkout de un cliente.
 *
 * Responsabilidades:
 * - Tipo de entrega
 * - Captura de datos
 * - Validaciones
 * - Confirmación del pedido
 * - Cancelación del pedido
 * - Generación del resumen final
 *
 * Flujo:
 *
 * Menú
 *   ↓
 * Entrega
 *   ↓
 * Nombre
 *   ↓
 * Teléfono
 *   ↓
 * Dirección (si aplica)
 *   ↓
 * Barrio (si aplica)
 *   ↓
 * Observaciones
 *   ↓
 * Confirmación
 *   ↓
 * Pedido registrado
 *
 * Importante:
 * Este archivo NO guarda pedidos.
 *
 * Solo coordina el flujo de compra.
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL FLUJO DE CHECKOUT
//
// orderService
// Registro definitivo del pedido
//
// sessionStorage
// Control de estados de conversación
//
// customerDataService
// Datos del cliente
//
// checkoutService
// Configuración de entrega y pago
//
// cartService
// Productos seleccionados
//
// ==========================================

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

// ==========================================
// CONTROLADOR PRINCIPAL DE CHECKOUT
//
// Recibe:
//
// userId
// text
// session
//
// Evalúa el estado actual de compra
// y decide cuál será el siguiente paso
// de la conversación.
//
// ==========================================

function handleCheckout(
    userId,
    text,
    session
) {

// ==========================================
// PASO 1
// SELECCIÓN DEL TIPO DE ENTREGA
//
// Opciones:
//
// 1 = Domicilio
// 2 = Recoger en punto
//
// ==========================================

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

// ==========================================
// PASO 2
// CAPTURA DEL NOMBRE DEL CLIENTE
//
// Campo obligatorio.
//
// ==========================================

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
// ==========================================
// PASO 4
// CAPTURA DE DIRECCIÓN
//
// Solo aplica para pedidos
// a domicilio.
//
// ==========================================

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

// ==========================================
// PASO 3
// CAPTURA DEL TELÉFONO
//
// Validación:
//
// Debe iniciar en 3
// Debe tener 10 dígitos
//
// Ejemplo:
//
// 3046578264
//
// ==========================================

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

// ==========================================
// PASO 5
// CAPTURA DE BARRIO O SECTOR
//
// Solo aplica para domicilio.
//
// ==========================================

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

// ==========================================
// PASO 6
// OBSERVACIONES DEL PEDIDO
//
// Ejemplos:
//
// Sin cebolla
// Sin tomate
// Poco picante
//
// Si escribe:
//
// NO
//
// Se almacena:
//
// SIN OBSERVACIONES
//
// ==========================================

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

// ==========================================
// PASO 6
// OBSERVACIONES PARA RECOGIDA
//
// Flujo especial para clientes
// que recogerán el pedido
// directamente.
//
// ==========================================

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

// ==========================================
// PASO 7
// CONFIRMACIÓN FINAL DEL PEDIDO
//
// Opciones:
//
// 1 = Registrar pedido
// 2 = Modificar datos
// 0 = Cancelar compra
//
// ==========================================

if (
    session.state ===
    "CONFIRM_ORDER"
)

{

    if (text === "1") {

// ==========================================
// CREAR PEDIDO DEFINITIVO
//
// A partir de este punto:
//
// - Se guarda en orders.json
// - Se genera consecutivo
// - Se notifica al administrador
// - Se limpia el carrito
//
// ==========================================

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

// ==========================================
// GENERAR RESUMEN DE COMPRA
//
// Construye el detalle que verá
// el cliente en WhatsApp.
//
// ==========================================

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

// ==========================================
// GENERAR RESUMEN DE COMPRA
//
// Construye el detalle que verá
// el cliente en WhatsApp.
//
// ==========================================

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

// ==========================================
// CANCELAR COMPRA
//
// Acciones:
//
// - Cancelar checkout
// - Vaciar carrito
// - Regresar al menú principal
//
// ==========================================

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

// ==========================================
// API PÚBLICA DEL CHECKOUT
//
// Punto de entrada utilizado por
// el sistema de mensajes de WhatsApp.
//
// ==========================================

module.exports = {
    handleCheckout
};