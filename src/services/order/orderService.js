/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: orderService.js
 * ==========================================
 */

const cartService = require(
    "../cart/cartService"
);

const checkoutService = require(
    "../checkout/checkoutService"
);

const customerDataService = require(
    "../checkout/customerDataService"
);

const orderStorage = require(
    "../../storage/orderStorage"
);

// ==========================================
// GENERAR NÚMERO DE PEDIDO
// ==========================================

function generateOrderNumber() {

    return orderStorage.getNextOrderNumber();

}

// ==========================================
// CONFIRMAR PEDIDO
// ==========================================

function confirmOrder(userId) {

    const cart =
        cartService.getCart(userId);

    const checkout =
        checkoutService.getCheckout(userId);

    // ======================================
    // VALIDACIONES
    // ======================================

    if (!cart || cart.items.length === 0) {

        return {
            ok: false,
            message: "El carrito está vacío."
        };

    }

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (!checkout.deliveryType) {

        return {
            ok: false,
            message: "Falta seleccionar el tipo de entrega."
        };

    }

    const customerValidation =
        customerDataService.validateCustomerData(
            userId
        );

    if (!customerValidation.ok) {

        return {
            ok: false,
            message: customerValidation.message,
            field: customerValidation.field
        };

    }

    // ======================================
    // TOTALES
    // ======================================

    const subtotal =
        cartService.getSubtotal(userId);

    const total =
        checkoutService.getTotal(userId);

    // ======================================
    // CREAR SNAPSHOT DEL PEDIDO
    // ======================================

    const order = {

        orderNumber: generateOrderNumber(),

        userId,

        status: "confirmed",

        items: cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            total:
                item.unitPrice * item.quantity
        })),

        subtotal,

        delivery: {
            type: checkout.deliveryType,
            price: checkout.deliveryPrice
        },

        customer: {
            ...checkout.customer
        },

        paymentMethod:
            checkout.paymentMethod,

        total,

        createdAt: Date.now()
    };

    // ======================================
    // GUARDAR PEDIDO
    // ======================================

    orderStorage.saveOrder(
    order
);

    // ======================================
    // LIMPIAR PROCESO TEMPORAL
    // ======================================

    cartService.clearCart(userId);

    checkoutService.cancelCheckout(userId);

    return {
        ok: true,
        order
    };

}

// ==========================================
// OBTENER PEDIDO
// ==========================================

function getOrder(orderNumber) {

    return orderStorage.findOrder(
        orderNumber
    );

}

// ==========================================
// OBTENER TODOS LOS PEDIDOS
// ==========================================

function getOrders() {

    return orderStorage.getAllOrders();

}

// ==========================================
// PEDIDOS DE UN CLIENTE
// ==========================================

function getOrdersByUser(userId) {

    return getOrders().filter(
        order => order.userId === userId
    );

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    confirmOrder,
    getOrder,
    getOrders,
    getOrdersByUser

};