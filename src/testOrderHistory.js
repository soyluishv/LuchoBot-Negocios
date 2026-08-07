const historyService = require(
    "./services/order/orderHistoryService"
);

console.log("======================================");
console.log("📊 HISTORIAL DE PEDIDOS");
console.log("======================================");

const orders =
    historyService.getAllOrders();

console.log(
    `Pedidos encontrados: ${orders.length}`
);

console.log("");

orders.forEach(order => {

    console.log(

        `#${order.orderNumber} | ${order.status} | $${order.total.toLocaleString("es-CO")}`

    );

});

console.log("");
console.log("======================================");
console.log("📈 ESTADÍSTICAS");
console.log("======================================");

console.log(
    `Total pedidos: ${historyService.getTotalOrders()}`
);

console.log(
    `Ventas acumuladas: $${historyService.getTotalSales().toLocaleString("es-CO")}`
);

console.log(
    `Pendientes: ${historyService.getPendingOrders().length}`
);

console.log("======================================");