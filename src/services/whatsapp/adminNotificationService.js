const orderStorage = require(
    "../../storage/orderStorage"
);
function buildNewOrderNotification(order) {

    let message =
        "🔔 NUEVO PEDIDO\n\n";

    message +=
        `📦 Pedido #${order.orderNumber}\n\n`;

    message +=
        `👤 ${order.customer.name}\n`;

    message +=
        `📱 ${order.customer.phone}\n\n`;

    message +=
        "🍔 Productos\n\n";

    order.items.forEach(
        item => {

            message +=
    `${item.quantity}x [${item.categoryName}] ${item.name}\n`;

        }
    );

    message +=
        `\n💰 Total: $${order.total.toLocaleString("es-CO")}\n\n`;

    message +=
        `🚚 ${
            order.delivery.type === "pickup"
                ? "Recoger en punto"
                : "Domicilio"
        }\n`;

    if (
        order.delivery.type === "delivery"
    ) {

        message +=
            `📍 ${order.customer.address}\n`;

        message +=
            `🏘️ ${order.customer.neighborhood}\n`;

    }

if (
order.customer.notes &&
order.customer.notes !== "SIN OBSERVACIONES"
) {

    message +=
        `📝 ${order.customer.notes}\n`;

}

const pendingCount =
    orderStorage
        .getAllOrders()
        .filter(
            order =>
                order.status !== "delivered" &&
                order.status !== "cancelled"
        ).length;

message +=
    "\n⏱️ Recién recibido\n";

message +=
    `📦 Pendientes en cola: ${pendingCount}\n\n`;

message +=
    `✅ OK ${order.orderNumber}\n`;

message +=
    `❌ CANCELAR ${order.orderNumber}`;

return message;

}

module.exports = {
    buildNewOrderNotification
};