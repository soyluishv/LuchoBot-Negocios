/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: adminReportService.js
 * Módulo: Reportes Administrativos
 *
 * Descripción:
 * Genera estadísticas y consultas
 * utilizadas por el panel de
 * administración del negocio.
 *
 * Responsabilidades:
 * - Consultar pedidos pendientes
 * - Consultar pedidos entregados
 * - Generar reportes de ventas
 * - Generar estadísticas avanzadas
 * - Filtrar ventas por fechas
 * - Buscar pedidos específicos
 *
 * Importante:
 * Este módulo NO modifica pedidos.
 *
 * Solamente consulta información
 * almacenada en orderStorage.
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS
//
// orderStorage
// Acceso a los pedidos almacenados.
//
// orderStatus
// Etiquetas de estados.
//
// ==========================================

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
//
// Propósito:
//
// Generar un resumen ejecutivo
// para el administrador.
//
// Información calculada:
//
// - Pedidos totales
// - Pedidos entregados
// - Pedidos pendientes
// - Pedidos cancelados
// - Valor neto vendido
//
// Importante:
//
// Las ventas únicamente se calculan
// sobre pedidos ENTREGADOS.
//
// Los pedidos pendientes o cancelados
// no representan ingresos reales.
//
// ==========================================

function getSalesReport() {

    const orders =
        orderStorage.getAllOrders();

    // ======================================
    // PEDIDOS ENTREGADOS
    // ======================================

    const deliveredOrders =
        orders.filter(
            order =>
                order.status === "delivered"
        );

    // ======================================
    // TOTALES GENERALES
    // ======================================

    const totalOrders =
        orders.length;

    const delivered =
        deliveredOrders.length;

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

    // ======================================
    // VALOR NETO VENDIDO
    //
    // Solo pedidos entregados.
    // ======================================

    const totalSales =
        deliveredOrders.reduce(
            (total, order) =>
                total + order.total,
            0
        );

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
//
// Propósito:
//
// Localizar un pedido específico
// utilizando su número.
//
// Ejemplo:
//
// 0001
// 0002
//
// ==========================================

function findOrder(orderNumber) {

    return orderStorage.findOrder(
        orderNumber
    );

}

// - Producto más vendido
//
// ==========================================
// PRODUCTO MÁS VENDIDO
//
// Busca el producto con mayor
// cantidad acumulada vendida.
//
// ==========================================

function getAdvancedSalesReport() {

    const deliveredOrders =
        getDeliveredOrders();

    let totalSales = 0;

    let deliveryCount = 0;
    let deliverySales = 0;

    let pickupCount = 0;
    let pickupSales = 0;

    const products = {};

    deliveredOrders.forEach(order => {

        totalSales += order.total;

        // ======================
        // DOMICILIOS
        // ======================

        if (
            order.delivery.type === "delivery"
        ) {

            deliveryCount++;

            deliverySales +=
                order.delivery.price || 0;

        }

        // ======================
        // RECOGER EN PUNTO
        // ======================

        if (
            order.delivery.type === "pickup"
        ) {

            pickupCount++;

            pickupSales += order.total;

        }

        // ======================
        // PRODUCTOS
        // ======================

        order.items.forEach(item => {

            if (!products[item.name]) {

                products[item.name] = 0;

            }

            products[item.name] +=
                item.quantity;

        });

    });

    let topProduct =
        "Sin datos";

    let topQuantity = 0;

    Object.entries(products)
        .forEach(([name, quantity]) => {

            if (
                quantity > topQuantity
            ) {

                topProduct = name;

                topQuantity = quantity;

            }

        });

// ==========================================
// RESULTADO DEL REPORTE AVANZADO
//
// Devuelve las métricas comerciales
// calculadas para el panel administrativo.
//
// ==========================================

return {

    deliveredOrders:
        deliveredOrders.length,

    totalSales,

    deliveryCount,
    deliverySales,

    pickupCount,
    pickupSales,

    topProduct,
    topQuantity

};
}

// ==========================================
// PEDIDOS ENTREGADOS POR FECHA
//
// Propósito:
//
// Obtener únicamente los pedidos
// entregados dentro de un rango
// de fechas.
//
// ==========================================

function getDeliveredOrdersByDateRange(
    startDate,
    endDate
) {

    return getDeliveredOrders()

        .filter(order => {

            const orderDate =
                new Date(
                    order.updatedAt
                );

            return (
                orderDate >= startDate &&
                orderDate <= endDate
            );

        });

}

// ==========================================
// REPORTE AVANZADO POR FECHAS
//
// Propósito:
//
// Generar estadísticas de ventas
// dentro de un rango específico.
//
// Parámetros:
//
// startDate
// Fecha inicial
//
// endDate
// Fecha final
//
// Información:
//
// - Pedidos entregados
// - Valor neto vendido
// - Domicilios
// - Valor domicilios
// - Recoger en punto
// - Producto más vendido
//
// ==========================================

function getAdvancedSalesReportByDateRange(
    startDate,
    endDate
) {

    const deliveredOrders =
        getDeliveredOrdersByDateRange(
            startDate,
            endDate
        );

    let totalSales = 0;

    let deliveryCount = 0;
    let deliverySales = 0;

    let pickupCount = 0;
    let pickupSales = 0;

    const products = {};

    deliveredOrders.forEach(order => {

        totalSales += order.total;

        // ======================
        // DOMICILIOS
        // ======================

        if (
            order.delivery.type === "delivery"
        ) {

            deliveryCount++;

            deliverySales +=
                order.delivery.price || 0;

        }

        // ======================
        // RECOGER EN PUNTO
        // ======================

        if (
            order.delivery.type === "pickup"
        ) {

            pickupCount++;

            pickupSales +=
                order.total;

        }

        // ======================
        // PRODUCTOS VENDIDOS
        // ======================

        order.items.forEach(item => {

            if (!products[item.name]) {

                products[item.name] = 0;

            }

            products[item.name] +=
                item.quantity;

        });

    });

    let topProduct =
        "Sin datos";

    let topQuantity = 0;

    Object.entries(products)
        .forEach(([name, quantity]) => {

            if (
                quantity > topQuantity
            ) {

                topProduct = name;
                topQuantity = quantity;

            }

        });

    return {

        deliveredOrders:
            deliveredOrders.length,

        totalSales,

        deliveryCount,
        deliverySales,

        pickupCount,
        pickupSales,

        topProduct,
        topQuantity

    };

}

// ==========================================
// API PÚBLICA DEL SERVICIO
//
// Funciones disponibles para
// consultas administrativas.
//
// ==========================================

module.exports = {

    getPendingOrders,
    getDeliveredOrders,
    getDeliveredOrdersByDateRange,

    getSalesReport,
    getAdvancedSalesReport,
    getAdvancedSalesReportByDateRange,

    findOrder

};