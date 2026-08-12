/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: customerDataService.js
 * ==========================================
 */

const checkoutService = require(
    "./checkoutService"
);

// ==========================================
// NORMALIZAR TEXTO
// ==========================================

function normalizeText(value) {

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();

}

// ==========================================
// GUARDAR NOMBRE
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
// GUARDAR TELÉFONO
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
// GUARDAR DIRECCIÓN
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
// GUARDAR BARRIO / SECTOR
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
// GUARDAR INDICACIONES
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
// OBTENER DATOS DEL CLIENTE
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
// VALIDAR DATOS REQUERIDOS
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

    // Dirección y barrio solamente son
    // obligatorios cuando es domicilio.

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
// EXPORTAR
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