/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: customerDataService.js
 * Módulo: Datos del Cliente
 *
 * Descripción:
 * Gestiona la captura, validación y
 * almacenamiento temporal de los datos
 * del cliente durante el proceso de compra.
 *
 * Responsabilidades:
 * - Guardar nombre
 * - Guardar teléfono
 * - Guardar dirección
 * - Guardar barrio
 * - Guardar observaciones
 * - Validar datos requeridos
 *
 * Tipo de almacenamiento:
 * Temporal (checkout activo)
 *
 * Importante:
 * Este módulo NO guarda pedidos.
 *
 * Solamente administra los datos del
 * cliente mientras se completa el checkout.
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL SISTEMA
//
// Servicios utilizados para acceder
// al checkout activo del cliente.
//
// ==========================================

const checkoutService = require(
    "./checkoutService"
);

// ==========================================
// LIMPIAR Y NORMALIZAR TEXTO
//
// Elimina:
//
// - Espacios iniciales
// - Espacios finales
//
// Evita almacenar datos inconsistentes.
//
// Ejemplo:
//
// "   Luis   "
//
// Resultado:
//
// "Luis"
//
// ==========================================

function normalizeText(value) {

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();

}

// ==========================================
// REGISTRAR NOMBRE DEL CLIENTE
//
// Valida y almacena el nombre que será
// utilizado para identificar el pedido.
//
// Campo obligatorio.
//
// ==========================================

function setName(userId, name) {

    const checkout =
        checkoutService.getCheckout(userId);

    const cleanName = normalizeText(name);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (cleanName.length < 2) {

        return {
            ok: false,
            message: "El nombre no es válido."
        };

    }

    checkout.customer.name = cleanName;
    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// REGISTRAR TELÉFONO DEL CLIENTE
//
// Permite almacenar el número de contacto
// para confirmar pedidos o resolver
// novedades.
//
// Campo obligatorio.
//
// ==========================================

function setPhone(userId, phone) {

    const checkout =
        checkoutService.getCheckout(userId);

    const cleanPhone = normalizeText(phone);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (cleanPhone.length < 7) {

        return {
            ok: false,
            message: "El teléfono no es válido."
        };

    }

    checkout.customer.phone = cleanPhone;
    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// REGISTRAR DIRECCIÓN DE ENTREGA
//
// Utilizada únicamente cuando el cliente
// selecciona domicilio.
//
// Campo obligatorio para delivery.
//
// ==========================================

function setAddress(userId, address) {

    const checkout =
        checkoutService.getCheckout(userId);

    const cleanAddress = normalizeText(address);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (cleanAddress.length < 5) {

        return {
            ok: false,
            message: "La dirección no es válida."
        };

    }

    checkout.customer.address = cleanAddress;
    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// REGISTRAR BARRIO O SECTOR
//
// Permite identificar la zona donde será
// entregado el pedido.
//
// Campo obligatorio para delivery.
//
// ==========================================

function setNeighborhood(userId, neighborhood) {

    const checkout =
        checkoutService.getCheckout(userId);

    const cleanNeighborhood =
        normalizeText(neighborhood);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    if (cleanNeighborhood.length < 2) {

        return {
            ok: false,
            message: "El barrio o sector no es válido."
        };

    }

    checkout.customer.neighborhood =
        cleanNeighborhood;

    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// REGISTRAR OBSERVACIONES DEL PEDIDO
//
// Ejemplos:
//
// - Sin cebolla
// - Sin tomate
// - Poco picante
// - Llamar al llegar
//
// Campo opcional.
//
// ==========================================

function setNotes(userId, notes) {

    const checkout =
        checkoutService.getCheckout(userId);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    checkout.customer.notes =
        normalizeText(notes);

    checkout.updatedAt = Date.now();

    return {
        ok: true,
        checkout
    };

}

// ==========================================
// CONSULTAR DATOS DEL CLIENTE
//
// Obtiene la información almacenada
// durante el checkout actual.
//
// Retorna:
//
// {
//   name,
//   phone,
//   address,
//   neighborhood,
//   notes
// }
//
// ==========================================

function getCustomerData(userId) {

    const checkout =
        checkoutService.getCheckout(
            userId
        );

    if (!checkout) {

        return null;

    }

    return checkout.customer;

}

// ==========================================
// VALIDAR INFORMACIÓN DEL CLIENTE
//
// Verifica que todos los campos
// obligatorios estén completos.
//
// Reglas:
//
// Recoger en punto:
//
// ✔ Nombre
// ✔ Teléfono
//
// Domicilio:
//
// ✔ Nombre
// ✔ Teléfono
// ✔ Dirección
// ✔ Barrio
//
// ==========================================

function validateCustomerData(userId) {

    const checkout =
        checkoutService.getCheckout(userId);

    if (!checkout) {

        return {
            ok: false,
            message: "No existe un checkout activo."
        };

    }

    const customer = checkout.customer;

    if (!customer.name) {

        return {
            ok: false,
            field: "name",
            message: "Falta el nombre."
        };

    }

    if (!customer.phone) {

        return {
            ok: false,
            field: "phone",
            message: "Falta el teléfono."
        };

    }

// ==========================================
// VALIDACIONES ESPECÍFICAS PARA DOMICILIO
//
// Dirección y barrio únicamente son
// obligatorios cuando el cliente solicita
// entrega a domicilio.
//
// ==========================================

    if (checkout.deliveryType === "delivery") {

        if (!customer.address) {

            return {
                ok: false,
                field: "address",
                message: "Falta la dirección."
            };

        }

        if (!customer.neighborhood) {

            return {
                ok: false,
                field: "neighborhood",
                message: "Falta el barrio o sector."
            };

        }

    }

    return {
        ok: true
    };

}

// ==========================================
// API PÚBLICA DE DATOS DEL CLIENTE
//
// Funciones disponibles para captura,
// consulta y validación de información.
//
// ==========================================

module.exports = {

    setName,
    setPhone,
    setAddress,
    setNeighborhood,
    setNotes,
    getCustomerData,
    validateCustomerData

};