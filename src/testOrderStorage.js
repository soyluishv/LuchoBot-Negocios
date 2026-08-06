/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba de persistencia de pedidos
 * ==========================================
 */

const orderStorage = require(
    "./storage/orderStorage"
);

// ==========================================
// CREAR PRIMER PEDIDO DE PRUEBA
// ==========================================

console.log("======================================");
console.log("💾 PRUEBA DE PERSISTENCIA");
console.log("======================================");

const orderNumber =
    orderStorage.getNextOrderNumber();

const testOrder = {

    orderNumber,

    userId: "cliente-persistencia",

    status: "confirmed",

    items: [
        {
            productId: "HAM001",
            name: "Hamburguesa Estándar",
            unitPrice: 18000,
            quantity: 2,
            total: 36000
        }
    ],

    subtotal: 36000,

    delivery: {
        type: "delivery",
        price: 3000
    },

    customer: {
        name: "Cliente Prueba",
        phone: "3001234567",
        address: "Dirección de prueba",
        neighborhood: "La Playita",
        notes: ""
    },

    paymentMethod: "cash_on_delivery",

    total: 39000,

    createdAt: Date.now()

};

// ==========================================
// GUARDAR
// ==========================================

orderStorage.saveOrder(testOrder);

console.log(
    `✅ Pedido #${orderNumber} guardado`
);

// ==========================================
// VOLVER A LEER
// ==========================================

const savedOrder =
    orderStorage.findOrder(orderNumber);

if (savedOrder) {

    console.log(
        `✅ Pedido #${orderNumber} recuperado`
    );

} else {

    console.log(
        "❌ No se pudo recuperar el pedido"
    );

}

// ==========================================
// VALIDACIONES
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

if (
    savedOrder &&
    savedOrder.total === 39000
) {

    console.log(
        "✅ Total persistido correctamente: $39.000"
    );

} else {

    console.log(
        "❌ Error persistiendo el total"
    );

    errors++;

}

if (
    savedOrder &&
    savedOrder.customer.name ===
        "Cliente Prueba"
) {

    console.log(
        "✅ Datos del cliente persistidos"
    );

} else {

    console.log(
        "❌ Error persistiendo datos del cliente"
    );

    errors++;

}

const allOrders =
    orderStorage.getAllOrders();

if (
    allOrders.some(
        order =>
            order.orderNumber === orderNumber
    )
) {

    console.log(
        "✅ Pedido encontrado en el historial"
    );

} else {

    console.log(
        "❌ Pedido no encontrado en el historial"
    );

    errors++;

}

// ==========================================
// RESULTADO
// ==========================================

console.log("");
console.log("======================================");

if (errors === 0) {

    console.log(
        "✅ PERSISTENCIA VALIDADA CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ PERSISTENCIA CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");