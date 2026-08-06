/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: cartEditorService.js
 * ==========================================
 */

const cartService = require("./cartService");

// ==========================================
// OBTENER PRODUCTO POR POSICIÓN
// ==========================================

function getItemByPosition(userId, position) {

    const cart = cartService.getCart(userId);

    if (
        !Number.isInteger(position) ||
        position < 1 ||
        position > cart.items.length
    ) {

        return null;

    }

    return cart.items[position - 1];

}

// ==========================================
// CAMBIAR CANTIDAD POR POSICIÓN
// ==========================================

function setQuantityByPosition(
    userId,
    position,
    quantity
) {

    const item = getItemByPosition(
        userId,
        position
    );

    if (!item) {

        return {
            ok: false,
            message: "Producto inválido."
        };

    }

    return cartService.setQuantity(
        userId,
        item.productId,
        quantity
    );

}

// ==========================================
// ELIMINAR POR POSICIÓN
// ==========================================

function removeByPosition(
    userId,
    position
) {

    const item = getItemByPosition(
        userId,
        position
    );

    if (!item) {

        return {
            ok: false,
            message: "Producto inválido."
        };

    }

    return cartService.removeProduct(
        userId,
        item.productId
    );

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getItemByPosition,
    setQuantityByPosition,
    removeByPosition

};