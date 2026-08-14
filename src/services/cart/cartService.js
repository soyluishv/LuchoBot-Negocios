/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: cartService.js
 * Módulo: Carrito de Compras
 *
 * Descripción:
 * Gestiona los productos seleccionados
 * por cada cliente antes de confirmar
 * un pedido.
 *
 * Responsabilidades:
 * - Crear carritos
 * - Agregar productos
 * - Modificar cantidades
 * - Eliminar productos
 * - Calcular subtotal
 * - Contar unidades
 * - Vaciar carrito
 *
 * Tipo de almacenamiento:
 * Memoria RAM (Map)
 *
 * Importante:
 * Los carritos son temporales y se
 * eliminan al confirmar o cancelar
 * una compra.
 *
 * Adaptable para:
 * - Restaurantes
 * - Zapaterías
 * - Tiendas de ropa
 * - Cosméticos
 * - Catálogos generales
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL SISTEMA
//
// Servicios utilizados para consultar
// productos y categorías del catálogo.
//
// ==========================================

const catalogService = require(
    "../catalog/catalogService"
);

// ==========================================
// ALMACENAMIENTO TEMPORAL DE CARRITOS
//
// Estructura:
//
// Map<userId, cart>
//
// Cada usuario posee un carrito
// independiente durante su compra.
//
// Los datos permanecen en memoria
// hasta confirmar o cancelar.
//
// ==========================================

const carts = new Map();

// ==========================================
// OBTENER O CREAR CARRITO
//
// Propósito:
//
// Recuperar el carrito activo del
// cliente.
//
// Si no existe, se crea automáticamente.
//
// Entrada:
//
// userId
//
// Retorna:
//
// {
//   userId,
//   items,
//   createdAt,
//   updatedAt
// }
//
// ==========================================

function getCart(userId) {

    if (!carts.has(userId)) {

        carts.set(userId, {
            userId,
            items: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        });

    }

    return carts.get(userId);

}

// ==========================================
// AGREGAR PRODUCTO AL CARRITO
//
// Flujo:
//
// 1. Validar producto
// 2. Validar cantidad
// 3. Buscar carrito
// 4. Verificar si ya existe
// 5. Agregar o acumular cantidad
//
// Si el producto ya existe,
// aumenta la cantidad.
//
// Si no existe,
// crea una nueva línea.
//
// ==========================================

function addProduct(userId, productId, quantity = 1) {

    const product =
        catalogService.getProductById(productId);

    if (!product || !product.enabled) {

        return {
            ok: false,
            message: "Producto no disponible."
        };

    }

    if (
        !Number.isInteger(quantity) ||
        quantity <= 0
    ) {

        return {
            ok: false,
            message: "Cantidad inválida."
        };

    }

    const cart = getCart(userId);

    const existingItem = cart.items.find(
        item => item.productId === productId
    );

    if (existingItem) {

        existingItem.quantity += quantity;

    } else {

// ==========================================
// CONSTRUIR ITEM DEL CARRITO
//
// Se almacena una copia básica del
// producto para evitar depender del
// catálogo posteriormente.
//
// ==========================================

const category =
    catalogService.getCategoryById(
        product.categoryId
    );

    cart.items.push({
        productId: product.id,
        categoryId: product.categoryId,
        categoryName: category?.name || "",
        emoji: category?.emoji || "🍔",
        name: product.name,
        unitPrice: product.price,
        quantity
    });

}

    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// MODIFICAR CANTIDAD DE PRODUCTO
//
// Permite aumentar o disminuir la
// cantidad de un producto existente.
//
// Regla:
//
// Si la cantidad es 0,
// el producto será eliminado.
//
// ==========================================

function setQuantity(userId, productId, quantity) {

    const cart = getCart(userId);

    const item = cart.items.find(
        currentItem =>
            currentItem.productId === productId
    );

    if (!item) {

        return {
            ok: false,
            message: "El producto no está en el carrito."
        };

    }

    if (
        !Number.isInteger(quantity) ||
        quantity < 0
    ) {

        return {
            ok: false,
            message: "Cantidad inválida."
        };

    }

    if (quantity === 0) {

        return removeProduct(
            userId,
            productId
        );

    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// ELIMINAR PRODUCTO DEL CARRITO
//
// Remueve completamente un producto
// seleccionado por el cliente.
//
// ==========================================

function removeProduct(userId, productId) {

    const cart = getCart(userId);

    const index = cart.items.findIndex(
        item => item.productId === productId
    );

    if (index === -1) {

        return {
            ok: false,
            message: "El producto no está en el carrito."
        };

    }

    cart.items.splice(index, 1);
    cart.updatedAt = Date.now();

    return {
        ok: true,
        cart
    };

}

// ==========================================
// CALCULAR SUBTOTAL DE COMPRA
//
// Suma:
//
// precio × cantidad
//
// de todos los productos del carrito.
//
// No incluye:
//
// - Domicilio
// - Impuestos futuros
//
// ==========================================

function getSubtotal(userId) {

    const cart = getCart(userId);

    return cart.items.reduce(
        (total, item) =>
            total +
            (item.unitPrice * item.quantity),
        0
    );

}

// ==========================================
// CONTAR PRODUCTOS DEL CARRITO
//
// Calcula la cantidad total de
// unidades agregadas por el cliente.
//
// Ejemplo:
//
// 2 Hamburguesas
// 3 Gaseosas
//
// Resultado:
//
// 5 unidades
//
// ==========================================

function getItemCount(userId) {

    const cart = getCart(userId);

    return cart.items.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}

// ==========================================
// VERIFICAR CARRITO VACÍO
//
// Retorna:
//
// true  -> Sin productos
// false -> Con productos
//
// ==========================================

function isEmpty(userId) {

    return getCart(userId).items.length === 0;

}

// ==========================================
// ELIMINAR CARRITO COMPLETO
//
// Utilizado cuando:
//
// - Se confirma un pedido
// - Se cancela una compra
//
// Libera memoria y permite iniciar
// una nueva compra.
//
// ==========================================

function clearCart(userId) {

    carts.delete(userId);

    return {
        ok: true
    };

}

// ==========================================
// API PÚBLICA DEL CARRITO
//
// Funciones disponibles para que
// otros módulos gestionen compras.
//
// ==========================================
module.exports = {

    getCart,
    addProduct,
    setQuantity,
    removeProduct,
    getSubtotal,
    getItemCount,
    isEmpty,
    clearCart

};