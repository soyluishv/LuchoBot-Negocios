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

    return orders

        .filter(
            order =>
                order.status !== "delivered" &&
                order.status !== "cancelled"
        )

        .sort(
            (a, b) =>
                a.createdAt - b.createdAt
        );

}

// ==========================================
// PEDIDOS ENTREGADOS
// ==========================================

function getDeliveredOrders() {

    return orderStorage
        .getAllOrders()
        .filter(
            order =>
                order.status === "delivered"
        )
        .sort(
            (a, b) =>
                b.updatedAt - a.updatedAt
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

    const cancelled =
        orders.filter(
            order =>
               order.status === "cancelled"
        ).length;

    return {

            totalOrders,
            totalSales,
            delivered,
            pending,
            cancelled

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

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getPendingOrders,
    getDeliveredOrders,
    getSalesReport,
    findOrder

};