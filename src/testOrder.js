/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba del sistema de pedidos
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

const orderService = require(
    "./services/order/orderService"
);

// ==========================================
// CLIENTE DE PRUEBA
// ==========================================

const userId = "cliente-pedido";

// ==========================================
// LIMPIAR DATOS TEMPORALES
// ==========================================

cartService.clearCart(userId);
checkoutService.cancelCheckout(userId);

// ==========================================
// CREAR CARRITO
// ==========================================

// 2 Hamburguesas = $36.000
// 1 Combo 2 alas = $16.000
// 2 Coca-Cola = $8.000
//
// Subtotal = $60.000

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
// CONFIRMAR PEDIDO
// ==========================================

console.log("======================================");
console.log("🧾 CONFIRMANDO PEDIDO");
console.log("======================================");

const result =
    orderService.confirmOrder(userId);

if (!result.ok) {

    console.log(
        `❌ No se pudo confirmar: ${result.message}`
    );

    process.exit(1);

}

const order = result.order;

// ==========================================
// MOSTRAR PEDIDO
// ==========================================

console.log(
    `Pedido: #${order.orderNumber}`
);

console.log(
    `Estado: ${order.status}`
);

console.log(
    `Cliente: ${order.customer.name}`
);

console.log("");

console.log("PRODUCTOS:");

for (const item of order.items) {

    console.log(
        `${item.quantity}x ${item.name} - ` +
        `$${item.total.toLocaleString("es-CO")}`
    );

}

console.log("");

console.log(
    `Subtotal: $${order.subtotal.toLocaleString("es-CO")}`
);

console.log(
    `Domicilio: $${order.delivery.price.toLocaleString("es-CO")}`
);

console.log(
    `TOTAL: $${order.total.toLocaleString("es-CO")}`
);

// ==========================================
// VALIDACIONES AUTOMÁTICAS
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

// ------------------------------------------
// NÚMERO DE PEDIDO
// ------------------------------------------

if (order.orderNumber === "0001") {

    console.log(
        "✅ Número de pedido correcto: #0001"
    );

} else {

    console.log(
        `❌ Número inesperado: #${order.orderNumber}`
    );

    errors++;

}

// ------------------------------------------
// TOTAL
// ------------------------------------------

if (order.total === 63000) {

    console.log(
        "✅ Total conservado correctamente: $63.000"
    );

} else {

    console.log(
        "❌ Total incorrecto"
    );

    errors++;

}

// ------------------------------------------
// PRODUCTOS
// ------------------------------------------

if (
    order.items.length === 3 &&
    order.items[0].unitPrice === 18000
) {

    console.log(
        "✅ Productos y precios conservados"
    );

} else {

    console.log(
        "❌ Error conservando productos"
    );

    errors++;

}

// ------------------------------------------
// DATOS DEL CLIENTE
// ------------------------------------------

if (
    order.customer.name === "Juan Pérez" &&
    order.customer.neighborhood === "La Playita"
) {

    console.log(
        "✅ Datos del cliente conservados"
    );

} else {

    console.log(
        "❌ Datos del cliente incorrectos"
    );

    errors++;

}

// ------------------------------------------
// CARRITO DEBE QUEDAR VACÍO
// ------------------------------------------

if (cartService.isEmpty(userId)) {

    console.log(
        "✅ Carrito limpiado después de confirmar"
    );

} else {

    console.log(
        "❌ El carrito no fue limpiado"
    );

    errors++;

}

// ------------------------------------------
// CHECKOUT DEBE DESAPARECER
// ------------------------------------------

if (
    checkoutService.getCheckout(userId) === null
) {

    console.log(
        "✅ Checkout temporal eliminado"
    );

} else {

    console.log(
        "❌ El checkout todavía existe"
    );

    errors++;

}

// ------------------------------------------
// PEDIDO DEBE SEGUIR EXISTIENDO
// ------------------------------------------

const savedOrder =
    orderService.getOrder(
        order.orderNumber
    );

if (
    savedOrder &&
    savedOrder.total === 63000
) {

    console.log(
        "✅ Pedido confirmado permanece almacenado"
    );

} else {

    console.log(
        "❌ El pedido confirmado no fue almacenado"
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
        "✅ SISTEMA DE PEDIDOS VALIDADO CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ SISTEMA DE PEDIDOS CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");