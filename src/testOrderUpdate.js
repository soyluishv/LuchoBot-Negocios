const updateService = require(
    "./services/order/orderUpdateService"
);

const {
    STATUS
} = require(
    "./services/order/orderStatus"
);

console.log("======================================");
console.log("📦 ACTUALIZANDO PEDIDO");
console.log("======================================");

const order = updateService.updateOrderStatus(

    "0001",

    STATUS.PREPARING

);

if (!order) {

    console.log(
        "❌ Pedido no encontrado"
    );

    process.exit();

}

console.log(
    `Pedido #${order.orderNumber}`
);

console.log(
    `Nuevo estado: ${order.status}`
);

console.log("======================================");