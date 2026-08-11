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
           `${item.quantity}x ${item.emoji} ${item.name}`
    )
    .join("\n");
    
response +=
    `📦 #${order.orderNumber}\n\n` +

    `👤 ${order.customer.name}\n` +

    `${
        order.customer.phone
            ? `📱 ${order.customer.phone}\n`
            : ""
    }` +

    `\n🍔 Productos:\n${products}\n\n` +

    `💰 $${order.total.toLocaleString("es-CO")}\n\n` +

    `🚚 ${
        order.delivery.type === "pickup"
            ? "Recoger en punto"
            : "Domicilio"
    }\n` +

    `${
        order.delivery.type === "delivery" &&
        order.customer.address
            ? `📍 ${order.customer.address}\n`
            : ""
    }` +

    `${
        order.delivery.type === "delivery" &&
        order.customer.neighborhood
            ? `🏘️ ${order.customer.neighborhood}\n`
            : ""
    }` +

    `${
        order.customer.notes
            ? `📝 ${order.customer.notes}\n`
            : ""
    }` +

    `\n⏱️ ${waitingMinutes} min ${waitingIndicator}\n` +

    `━━━━━━━━━━━\n\n`;
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
            "📊 REPORTE DE VENTAS\n\n" +

            `📦 Pedidos totales: ${report.totalOrders}\n` +

            `💰 Ventas totales: $${report.totalSales.toLocaleString("es-CO")}\n\n` +

            `✅ Entregados: ${report.delivered}\n` +

            `⏳ Pendientes: ${report.pending}\n` +

            `❌ Cancelados: ${report.cancelled}`

    };

}

// ==========================
// AYUDA
// ==========================

if (upperText === "AYUDA") {

    return {

        success: true,

        message:
            "🛠️ PANEL ADMIN\n\n" +

            "📦 PENDIENTES\n" +
            "📊 VENTAS\n" +
            "📚 HISTORIAL\n" +
            "🔎 BUSCAR 0001\n" +
            "✅ OK 0001\n" +
            "❌ CANCELAR 0001"

    };

}

// ==========================
// HISTORIAL
// ==========================

if (upperText === "HISTORIAL") {

    const deliveredOrders =
        adminReportService
            .getDeliveredOrders();

    if (
        deliveredOrders.length === 0
    ) {

        return {

            success: true,

            message:
                "📦 No hay pedidos entregados."

        };

    }

let totalSales = 0;

let response =
    "📊 HISTORIAL DE PEDIDOS\n\n";

deliveredOrders.forEach(
    order => {

        totalSales += order.total;

        response +=
            `✅ #${order.orderNumber} - $${order.total.toLocaleString("es-CO")}\n`;

    }
);

response +=
    "\n━━━━━━━━━━━\n";

response +=
    `\n📦 Entregados: ${deliveredOrders.length}`;

response +=
    `\n💰 Total vendido: $${totalSales.toLocaleString("es-CO")}`;

    return {

        success: true,

        message: response

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
            `📌 Estado: ${getStatusLabel(order.status)}`

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