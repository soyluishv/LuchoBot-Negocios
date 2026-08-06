/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba del sistema de carrito
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

// ==========================================
// CLIENTES DE PRUEBA
// ==========================================

const clienteA = "cliente-a";
const clienteB = "cliente-b";

// ==========================================
// LIMPIAR PRUEBAS ANTERIORES
// ==========================================

cartService.clearCart(clienteA);
cartService.clearCart(clienteB);

// ==========================================
// CLIENTE A
// ==========================================

console.log("======================================");
console.log("🛒 CLIENTE A");
console.log("======================================");

cartService.addProduct(
    clienteA,
    "HAM001",
    2
);

cartService.addProduct(
    clienteA,
    "BEB003",
    1
);

console.log(
    cartService.getCart(clienteA)
);

console.log(
    `Unidades: ${cartService.getItemCount(clienteA)}`
);

console.log(
    `Subtotal: $${cartService
        .getSubtotal(clienteA)
        .toLocaleString("es-CO")}`
);

// ==========================================
// CLIENTE B
// ==========================================

console.log("");
console.log("======================================");
console.log("🛒 CLIENTE B");
console.log("======================================");

cartService.addProduct(
    clienteB,
    "PER003",
    1
);

cartService.addProduct(
    clienteB,
    "ALA002",
    2
);

console.log(
    cartService.getCart(clienteB)
);

console.log(
    `Unidades: ${cartService.getItemCount(clienteB)}`
);

console.log(
    `Subtotal: $${cartService
        .getSubtotal(clienteB)
        .toLocaleString("es-CO")}`
);

// ==========================================
// MODIFICAR CLIENTE A
// ==========================================

console.log("");
console.log("======================================");
console.log("✏️ MODIFICANDO CLIENTE A");
console.log("======================================");

cartService.setQuantity(
    clienteA,
    "HAM001",
    1
);

cartService.removeProduct(
    clienteA,
    "BEB003"
);

console.log(
    cartService.getCart(clienteA)
);

console.log(
    `Unidades finales: ${cartService.getItemCount(clienteA)}`
);

console.log(
    `Subtotal final: $${cartService
        .getSubtotal(clienteA)
        .toLocaleString("es-CO")}`
);

// ==========================================
// COMPROBACIONES AUTOMÁTICAS
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

// Cliente A:
// 1 Hamburguesa estándar = $18.000

if (cartService.getSubtotal(clienteA) !== 18000) {

    console.log(
        "❌ Subtotal incorrecto para Cliente A"
    );

    errors++;

} else {

    console.log(
        "✅ Subtotal Cliente A correcto: $18.000"
    );

}

// Cliente B:
// 1 Perra = $19.000
// 2 combos de 2 alas = $32.000
// Total = $51.000

if (cartService.getSubtotal(clienteB) !== 51000) {

    console.log(
        "❌ Subtotal incorrecto para Cliente B"
    );

    errors++;

} else {

    console.log(
        "✅ Subtotal Cliente B correcto: $51.000"
    );

}

// Verificar independencia

if (
    cartService.getItemCount(clienteA) === 1 &&
    cartService.getItemCount(clienteB) === 3
) {

    console.log(
        "✅ Los carritos son independientes"
    );

} else {

    console.log(
        "❌ Error de independencia entre carritos"
    );

    errors++;

}

// ==========================================
// RESULTADO FINAL
// ==========================================

console.log("");
console.log("======================================");

if (errors === 0) {

    console.log("✅ CARRITO VALIDADO CORRECTAMENTE");

} else {

    console.log(
        `❌ CARRITO CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");