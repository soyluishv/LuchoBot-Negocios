/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba del editor del carrito
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

const cartEditorService = require(
    "./services/cart/cartEditorService"
);

const {
    formatCart
} = require(
    "./templates/cartTemplate"
);

// ==========================================
// CLIENTE DE PRUEBA
// ==========================================

const userId = "cliente-editor";

cartService.clearCart(userId);

// ==========================================
// CREAR CARRITO INICIAL
// ==========================================

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
// MOSTRAR CARRITO INICIAL
// ==========================================

console.log("======================================");
console.log("🛒 CARRITO INICIAL");
console.log("======================================");

console.log(
    formatCart(
        cartService.getCart(userId),
        cartService.getSubtotal(userId)
    )
);

// ==========================================
// ELIMINAR PRODUCTO #3
// ==========================================

console.log("");
console.log("======================================");
console.log("🗑️ ELIMINANDO PRODUCTO #3");
console.log("======================================");

const removed =
    cartEditorService.removeByPosition(
        userId,
        3
    );

if (removed.ok) {

    console.log("✅ Producto #3 eliminado.");

} else {

    console.log(`❌ ${removed.message}`);

}

// ==========================================
// CAMBIAR PRODUCTO #1 A 3 UNIDADES
// ==========================================

console.log("");
console.log("======================================");
console.log("🔢 CAMBIANDO PRODUCTO #1 A 3 UNIDADES");
console.log("======================================");

const updated =
    cartEditorService.setQuantityByPosition(
        userId,
        1,
        3
    );

if (updated.ok) {

    console.log("✅ Cantidad actualizada.");

} else {

    console.log(`❌ ${updated.message}`);

}

// ==========================================
// MOSTRAR CARRITO FINAL
// ==========================================

console.log("");
console.log("======================================");
console.log("🛒 CARRITO FINAL");
console.log("======================================");

console.log(
    formatCart(
        cartService.getCart(userId),
        cartService.getSubtotal(userId)
    )
);

// ==========================================
// VALIDACIONES
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

// 3 hamburguesas = $54.000
// 2 Coca-Cola = $8.000
// Total = $62.000

if (
    cartService.getSubtotal(userId) === 62000
) {

    console.log(
        "✅ Subtotal actualizado correctamente: $62.000"
    );

} else {

    console.log(
        "❌ El subtotal actualizado es incorrecto"
    );

    errors++;

}

if (
    cartService.getItemCount(userId) === 5
) {

    console.log(
        "✅ Cantidades actualizadas correctamente"
    );

} else {

    console.log(
        "❌ Error en las cantidades"
    );

    errors++;

}

const deletedItem =
    cartService
        .getCart(userId)
        .items
        .find(
            item => item.productId === "ADI001"
        );

if (!deletedItem) {

    console.log(
        "✅ Tocineta eliminada correctamente"
    );

} else {

    console.log(
        "❌ La Tocineta todavía está en el carrito"
    );

    errors++;

}

// ==========================================
// RESULTADO FINAL
// ==========================================

console.log("");
console.log("======================================");

if (errors === 0) {

    console.log(
        "✅ EDITOR DEL CARRITO VALIDADO CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ EDITOR CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");