/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba visual del resumen del pedido
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

const checkoutService = require(
    "./services/checkout/checkoutService"
);

const customerDataService = require(
    "./services/checkout/customerDataService"
);

const {
    formatOrderSummary
} = require(
    "./templates/orderSummaryTemplate"
);

// ==========================================
// CLIENTE DE PRUEBA
// ==========================================

const userId = "cliente-resumen";

// ==========================================
// LIMPIAR DATOS ANTERIORES
// ==========================================

cartService.clearCart(userId);

checkoutService.cancelCheckout(userId);

// ==========================================
// CREAR PEDIDO
// ==========================================

cartService.addProduct(
    userId,
    "HAM001",
    2
);

cartService.addProduct(
    userId,
    "ALA002",
    1
);

cartService.addProduct(
    userId,
    "BEB003",
    2
);

// ==========================================
// CREAR CHECKOUT
// ==========================================

checkoutService.createCheckout(userId);

checkoutService.selectDelivery(userId);

// ==========================================
// DATOS DEL CLIENTE
// ==========================================

customerDataService.setName(
    userId,
    "Juan Pérez"
);

customerDataService.setPhone(
    userId,
    "3001234567"
);

customerDataService.setAddress(
    userId,
    "Carrera 50 # 130 Sur 20"
);

customerDataService.setNeighborhood(
    userId,
    "La Playita"
);

customerDataService.setNotes(
    userId,
    "Casa de rejas negras"
);

// ==========================================
// OBTENER INFORMACIÓN
// ==========================================

const cart =
    cartService.getCart(userId);

const checkout =
    checkoutService.getCheckout(userId);

const subtotal =
    cartService.getSubtotal(userId);

const total =
    checkoutService.getTotal(userId);

// ==========================================
// MOSTRAR RESUMEN
// ==========================================

console.log(
    formatOrderSummary(
        cart,
        checkout,
        subtotal,
        total
    )
);

// ==========================================
// VALIDACIONES
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 VALIDACIONES");
console.log("======================================");

let errors = 0;

// 2 hamburguesas = $36.000
// 1 combo de 2 alas = $16.000
// 2 Coca-Cola = $8.000
// Subtotal = $60.000
// Domicilio = $3.000
// Total = $63.000

if (subtotal === 60000) {

    console.log(
        "✅ Subtotal correcto: $60.000"
    );

} else {

    console.log(
        `❌ Subtotal incorrecto: $${subtotal.toLocaleString("es-CO")}`
    );

    errors++;

}

if (total === 63000) {

    console.log(
        "✅ Total correcto: $63.000"
    );

} else {

    console.log(
        `❌ Total incorrecto: $${total.toLocaleString("es-CO")}`
    );

    errors++;

}

if (
    customerDataService
        .validateCustomerData(userId)
        .ok
) {

    console.log(
        "✅ Datos del cliente completos"
    );

} else {

    console.log(
        "❌ Datos del cliente incompletos"
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
        "✅ RESUMEN DEL PEDIDO VALIDADO CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ RESUMEN CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");