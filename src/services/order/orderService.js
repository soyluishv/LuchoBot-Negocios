/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: orderService.js
 * Módulo: Gestión de Pedidos
 *
 * Descripción:
 * Este servicio controla todo el ciclo de
 * vida de los pedidos realizados por los
 * clientes.
 *
 * Responsabilidades:
 * - Validar pedidos
 * - Crear pedidos oficiales
 * - Generar consecutivos
 * - Calcular totales
 * - Guardar pedidos
 * - Consultar historial
 * - Notificar nuevos pedidos al administrador
 *
 * Dependencias:
 * - cartService
 * - checkoutService
 * - customerDataService
 * - orderStorage
 * - adminNotificationService
 *
 * Adaptable para:
 * - Restaurantes
 * - Comida rápida
 * - Tiendas de ropa
 * - Zapaterías
 * - Cosméticos
 * - Cualquier negocio con catálogo
 *
 * ==========================================
 */



// ==========================================
// IMPORTACIÓN DE DEPENDENCIAS
//
// Servicios necesarios para construir,
// validar, almacenar y notificar pedidos.
// ==========================================

const cartService = require(
    "../cart/cartService"
);

const checkoutService = require(
    "../checkout/checkoutService"
);

const customerDataService = require(
    "../checkout/customerDataService"
);

const orderStorage = require(
    "../../storage/orderStorage"
);

const adminNotificationService = require(
    "../whatsapp/adminNotificationService"
);

// ==========================================
// GENERAR CONSECUTIVO DE PEDIDO
//
// Propósito:
// Obtener el siguiente número disponible
// para identificar un pedido.
//
// Ejemplos:
// 0001
// 0002
// 0003
//
// Retorna:
// String
// ==========================================

function generateOrderNumber() {

    return orderStorage.getNextOrderNumber();

}

// ==========================================
// CONFIRMAR PEDIDO
//
// Propósito:
// Convertir el carrito temporal del cliente
// en un pedido oficial.
//
// Flujo:
//
// 1. Obtener carrito
// 2. Obtener checkout
// 3. Validar información
// 4. Calcular totales
// 5. Crear pedido
// 6. Guardar pedido
// 7. Notificar administrador
// 8. Limpiar carrito
//
// Entrada:
// userId
//
// Retorna:
// {
//   ok,
//   order
// }
// ==========================================

function confirmOrder(userId) {

    const cart =
        cartService.getCart(userId);

    console.log(
        "CARRITO ANTES DE CREAR PEDIDO:"
    );

    console.log(
        JSON.stringify(
            cart,
            null,
            2
        )
    );

    const checkout =
        checkoutService.getCheckout(userId);

// ======================================
// VALIDACIONES DE COMPRA
//
// Verifica:
//
// - Carrito con productos
// - Checkout activo
// - Tipo de entrega seleccionado
// - Datos del cliente completos
//
// Si alguna validación falla,
// el pedido no será creado.
// ======================================

    if (!cart || cart.items.length === 0) {

        return {
            ok: false,
            message: "El carrito está vacío."
        };

    }

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (!checkout.deliveryType) {

        return {
            ok: false,
            message: "Falta seleccionar el tipo de entrega."
        };

    }

    const customerValidation =
        customerDataService.validateCustomerData(
            userId
        );

    if (!customerValidation.ok) {

        return {
            ok: false,
            message: customerValidation.message,
            field: customerValidation.field
        };

    }

// ======================================
// CÁLCULO DE VALORES
//
// Obtiene:
//
// - Subtotal productos
// - Valor domicilio
// - Total final
//
// Estos valores quedan congelados
// dentro del pedido.
// ======================================

    const subtotal =
        cartService.getSubtotal(userId);

    const total =
        checkoutService.getTotal(userId);

// ======================================
// CONSTRUIR PEDIDO DEFINITIVO
//
// Se genera una copia completa del
// pedido para almacenarla.
//
// Importante:
//
// El pedido NO depende posteriormente
// del carrito ni del checkout.
//
// Aunque el cliente modifique el
// carrito después, este pedido
// permanecerá intacto.
// ======================================

const order = {

    orderNumber: generateOrderNumber(),

    userId,

    status: "confirmed",

    items: cart.items.map(item => ({
        productId: item.productId,
        categoryId: item.categoryId,
        categoryName: item.categoryName,
        emoji: item.emoji,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        total:
            item.unitPrice * item.quantity
    })),

    subtotal,

    delivery: {
        type: checkout.deliveryType,
        price: checkout.deliveryPrice
    },

    customer: {
        ...checkout.customer
    },

    paymentMethod:
        checkout.paymentMethod,

    total,

    createdAt: Date.now()
};

// ======================================
// REGISTRO Y NOTIFICACIÓN
//
// Acciones:
//
// 1. Guardar pedido en orders.json
// 2. Notificar administrador
// 3. Mostrar registro en consola
//
// Este es el punto donde el pedido
// pasa a existir oficialmente.
// ======================================

    orderStorage.saveOrder(
    order
);

const adminNotification =
    adminNotificationService
        .buildNewOrderNotification(
            order
        );

if (
    global.whatsappClient
) {

    global.whatsappClient.sendText(
        "33286130770090@lid",
        adminNotification
    );

}

console.log(
    "\n===================="
);

console.log(
    "NUEVO PEDIDO"
);

console.log(
    adminNotification
);

console.log(
    "====================\n"
);

// ======================================
// LIMPIEZA POSTERIOR A LA COMPRA
//
// Elimina:
//
// - Carrito temporal
// - Checkout temporal
//
// Evita pedidos duplicados y permite
// iniciar una nueva compra limpia.
// ======================================

    cartService.clearCart(userId);

    checkoutService.cancelCheckout(userId);

    return {
        ok: true,
        order
    };

}

// ==========================================
// CONSULTAR PEDIDO POR NÚMERO
//
// Permite localizar un pedido específico.
//
// Ejemplo:
//
// 0001
// 0025
// 0148
// ==========================================

function getOrder(orderNumber) {

    return orderStorage.findOrder(
        orderNumber
    );

}

// ==========================================
// CONSULTAR HISTORIAL COMPLETO
//
// Retorna todos los pedidos almacenados
// en el sistema.
// ==========================================

function getOrders() {

    return orderStorage.getAllOrders();

}

// ==========================================
// CONSULTAR PEDIDOS DE UN CLIENTE
//
// Permite obtener el historial de compras
// realizadas por un usuario específico.
// ==========================================

function getOrdersByUser(userId) {

    return getOrders().filter(
        order => order.userId === userId
    );

}

// ==========================================
// API PÚBLICA DEL SERVICIO
//
// Funciones disponibles para otros
// módulos del sistema.
// ==========================================

module.exports = {

    confirmOrder,
    getOrder,
    getOrders,
    getOrdersByUser

};