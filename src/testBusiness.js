/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba de configuración
 * ==========================================
 */

const { getBusiness } = require("./config/businessConfig");

const business = getBusiness();

console.log("======================================");
console.log("🍔 LuchoBot Negocios");
console.log("======================================");

console.log(`🏪 Negocio: ${business.name}`);
console.log(`📱 WhatsApp: ${business.contact.whatsapp}`);

console.log(
    `📍 Dirección: ${business.location.address}, ` +
    `${business.location.city}, ${business.location.department}`
);

console.log(
    `⏱️ Preparación: ${business.orders.estimatedPreparationMinutes} minutos`
);

console.log(
    `🛵 Domicilio: $${business.delivery.fixedPrice.toLocaleString("es-CO")}`
);

console.log(
    `🏪 Recoger en punto: ${business.pickup.enabled ? "Sí" : "No"}`
);

console.log("======================================");