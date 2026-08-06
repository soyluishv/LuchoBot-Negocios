/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: checkoutService.js
 * ==========================================
 */

const cartService = require(
    "../cart/cartService"
);

const {
    getBusiness
} = require(
    "../../config/businessConfig"
);

// ==========================================
// CHECKOUTS ACTIVOS
// ==========================================

const checkouts = new Map();

// ==========================================
// CREAR CHECKOUT
// ==========================================

function createCheckout(userId) {

    if (cartService.isEmpty(userId)) {

        return {
            ok: false,
            message: "El carrito está vacío."
        };

    }

    const checkout = {
        userId,
        deliveryType: null,
        deliveryPrice: 0,
        customer: {
            name: null,
            phone: null,
            address: null,
            neighborhood: null,
            notes: null
        },
        paymentMethod: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    checkouts.set(userId, checkout);

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// OBTENER CHECKOUT
// ==========================================

function getCheckout(userId) {

    return checkouts.get(userId) || null;

}

// ==========================================
// SELECCIONAR DOMICILIO
// ==========================================

function selectDelivery(userId) {

    const checkout = getCheckout(userId);
    const business = getBusiness();

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (!business.delivery.enabled) {

        return {
            ok: false,
            message: "El domicilio no está disponible."
        };

    }

    checkout.deliveryType = "delivery";
    checkout.deliveryPrice =
        business.delivery.fixedPrice;

    checkout.paymentMethod =
        "cash_on_delivery";

    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// SELECCIONAR RECOGIDA EN PUNTO
// ==========================================

function selectPickup(userId) {

    const checkout = getCheckout(userId);
    const business = getBusiness();

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (!business.pickup.enabled) {

        return {
            ok: false,
            message: "La recogida en punto no está disponible."
        };

    }

    checkout.deliveryType = "pickup";
    checkout.deliveryPrice = 0;

    checkout.paymentMethod =
        "pay_at_store";

    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// CALCULAR TOTAL
// ==========================================

function getTotal(userId) {

    const checkout = getCheckout(userId);

    if (!checkout) {

        return null;

    }

    const subtotal =
        cartService.getSubtotal(userId);

    return subtotal + checkout.deliveryPrice;

}

// ==========================================
// CANCELAR CHECKOUT
// ==========================================

function cancelCheckout(userId) {

    checkouts.delete(userId);

    return {
        ok: true
    };

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    createCheckout,
    getCheckout,
    selectDelivery,
    selectPickup,
    getTotal,
    cancelCheckout

};