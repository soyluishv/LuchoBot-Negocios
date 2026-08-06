/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: catalogService.js
 * ==========================================
 */

const path = require("path");

const catalog = require(
    path.join(__dirname, "../../../data/products.json")
);

// ==========================================
// OBTENER TODAS LAS CATEGORÍAS
// ==========================================

function getCategories() {

    return catalog.categories;

}

// ==========================================
// OBTENER CATEGORÍAS ACTIVAS
// ==========================================

function getActiveCategories() {

    return catalog.categories.filter(
        category => category.enabled
    );

}

// ==========================================
// OBTENER TODOS LOS PRODUCTOS
// ==========================================

function getProducts() {

    return catalog.products;

}

// ==========================================
// OBTENER PRODUCTOS ACTIVOS
// ==========================================

function getActiveProducts() {

    return catalog.products.filter(
        product => product.enabled
    );

}

// ==========================================
// PRODUCTOS POR CATEGORÍA
// ==========================================

function getProductsByCategory(categoryId) {

    return catalog.products.filter(
        product =>
            product.categoryId === categoryId &&
            product.enabled
    );

}

// ==========================================
// BUSCAR CATEGORÍA POR ID
// ==========================================

function getCategoryById(categoryId) {

    return catalog.categories.find(
        category => category.id === categoryId
    ) || null;

}

// ==========================================
// BUSCAR PRODUCTO POR ID
// ==========================================

function getProductById(productId) {

    return catalog.products.find(
        product => product.id === productId
    ) || null;

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getCategories,
    getActiveCategories,
    getProducts,
    getActiveProducts,
    getProductsByCategory,
    getCategoryById,
    getProductById

};