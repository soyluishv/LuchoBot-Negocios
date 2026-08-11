/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: cartService.js
 * ==========================================
 */

const catalogService = require(
    "../catalog/catalogService"
);

// ==========================================
// CARRITOS ACTIVOS
// ==========================================

const carts = new Map();

// ==========================================
// CREAR / OBTENER CARRITO
// ==========================================

function getCart(userId) {

    if (!carts.has(userId)) {

        carts.set(userId, {
            userId,
            items: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

    }

    return carts.get(userId);

}

// ==========================================
// AGREGAR PRODUCTO
// ==========================================

function addProduct(userId, productId, quantity = 1) {

    const product =
        catalogService.getProductById(productId);

    if (!product || !product.enabled) {

        return {
            ok: false,
            message: "Producto no disponible."
        };

    }

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        return {
            ok: false,
            message: "Cantidad inválida."
        };

    }

    const cart = getCart(userId);

    const existingItem = cart.items.find(
        item => item.productId === productId
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

const category =
    catalogService.getCategoryById(
        product.categoryId
    );

if (existingItem) {

    existingItem.quantity += quantity;

} else {

    cart.items.push({
        productId: product.id,
        categoryId: product.categoryId,
        categoryName: category?.name || "",
        emoji: category?.emoji || "🍔",
        name: product.name,
        unitPrice: product.price,
        quantity
    });

}

}

    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// CAMBIAR CANTIDAD
// ==========================================

function setQuantity(userId, productId, quantity) {

    const cart = getCart(userId);

    const item = cart.items.find(
        currentItem =>
            currentItem.productId === productId
    );

    if (!item) {

        return {
            ok: false,
            message: "El producto no está en el carrito."
        };

    }

    if (
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        return {
            ok: false,
            message: "Cantidad inválida."
        };

    }

    if (quantity === 0) {

        return removeProduct(
            userId,
            productId
        );

    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// ELIMINAR PRODUCTO
// ==========================================

function removeProduct(userId, productId) {

    const cart = getCart(userId);

    const index = cart.items.findIndex(
        item => item.productId === productId
    );

    if (index === -1) {

        return {
            ok: false,
            message: "El producto no está en el carrito."
        };

    }

    cart.items.splice(index, 1);
    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// CALCULAR SUBTOTAL
// ==========================================

function getSubtotal(userId) {

    const cart = getCart(userId);

    return cart.items.reduce(
        (total, item) =>
            total +
            (item.unitPrice * item.quantity),
        0
    );

}

// ==========================================
// TOTAL DE UNIDADES
// ==========================================

function getItemCount(userId) {

    const cart = getCart(userId);

    return cart.items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}

// ==========================================
// ¿CARRITO VACÍO?
// ==========================================

function isEmpty(userId) {

    return getCart(userId).items.length === 0;

}

// ==========================================
// VACIAR CARRITO
// ==========================================

function clearCart(userId) {

    carts.delete(userId);

    return {
        ok: true
    };

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getCart,
    addProduct,
    setQuantity,
    removeProduct,
    getSubtotal,
    getItemCount,
    isEmpty,
    clearCart

};