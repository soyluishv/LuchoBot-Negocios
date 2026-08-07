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

    return orderStorage.updateOrder(
        orderNumber,
        {
            status: newStatus
        }
    );

}

module.exports = {

    updateOrderStatus

};