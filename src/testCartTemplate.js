/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba visual del carrito
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

const {
    formatCart
} = require(
    "./templates/cartTemplate"
);

const userId = "cliente-visual";

// ==========================================
// PREPARAR CARRITO
// ==========================================

cartService.clearCart(userId);

cartService.addProduct(
    userId,
    "HAM001",
    2
);

cartService.addProduct(
    userId,
    "BEB003",
    2
);

cartService.addProduct(
    userId,
    "ADI001",
    1
);

// ==========================================
// MOSTRAR CARRITO
// ==========================================

const cart =
    cartService.getCart(userId);

const subtotal =
    cartService.getSubtotal(userId);

console.log(
    formatCart(cart, subtotal)
);