/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: orderSummaryTemplate.js
 * ==========================================
 */

const { getBusiness } = require(
    "../config/businessConfig"
);

const {
    formatCurrency
} = require(
    "./cartTemplate"
);

// ==========================================
// FORMATEAR RESUMEN DEL PEDIDO
// ==========================================

function formatOrderSummary(
    cart,
    checkout,
    subtotal,
    total
) {

    const business = getBusiness();

    if (!cart || !checkout) {

        return null;

    }

    const lines = [];

    lines.push("🧾 *RESUMEN DE TU PEDIDO*");
    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");

    // ======================================
    // PRODUCTOS
    // ======================================

    cart.items.forEach((item, index) => {

        const itemTotal =
            item.unitPrice * item.quantity;

        lines.push(
            `${index + 1}️⃣ ${item.quantity}x ${item.name}`
        );

        lines.push(
            `   ${formatCurrency(itemTotal)}`
        );

        lines.push("");

    });

    // ======================================
    // TOTALES
    // ======================================

    lines.push("━━━━━━━━━━━━━━━━━━━━━━");

    lines.push(
        `🛒 Subtotal: ${formatCurrency(subtotal)}`
    );

    if (checkout.deliveryType === "delivery") {

        lines.push(
            `🛵 Domicilio: ${formatCurrency(checkout.deliveryPrice)}`
        );

    } else {

        lines.push(
            "🏪 Recogida en punto: $0"
        );

    }

    lines.push(
        `💰 *TOTAL: ${formatCurrency(total)}*`
    );

    lines.push("━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");

    // ======================================
    // CLIENTE
    // ======================================

    lines.push(
        `👤 Cliente: ${checkout.customer.name}`
    );

    lines.push(
        `📱 Teléfono: ${checkout.customer.phone}`
    );

    // ======================================
    // ENTREGA
    // ======================================

    if (checkout.deliveryType === "delivery") {

        lines.push("");
        lines.push("🛵 *Entrega a domicilio*");

        lines.push(
            `📍 Dirección: ${checkout.customer.address}`
        );

        lines.push(
            `🏘️ Barrio/sector: ${checkout.customer.neighborhood}`
        );

        if (checkout.customer.notes) {

            lines.push(
                `📝 Indicaciones: ${checkout.customer.notes}`
            );

        }

        lines.push("");
        lines.push(
            "💵 Pago: Al recibir el pedido"
        );

    } else {

        lines.push("");
        lines.push("🏪 *Recoger en el punto*");

        lines.push(
            `📍 ${business.location.address}`
        );

        lines.push(
            `${business.location.city}, ${business.location.department}`
        );

        lines.push("");
        lines.push(
            "💵 Pago: En el punto"
        );

    }

    // ======================================
    // TIEMPO ESTIMADO
    // ======================================

    lines.push("");
    lines.push(
        `⏱️ Tiempo aproximado: ${business.orders.estimatedPreparationMinutes} minutos`
    );

    // ======================================
    // CONFIRMACIÓN
    // ======================================

    lines.push("");
    lines.push("━━━━━━━━━━━━━━━━━━━━━━");
    lines.push("");
    lines.push("¿Tu pedido está correcto?");
    lines.push("");
    lines.push("1️⃣ ✅ Confirmar pedido");
    lines.push("2️⃣ ✏️ Modificar pedido");
    lines.push("0️⃣ ❌ Cancelar pedido");

    return lines.join("\n");

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    formatOrderSummary

};