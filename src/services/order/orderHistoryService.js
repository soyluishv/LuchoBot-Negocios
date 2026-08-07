/**
 * ==========================================
 * LuchoBot Negocios
 * Historial de Pedidos
 * ==========================================
 */

const orderStorage = require(
    "../../storage/orderStorage"
);

//=========================================
// TODOS LOS PEDIDOS
//=========================================

function getAllOrders() {

    return orderStorage.getAllOrders();

}

//=========================================
// BUSCAR POR NÚMERO
//=========================================

function getOrderByNumber(orderNumber) {

    return orderStorage.findOrder(
        orderNumber
    );

}

//=========================================
// PEDIDOS PENDIENTES
//=========================================

function getPendingOrders() {

    return orderStorage
        .getAllOrders()
        .filter(order =>

            order.status !== "delivered" &&
            order.status !== "cancelled"

        );

}

//=========================================
// TOTAL VENTAS
//=========================================

function getTotalSales() {

    return orderStorage
        .getAllOrders()
        .reduce(

            (total, order) =>

                total + order.total,

            0

        );

}

//=========================================
// CANTIDAD PEDIDOS
//=========================================

function getTotalOrders() {

    return orderStorage
        .getAllOrders()
        .length;

}

//=========================================
// EXPORTAR
//=========================================

module.exports = {

    getAllOrders,

    getOrderByNumber,

    getPendingOrders,

    getTotalSales,

    getTotalOrders

};