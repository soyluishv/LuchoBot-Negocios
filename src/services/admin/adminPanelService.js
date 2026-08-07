const adminCommandService = require(
    "./adminCommandService"
);

const adminReportService = require(
    "./adminReportService"
);

function processAdminMessage(message) {

    const text = message
        .trim();

    const upperText = text
        .toUpperCase();

    // ==========================
    // REPORTES
    // ==========================

    if (upperText === "PENDIENTES") {

        const pendingOrders =
            adminReportService
                .getPendingOrders();

        if (
            pendingOrders.length === 0
        ) {

            return "✅ No hay pedidos pendientes.";

        }

        let response =
            "📦 PEDIDOS PENDIENTES\n\n";

        pendingOrders.forEach(
            order => {

                response +=
                    `#${order.orderNumber} | ${order.status} | $${order.total.toLocaleString("es-CO")}\n`;

            }
        );

        response +=
            `\nTotal pendientes: ${pendingOrders.length}`;

        return response;

    }

    if (upperText === "VENTAS") {

        const report =
            adminReportService
                .getSalesReport();

        return (
            "📊 REPORTE GENERAL\n\n" +
            `Pedidos: ${report.totalOrders}\n` +
            `Ventas: $${report.totalSales.toLocaleString("es-CO")}\n` +
            `Entregados: ${report.delivered}\n` +
            `Pendientes: ${report.pending}`
        );

    }

    if (
        upperText.startsWith(
            "BUSCAR "
        )
    ) {

        const orderNumber =
            upperText.replace(
                "BUSCAR ",
                ""
            );

        const order =
            adminReportService
                .findOrder(
                    orderNumber
                );

        if (!order) {

            return `❌ Pedido #${orderNumber} no encontrado.`;

        }

        return (
            `📦 PEDIDO #${order.orderNumber}\n\n` +
            `Estado: ${order.status}\n` +
            `Cliente: ${order.customer.name}\n` +
            `Total: $${order.total.toLocaleString("es-CO")}`
        );

    }

    // ==========================
    // COMANDOS
    // ==========================

    const result =
        adminCommandService
            .processAdminCommand(
                upperText
            );

    return result.message;

}

module.exports = {

    processAdminMessage

};