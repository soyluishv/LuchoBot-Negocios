/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: cartTemplate.js
 * ==========================================
 */

// ==========================================
// FORMATEAR MONEDA
// ==========================================

function formatCurrency(value) {

    return `$${value.toLocaleString("es-CO")}`;

}

// ==========================================
// FORMATEAR CARRITO
// ==========================================

function formatCart(cart, subtotal) {

    if (!cart || cart.items.length === 0) {

        return `🛒 *TU CARRITO*

━━━━━━━━━━━━━━━━

Tu carrito está vacío.

🍔 Agrega productos para comenzar tu pedido.

━━━━━━━━━━━━━━━━`;

    }

const lines = [];

lines.push("🛒━━━━━━━━━━━🛒");
lines.push("");

lines.push("📋 *TU PEDIDO*");
lines.push("");

lines.push("━━━━━━━━━━━━");
lines.push("");

cart.items.forEach((item, index) => {

    const itemTotal =
        item.unitPrice * item.quantity;

lines.push(
    `${index + 1}️⃣ ${item.emoji} [${item.categoryName}]`
);

lines.push(
    `${item.name}`
);

lines.push("");

lines.push(
    `🔢 Cantidad: ${item.quantity}`
);

lines.push(
    `💵 Unitario: ${formatCurrency(item.unitPrice)}`
);

lines.push(
    `💰 Total: ${formatCurrency(itemTotal)}`
);

lines.push("");

});

lines.push("━━━━━━━━━━━━━");
lines.push("");

lines.push("💵 *SUBTOTAL*");
lines.push("");

lines.push(
    `${formatCurrency(subtotal)}`
);

lines.push("");

lines.push("━━━━━━━━━━━━━");
lines.push("");

lines.push("1️⃣ ➕ Agregar productos");
lines.push("");

lines.push("2️⃣ 🔢 Cambiar cantidad");
lines.push("");

lines.push("3️⃣ 🗑️ Eliminar producto");
lines.push("");

lines.push("4️⃣ ✅ Finalizar pedido");
lines.push("");

lines.push("━━━━━━━━━━━━━");
lines.push("");

lines.push("0️⃣ ❌ Cancelar pedido");

return lines.join("\n");

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    formatCart,
    formatCurrency

};