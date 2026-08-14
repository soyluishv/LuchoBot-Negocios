/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: cartHandler.js
 * Módulo: Gestión de Carrito
 *
 * Descripción:
 * Controla las acciones disponibles
 * cuando el cliente visualiza su carrito.
 *
 * Responsabilidades:
 * - Seguir comprando
 * - Modificar cantidades
 * - Eliminar productos
 * - Iniciar checkout
 * - Cancelar pedido
 *
 * Importante:
 * Este módulo NO guarda pedidos.
 *
 * Solo administra las decisiones
 * tomadas desde la pantalla del carrito.
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL MÓDULO
//
// sessionStorage
// Control de estados de conversación
//
// cartService
// Gestión de productos del carrito
//
// ==========================================

const sessionStorage = require(
    "../../storage/sessionStorage"
);

const cartService = require(
"../../services/cart/cartService"
);

// ==========================================
// CONTROLADOR PRINCIPAL DEL CARRITO
//
// Parámetros:
//
// userId
// Identificador del cliente.
//
// text
// Mensaje recibido desde WhatsApp.
//
// session
// Estado actual de la conversación.
//
// buildCategoriesMenu
// Función encargada de construir
// el menú de categorías.
//
// Responsabilidad:
//
// Gestionar todas las acciones
// disponibles cuando el usuario
// se encuentra visualizando
// el carrito de compras.
//
// ==========================================

function handleCart(
    userId,
    text,
    session,
    buildCategoriesMenu
) {

// ==========================================
// OPCIÓN 1
// CONTINUAR COMPRANDO
//
// Regresa al listado de categorías
// para agregar más productos.
//
// ==========================================
    
    if (text === "1") {

        sessionStorage.updateSession(
            userId,
            {
                state: "VIEWING_CATEGORIES"
            }
        );

        return buildCategoriesMenu();

    }

// ==========================================
// OPCIÓN 2
// MODIFICAR CANTIDADES
//
// Muestra los productos actuales
// del carrito para seleccionar cuál
// desea modificar.
//
// Estado siguiente:
//
// SELECTING_QUANTITY_PRODUCT
//
// ==========================================

if (text === "2") {

    const cart =
        cartService.getCart(userId);

    if (
        !cart ||
        cart.items.length === 0
    ) {

        return "🛒 Tu carrito está vacío.";

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "SELECTING_QUANTITY_PRODUCT"
        }
    );

    let message =
        "🔢 *CAMBIAR CANTIDAD*\n\n";

// ==========================================
// CONSTRUIR LISTA DE PRODUCTOS
//
// Se enumeran los productos del carrito
// para que el cliente seleccione cuál
// desea modificar.
//
// ==========================================

    cart.items.forEach(
        (item, index) => {

message +=
    `${index + 1}️⃣ ${item.emoji} [${item.categoryName}]\n` +
    `${item.name}\n\n`;

        }
    );

message +=
    "\n0️⃣ Volver al carrito\n\n" +
    "👇 Escribe el número del producto";

    return message;

}

// ==========================================
// OPCIÓN 3
// ELIMINAR PRODUCTO
//
// Muestra los productos actuales
// para seleccionar cuál será removido.
//
// Estado siguiente:
//
// REMOVING_PRODUCT
//
// ==========================================

if (text === "3") 
    
    {

    const cart =
        cartService.getCart(
            userId
        );

    if (
        !cart ||
        cart.items.length === 0
    ) {

        return "🛒 Tu carrito está vacío.";

    }

    sessionStorage.updateSession(
        userId,
        {
            state:
                "REMOVING_PRODUCT"
        }
    );

let message =
    "🗑️ *ELIMINAR PRODUCTO*\n\n";

// ==========================================
// LISTAR PRODUCTOS ELIMINABLES
//
// Se muestran todos los productos
// actualmente almacenados en el carrito.
//
// ==========================================

cart.items.forEach(
    (item, index) => {

message +=
    `${index + 1}️⃣ ${item.emoji} [${item.categoryName}]\n` +
    `${item.name}\n\n`;

    }
);

message +=
    "\n0️⃣ Volver al carrito\n\n" +
    "👇 Escribe el número del producto";

return message;

}

// ==========================================
// OPCIÓN 4
// INICIAR CHECKOUT
//
// Permite seleccionar:
//
// 1. Domicilio
// 2. Recoger en punto
//
// Estado siguiente:
//
// SELECTING_DELIVERY
//
// ==========================================

    if (text === "4") {

        sessionStorage.updateSession(
            userId,
            {
                state: "SELECTING_DELIVERY"
            }
        );

        return (
            "🚚━━━━━━━━━━━━🚚\n\n" +
            "1️⃣ 🏠 Domicilio\n\n" +
            "2️⃣ 🛍️ Recoger en punto"
        );

    }

// ==========================================
// OPCIÓN 0
// CANCELAR COMPRA
//
// Acciones:
//
// - Vaciar carrito
// - Reiniciar sesión
// - Regresar al menú principal
//
// ==========================================

if (text === "0") {

    cartService.clearCart(
        userId
    );

    sessionStorage.updateSession(
        userId,
        {
            state: "MAIN_MENU"
        }
    );

    return (
        "❌ Pedido cancelado.\n\n" +
        "🛒 El carrito fue vaciado correctamente.\n\n" +

        "🔥🍔 *RAPI CROCK'S* 🍔🔥\n\n" +

        "━━━━━━━━━━━━━━━━━━\n\n" +

        "1️⃣ 🍔 Ver Menú\n\n" +

        "2️⃣ 🛒 Ver Carrito\n\n" +

        "3️⃣ ✅ Finalizar Pedido\n\n" +

        "━━━━━━━━━━━━━━━━━━\n\n" +

        "👇 Responde con una opción"
    );

}

// ==========================================
// OPCIÓN NO RECONOCIDA
//
// Se ejecuta cuando el usuario
// envía una respuesta que no existe
// dentro del menú actual.
//
// Ejemplos:
//
// 8
// hola
// abc
//
// ==========================================

    return "❌ Opción no válida.";

}

// ==========================================
// API PÚBLICA DEL CARRITO
//
// Punto de entrada utilizado por el
// flujo principal de conversación.
//
// ==========================================

module.exports = {
    handleCart
};