const reportService = require(
    "./services/admin/adminReportService"
);

console.log("======================================");
console.log("📦 PEDIDOS PENDIENTES");
console.log("======================================");

const pending =
    reportService.getPendingOrders();

console.log(
    `Pendientes: ${pending.length}`
);

pending.forEach(order => {

    console.log(
        `#${order.orderNumber} | ${order.status} | $${order.total.toLocaleString("es-CO")}`
    );

});

console.log("======================================");
console.log("📊 REPORTE DE VENTAS");
console.log("======================================");

const report =
    reportService.getSalesReport();

console.log(
    `Pedidos: ${report.totalOrders}`
);

console.log(
    `Ventas: $${report.totalSales.toLocaleString("es-CO")}`
);

console.log(
    `Entregados: ${report.delivered}`
);

console.log(
    `Pendientes: ${report.pending}`
);

console.log("======================================");
console.log("🔍 BUSCAR PEDIDO");
console.log("======================================");

const order =
    reportService.findOrder(
        "0001"
    );

if (order) {

    console.log(
        `Pedido #${order.orderNumber}`
    );

    console.log(
        `Estado: ${order.status}`
    );

    console.log(
        `Total: $${order.total.toLocaleString("es-CO")}`
    );

}