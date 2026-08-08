const {
    getStatusLabel
} = require(
    "../order/orderStatus"
);
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

            return {
                success: true,
                message:
                    "✅ No hay pedidos pendientes."
            };

        }

        let response =
            "📦 PEDIDOS PENDIENTES\n\n";

            pendingOrders.forEach(
                order => {

            const waitingMinutes =
            Math.floor(
            (Date.now() - order.createdAt) /
            60000
            );

let waitingIndicator =
    "🟢";

if (waitingMinutes >= 60) {

    waitingIndicator = "🔴";

}
else if (waitingMinutes >= 30) {

    waitingIndicator = "🟡";

}

    const products =
        order.items
        .map(
            item =>
                `${item.quantity}x ${item.name}`
        )
        .join("\n");

        response +=
           `📦 #${order.orderNumber}\n` +
           `👤 ${order.customer.name}\n` +
           `🍔 Productos:\n${products}\n\n` +
            `📌 ${getStatusLabel(order.status)}\n` +
            `⏱️ ${waitingMinutes} min | ${waitingIndicator}\n` +
            `🚚 ${order.delivery.type === "pickup" ? "Recoger en punto" : "Domicilio"}\n` +
            `💰 $${order.total.toLocaleString("es-CO")}\n` +
            `━━━━━━━━━━━━━━━━\n\n`;

              }
             );

        response +=
            `\nTotal pendientes: ${pendingOrders.length}`;

        return {
            success: true,
            message: response
        };

    }

    if (upperText === "VENTAS") {

        const report =
            adminReportService
                .getSalesReport();

        return {

            success: true,

            message:
                "📊 REPORTE GENERAL\n\n" +
                `Pedidos: ${report.totalOrders}\n` +
                `Ventas: $${report.totalSales.toLocaleString("es-CO")}\n` +
                `Entregados: ${report.delivered}\n` +
                `Pendientes: ${report.pending}`

        };

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

            return {

                success: false,

                message:
                    `❌ Pedido #${orderNumber} no encontrado.`

            };

        }

let products = "";

order.items.forEach(
    item => {

        products +=
            `${item.quantity}x ${item.name}\n`;

    }
    );

            return {

            success: true,

            order,

            message:
            `📦 PEDIDO #${order.orderNumber}\n\n` +
            `👤 Cliente: ${order.customer.name}\n` +
            `📱 Teléfono: ${order.customer.phone}\n` +
            `🚚 ${order.delivery.type === "pickup"
            ? "Recoger en punto"
            : "Domicilio"}\n\n` +
            `🛒 Productos:\n${products}\n` +
            `💰 Total: $${order.total.toLocaleString("es-CO")}\n\n` +
            `📌 Estado: ${order.status}`

    };

    }

    // ==========================
    // COMANDOS
    // ==========================

    return adminCommandService
        .processAdminCommand(
            upperText
        );

}

module.exports = {

    processAdminMessage

};