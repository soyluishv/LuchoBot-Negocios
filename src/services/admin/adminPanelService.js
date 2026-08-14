/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: adminPanelService.js
 * Módulo: Administración
 *
 * Descripción:
 * Procesa todos los comandos enviados
 * por el administrador del negocio.
 *
 * Responsabilidades:
 * - Ver pedidos pendientes
 * - Consultar ventas
 * - Consultar historial
 * - Buscar pedidos
 * - Ejecutar acciones administrativas
 *
 * Importante:
 * Solo debe ser utilizado por números
 * autorizados como administradores.
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL PANEL ADMIN
//
// orderStatus
// Etiquetas visuales de estados.
//
// adminCommandService
// Ejecuta acciones administrativas.
//
// adminReportService
// Genera reportes y consultas.
//
// ==========================================

const {
    getStatusLabel
} = require(
    "../order/orderStatus"
);
const adminCommandService = require(
    "./adminCommandService"
);

const adminReportService = require(
    "./adminReportService"
);

// ==========================================
// PARSEAR FECHA DD/MM/YYYY
//
// Convierte texto a objeto Date.
//
// Ejemplo:
//
// 13/08/2026
//
// ==========================================

function parseDate(dateString) {

    const parts =
        dateString.split("/");

    if (parts.length !== 3) {

        return null;

    }

    const day =
        Number(parts[0]);

    const month =
        Number(parts[1]) - 1;

    const year =
        Number(parts[2]);

    return new Date(
        year,
        month,
        day,
        0,
        0,
        0,
        0
    );

}
// ==========================================
// PROCESADOR DE MENSAJES ADMIN
//
// Recibe:
//
// message
// Texto enviado por el administrador.
//
// Función:
//
// Identificar el comando recibido
// y ejecutar la acción correspondiente.
//
// Ejemplos:
//
// PENDIENTES
// VENTAS
// HISTORIAL
// BUSCAR 0001
// OK 0001
//
// ==========================================

function processAdminMessage(message) {

    const text = message
        .trim();

    const upperText = text
        .toUpperCase();

// ==========================================
// COMANDO: PENDIENTES
//
// Muestra todos los pedidos
// que aún no han sido entregados
// ni cancelados.
//
// Incluye:
//
// - Cliente
// - Productos
// - Dirección
// - Observaciones
// - Tiempo de espera
//
// ==========================================

    if (upperText === "PENDIENTES") {

        const pendingOrders =
            adminReportService
                .getPendingOrders();

        if (
            pendingOrders.length === 0
        ) {

            return {
                success: true,
                message:
                    "✅ No hay pedidos pendientes."
            };

        }

        let response =
            "📦 PEDIDOS PENDIENTES\n\n";

            pendingOrders.forEach(
                order => {

// ==========================================
// CALCULAR TIEMPO DE ESPERA
//
// Determina cuántos minutos lleva
// el pedido pendiente.
//
// Se utiliza para mostrar alertas
// visuales al administrador.
//
// ==========================================

            const waitingMinutes =
            Math.floor(
            (Date.now() - order.createdAt) /
            60000
            );

// ==========================================
// SEMÁFORO DE ATENCIÓN
//
// 🟢 Menos de 30 min
// 🟡 Entre 30 y 59 min
// 🔴 60 min o más
//
// ==========================================
            
let waitingIndicator =
    "🟢";

if (waitingMinutes >= 60) {

    waitingIndicator = "🔴";

}
else if (waitingMinutes >= 30) {

    waitingIndicator = "🟡";

}

const products =
    order.items
    .map(
        item =>
           `${item.quantity}x ${item.emoji} ${item.name}`
    )
    .join("\n");
    
response +=
    `📦 #${order.orderNumber}\n\n` +

    `👤 ${order.customer.name}\n` +

    `${
        order.customer.phone
            ? `📱 ${order.customer.phone}\n`
            : ""
    }` +

    `\n🍔 Productos:\n${products}\n\n` +

    `💰 $${order.total.toLocaleString("es-CO")}\n\n` +

    `🚚 ${
        order.delivery.type === "pickup"
            ? "Recoger en punto"
            : "Domicilio"
    }\n` +

    `${
        order.delivery.type === "delivery" &&
        order.customer.address
            ? `📍 ${order.customer.address}\n`
            : ""
    }` +

    `${
        order.delivery.type === "delivery" &&
        order.customer.neighborhood
            ? `🏘️ ${order.customer.neighborhood}\n`
            : ""
    }` +

    `${
        order.customer.notes
            ? `📝 ${order.customer.notes}\n`
            : ""
    }` +

    `\n⏱️ ${waitingMinutes} min ${waitingIndicator}\n` +

    `━━━━━━━━━━━\n\n`;
                  }
                 );

        response +=
            `\nTotal pendientes: ${pendingOrders.length}`;

        return {
            success: true,
            message: response
        };

    }

// ==========================
// VENTAS
//
// Propósito:
//
// Mostrar métricas comerciales
// relevantes para el administrador.
//
// Información:
//
// - Pedidos entregados
// - Valor neto vendido
// - Domicilios realizados
// - Valor generado por domicilios
// - Pedidos recogidos en punto
// - Producto más vendido
//
// ==========================

if (
    upperText.startsWith(
        "VENTAS"
    )
) {

    const parts =
        text.trim().split(" ");

    // ======================
    // REPORTE GENERAL
    // ======================

if (parts.length === 1) {

        const report =
            adminReportService
                .getAdvancedSalesReport();

        return {

            success: true,

            message:
                "📊 REPORTE DE VENTAS\n\n" +

                `📦 Pedidos entregados: ${report.deliveredOrders}\n\n` +

                `💰 Valor neto vendido:\n` +
                `$${report.totalSales.toLocaleString("es-CO")}\n\n` +

                "━━━━━━━━━━━\n\n" +

                `🏠 Domicilios: ${report.deliveryCount}\n` +
                `💵 Valor domicilios: $${report.deliverySales.toLocaleString("es-CO")}\n\n` +

                `🛍️ Recoger en punto: ${report.pickupCount}\n` +
                `💵 Valor recoger en punto: $${report.pickupSales.toLocaleString("es-CO")}\n\n` +

                "━━━━━━━━━━━\n\n" +

                `🏆 Producto más vendido:\n` +
                `${report.topProduct} (${report.topQuantity})`

        };

    }

    // ======================
    // VENTAS DE UN SOLO DÍA
    // ======================

if (parts.length === 2) {

    const startDate =
        parseDate(parts[1]);

    if (!startDate) {

        return {

            success: false,

            message:
                "❌ Fecha inválida.\n\n" +
                "Formato:\n" +
                "VENTAS 13/08/2026"

        };

    }

    const endDate =
        new Date(startDate);

    endDate.setHours(
        23,
        59,
        59,
        999
    );

    const report =
        adminReportService
            .getAdvancedSalesReportByDateRange(
                startDate,
                endDate
            );

    return {

        success: true,

        message:
            `📅 VENTAS DEL ${parts[1]}\n\n` +

            `📦 Pedidos entregados: ${report.deliveredOrders}\n\n` +

            `💰 Valor neto vendido:\n` +
            `$${report.totalSales.toLocaleString("es-CO")}\n\n` +

            "━━━━━━━━━━━\n\n" +

            `🏠 Domicilios: ${report.deliveryCount}\n` +
            `💵 Valor domicilios: $${report.deliverySales.toLocaleString("es-CO")}\n\n` +

            `🛍️ Recoger en punto: ${report.pickupCount}\n` +
            `💵 Valor recoger en punto: $${report.pickupSales.toLocaleString("es-CO")}\n\n` +

            "━━━━━━━━━━━\n\n" +

            `🏆 Producto más vendido:\n` +
            `${report.topProduct} (${report.topQuantity})`

    };

}

// ==========================
// VENTAS ENTRE FECHAS
//
// Permite consultar un período
// completo.
//
// Formato:
//
// VENTAS DD/MM/YYYY DD/MM/YYYY
//
// Ejemplo:
//
// VENTAS 10/08/2026 13/08/2026
//
// ==========================

if (parts.length === 3) {

    const startDate =
        parseDate(parts[1]);

    const endDate =
        parseDate(parts[2]);

    if (
        !startDate ||
        !endDate
    ) {

        return {

            success: false,

            message:
                "❌ Fecha inválida.\n\n" +
                "Formato correcto:\n" +
                "VENTAS 10/08/2026 13/08/2026"

        };

    }

    // ======================================
    // VALIDAR ORDEN DE FECHAS
    // ======================================

    if (
        startDate > endDate
    ) {

        return {

            success: false,

            message:
                "❌ La fecha inicial no puede ser\n" +
                "posterior a la fecha final."

        };

    }

    // ======================================
    // INCLUIR TODO EL DÍA FINAL
    // ======================================

    endDate.setHours(
        23,
        59,
        59,
        999
    );

    const report =
        adminReportService
            .getAdvancedSalesReportByDateRange(
                startDate,
                endDate
            );

    return {

        success: true,

        message:
            `📊 REPORTE DE VENTAS\n\n` +

            `📅 Desde: ${parts[1]}\n` +
            `📅 Hasta: ${parts[2]}\n\n` +

            `📦 Pedidos entregados: ${report.deliveredOrders}\n\n` +

            `💰 Valor neto vendido:\n` +
            `$${report.totalSales.toLocaleString("es-CO")}\n\n` +

            "━━━━━━━━━━━\n\n" +

            `🏠 Domicilios: ${report.deliveryCount}\n` +
            `💵 Valor domicilios: $${report.deliverySales.toLocaleString("es-CO")}\n\n` +

            `🛍️ Recoger en punto: ${report.pickupCount}\n` +
            `💵 Valor recoger en punto: $${report.pickupSales.toLocaleString("es-CO")}\n\n` +

            "━━━━━━━━━━━\n\n" +

            `🏆 Producto más vendido:\n` +
            `${report.topProduct} (${report.topQuantity})`

    };

}
}

// ==========================================
// COMANDO: AYUDA
//
// Muestra los comandos disponibles
// para administrar el negocio.
//
// Funciona como menú principal
// del panel administrativo.
//
// ==========================================

if (upperText === "AYUDA") {

    return {

        success: true,

        message:
            "🛠️ PANEL ADMIN\n\n" +

            "📦 PENDIENTES\n" +
            "📊 VENTAS\n" +
            "📚 HISTORIAL\n" +
            "🔎 BUSCAR 0001\n" +
            "✅ OK 0001\n" +
            "❌ CANCELAR 0001"

    };

}

// ==========================================
// COMANDO: HISTORIAL
//
// Muestra los pedidos entregados
// registrados en el sistema.
//
// Incluye:
//
// - Número de pedido
// - Valor vendido
// - Total acumulado
//
// ==========================================

if (upperText === "HISTORIAL") {

    const deliveredOrders =
        adminReportService
            .getDeliveredOrders();

    if (
        deliveredOrders.length === 0
    ) {

        return {

            success: true,

            message:
                "📦 No hay pedidos entregados."

        };

    }

let totalSales = 0;

let response =
    "📊 HISTORIAL DE PEDIDOS\n\n";

deliveredOrders.forEach(
    order => {

        totalSales += order.total;

        response +=
            `✅ #${order.orderNumber} - $${order.total.toLocaleString("es-CO")}\n`;

    }
);

response +=
    "\n━━━━━━━━━━━\n";

response +=
    `\n📦 Entregados: ${deliveredOrders.length}`;

response +=
    `\n💰 Total vendido: $${totalSales.toLocaleString("es-CO")}`;

    return {

        success: true,

        message: response

    };

}

// ==========================================
// COMANDO: BUSCAR
//
// Permite localizar un pedido
// específico mediante su número.
//
// Ejemplo:
//
// BUSCAR 0001
//
// ==========================================

if (
    upperText.startsWith(
        "BUSCAR "
    )
) {

        const orderNumber =
            upperText.replace(
                "BUSCAR ",
                ""
            );

        const order =
            adminReportService
                .findOrder(
                    orderNumber
                );

        if (!order) {

            return {

                success: false,

                message:
                    `❌ Pedido #${orderNumber} no encontrado.`

            };

        }

let products = "";

order.items.forEach(
    item => {

        products +=
            `${item.quantity}x ${item.name}\n`;

    }
    );

            return {

            success: true,

            order,

            message:
            `📦 PEDIDO #${order.orderNumber}\n\n` +
            `👤 Cliente: ${order.customer.name}\n` +
            `📱 Teléfono: ${order.customer.phone}\n` +
            `🚚 ${order.delivery.type === "pickup"
            ? "Recoger en punto"
            : "Domicilio"}\n\n` +
            `🛒 Productos:\n${products}\n` +
            `💰 Total: $${order.total.toLocaleString("es-CO")}\n\n` +
            `📌 Estado: ${getStatusLabel(order.status)}`

    };

    }

// ==========================================
// COMANDOS ADMINISTRATIVOS SECUNDARIOS
//
// Delega los comandos administrativos
// que no son procesados directamente
// por este servicio.
//
// Ejemplos:
//
// OK 0001
// CANCELAR 0001
//
// ==========================================

    return adminCommandService
        .processAdminCommand(
            upperText
        );
   }

// ==========================================
// API PÚBLICA DEL PANEL ADMIN
//
// Punto principal de entrada
// para la administración
// del negocio.
//
// ==========================================

module.exports = {

    processAdminMessage

};
