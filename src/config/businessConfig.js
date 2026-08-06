/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: businessConfig.js
 * ==========================================
 */

const path = require("path");

const business = require(
    path.join(__dirname, "../../data/business.json")
);

// ==========================================
// OBTENER CONFIGURACIÓN DEL NEGOCIO
// ==========================================

function getBusiness() {

    return business.business;

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getBusiness

};