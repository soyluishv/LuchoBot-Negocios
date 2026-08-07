const orderStorage = require(
    "../../storage/orderStorage"
);

const {
    STATUS_LABELS
} = require(
    "../order/orderStatus"
);

// ==========================================
// PEDIDOS PENDIENTES
// ==========================================

function getPendingOrders() {

    const orders =
        orderStorage.getAllOrders();

    return orders.filter(
        order =>
            order.status !== "delivered" &&
            order.status !== "cancelled"
    );

}

// ==========================================
// ESTADÍSTICAS GENERALES
// ==========================================

function getSalesReport() {

    const orders =
        orderStorage.getAllOrders();

    const totalOrders =
        orders.length;

    const totalSales =
        orders.reduce(
            (total, order) =>
                total + order.total,
            0
        );

    const delivered =
        orders.filter(
            order =>
                order.status === "delivered"
        ).length;

    const pending =
        orders.filter(
            order =>
                order.status !== "delivered" &&
                order.status !== "cancelled"
        ).length;

    return {

        totalOrders,
        totalSales,
        delivered,
        pending

    };

}

// ==========================================
// BUSCAR PEDIDO
// ==========================================

function findOrder(orderNumber) {

    return orderStorage.findOrder(
        orderNumber
    );

}

module.exports = {

    getPendingOrders,
    getSalesReport,
    findOrder

};