/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba del sistema de checkout
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

const checkoutService = require(
    "./services/checkout/checkoutService"
);

// ==========================================
// USUARIOS DE PRUEBA
// ==========================================

const clienteDomicilio = "cliente-domicilio";
const clienteRecoge = "cliente-recoge";

// ==========================================
// LIMPIAR PRUEBAS ANTERIORES
// ==========================================

cartService.clearCart(clienteDomicilio);
cartService.clearCart(clienteRecoge);

checkoutService.cancelCheckout(clienteDomicilio);
checkoutService.cancelCheckout(clienteRecoge);

// ==========================================
// CREAR CARRITOS
// ==========================================

// Cliente domicilio:
// 2 Hamburguesas estándar = $36.000
// 1 Coca-Cola 350 ml = $4.000
// Subtotal = $40.000

cartService.addProduct(
    clienteDomicilio,
    "HAM001",
    2
);

cartService.addProduct(
    clienteDomicilio,
    "BEB003",
    1
);

// Cliente recoge:
// 1 Perra = $19.000
// 1 Combo 2 alas = $16.000
// Subtotal = $35.000

cartService.addProduct(
    clienteRecoge,
    "PER003",
    1
);

cartService.addProduct(
    clienteRecoge,
    "ALA002",
    1
);

// ==========================================
// CHECKOUT DOMICILIO
// ==========================================

console.log("======================================");
console.log("🛵 CLIENTE CON DOMICILIO");
console.log("======================================");

checkoutService.createCheckout(
    clienteDomicilio
);

checkoutService.selectDelivery(
    clienteDomicilio
);

const checkoutDomicilio =
    checkoutService.getCheckout(
        clienteDomicilio
    );

console.log(
    `Subtotal: $${cartService
        .getSubtotal(clienteDomicilio)
        .toLocaleString("es-CO")}`
);

console.log(
    `Domicilio: $${checkoutDomicilio
        .deliveryPrice
        .toLocaleString("es-CO")}`
);

console.log(
    `Total: $${checkoutService
        .getTotal(clienteDomicilio)
        .toLocaleString("es-CO")}`
);

console.log(
    `Pago: ${checkoutDomicilio.paymentMethod}`
);

// ==========================================
// CHECKOUT RECOGIDA
// ==========================================

console.log("");
console.log("======================================");
console.log("🏪 CLIENTE RECOGE EN EL PUNTO");
console.log("======================================");

checkoutService.createCheckout(
    clienteRecoge
);

checkoutService.selectPickup(
    clienteRecoge
);

const checkoutRecoge =
    checkoutService.getCheckout(
        clienteRecoge
    );

console.log(
    `Subtotal: $${cartService
        .getSubtotal(clienteRecoge)
        .toLocaleString("es-CO")}`
);

console.log(
    `Recogida: $${checkoutRecoge
        .deliveryPrice
        .toLocaleString("es-CO")}`
);

console.log(
    `Total: $${checkoutService
        .getTotal(clienteRecoge)
        .toLocaleString("es-CO")}`
);

console.log(
    `Pago: ${checkoutRecoge.paymentMethod}`
);

// ==========================================
// VALIDACIONES AUTOMÁTICAS
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

// Domicilio:
// $40.000 + $3.000 = $43.000

if (
    checkoutService.getTotal(
        clienteDomicilio
    ) === 43000
) {

    console.log(
        "✅ Total domicilio correcto: $43.000"
    );

} else {

    console.log(
        "❌ Total domicilio incorrecto"
    );

    errors++;

}

// Recogida:
// $35.000 + $0 = $35.000

if (
    checkoutService.getTotal(
        clienteRecoge
    ) === 35000
) {

    console.log(
        "✅ Total recogida correcto: $35.000"
    );

} else {

    console.log(
        "❌ Total recogida incorrecto"
    );

    errors++;

}

// Verificar métodos de pago

if (
    checkoutDomicilio.paymentMethod ===
    "cash_on_delivery"
) {

    console.log(
        "✅ Pago contraentrega correcto"
    );

} else {

    console.log(
        "❌ Método de pago domicilio incorrecto"
    );

    errors++;

}

if (
    checkoutRecoge.paymentMethod ===
    "pay_at_store"
) {

    console.log(
        "✅ Pago en punto correcto"
    );

} else {

    console.log(
        "❌ Método de pago recogida incorrecto"
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
        "✅ CHECKOUT VALIDADO CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ CHECKOUT CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");