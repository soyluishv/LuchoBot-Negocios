const orderStorage = require(
    "../../storage/orderStorage"
);

const {
    STATUS
} = require("./orderStatus");


function updateOrderStatus(
    orderNumber,
    newStatus
) {

    const validStatus = Object.values(
        STATUS
    );

    if (!validStatus.includes(newStatus)) {

        throw new Error(
            "Estado inválido."
        );

    }

    const order = orderStorage.findOrder(
        orderNumber
    );

    if (!order) {

        return null;

    }

    const updatedOrder =
        orderStorage.updateOrder(
            orderNumber,
            {
                status: newStatus,

                completedAt:
                    newStatus === STATUS.DELIVERED
                        ? Date.now()
                        : null
            }
        );

    // ==========================
    // NOTIFICAR CLIENTE
    // ==========================

    if (
        global.whatsappClient
    ) {

        if (
            newStatus === STATUS.DELIVERED
        ) {

            global.whatsappClient.sendText(
                order.userId,
                `✅ Pedido #${orderNumber} listo.\n\nGracias por tu compra 🍔\n\nTe esperamos nuevamente.`
            );

        }

        if (
            newStatus === STATUS.CANCELLED
        ) {

            global.whatsappClient.sendText(
                order.userId,
                `❌ Pedido #${orderNumber} cancelado.\n\nSi deseas realizar un nuevo pedido escríbenos nuevamente.`
            );

        }

    }

    return updatedOrder;

}

module.exports = {

    updateOrderStatus

};