const orderUpdateService = require(
    "../order/orderUpdateService"
);

const {
    STATUS
} = require(
    "../order/orderStatus"
);

function processAdminCommand(message) {

    const text = message
        .trim()
        .toUpperCase();

    const parts = text.split(" ");

    if (parts.length !== 2) {

        return {
            success: false,
            message:
                "❌ Comando inválido."
        };

    }

    const command = parts[0];
    const orderNumber = parts[1];

    let newStatus = null;

    switch (command) {

        case "OK":

            newStatus =
                STATUS.DELIVERED;

            break;

        case "CANCELAR":

            newStatus =
                STATUS.CANCELLED;

            break;

        default:

            return {
                success: false,
                message:
                    "❌ Comando no reconocido.\n\n" +
                    "Use:\n" +
                    "OK 0017\n" +
                    "CANCELAR 0017"
            };

    }

    const order =
        orderUpdateService
            .updateOrderStatus(
                orderNumber,
                newStatus
            );

    if (!order) {

        return {
            success: false,
            message:
                `❌ Pedido #${orderNumber} no encontrado.`
        };

    }

    return {

        success: true,

        order,

        status: newStatus,

        message:
            newStatus === STATUS.DELIVERED
                ? `✅ Pedido #${orderNumber} finalizado y enviado al historial.`
                : `❌ Pedido #${orderNumber} cancelado.`

    };

}

module.exports = {

    processAdminCommand

};