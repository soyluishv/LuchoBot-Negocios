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
        "🛒 Pedido\n\n";

    order.items.forEach(
        item => {

            message +=
                `${item.quantity}x ${item.name}\n`;

        }
    );

    message +=
        `\n💰 Total: $${order.total.toLocaleString("es-CO")}\n`;

    message +=
        `📍 ${order.delivery.type === "pickup"
            ? "Recoger en punto"
            : "Domicilio"}\n`;

    return message;

}

module.exports = {
    buildNewOrderNotification
};