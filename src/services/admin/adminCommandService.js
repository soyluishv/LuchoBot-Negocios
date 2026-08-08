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

        case "PREPARAR":
            newStatus =
                STATUS.PREPARING;
            break;

        case "ENCAMINO":
            newStatus =
                STATUS.ON_THE_WAY;
            break;

        case "ENTREGADO":
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
                    "❌ Comando no reconocido."
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
            `✅ Pedido #${orderNumber} actualizado a ${newStatus}.`

    };

}

module.exports = {

    processAdminCommand

};