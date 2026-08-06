/**
 * ==========================================
 * LuchoBot Negocios
 * Prueba de datos del cliente
 * ==========================================
 */

const cartService = require(
    "./services/cart/cartService"
);

const checkoutService = require(
    "./services/checkout/checkoutService"
);

const customerDataService = require(
    "./services/checkout/customerDataService"
);

// ==========================================
// CLIENTES DE PRUEBA
// ==========================================

const clienteDomicilio = "cliente-datos-domicilio";
const clienteRecoge = "cliente-datos-recoge";

// ==========================================
// LIMPIAR PRUEBAS ANTERIORES
// ==========================================

cartService.clearCart(clienteDomicilio);
cartService.clearCart(clienteRecoge);

checkoutService.cancelCheckout(clienteDomicilio);
checkoutService.cancelCheckout(clienteRecoge);

// ==========================================
// PREPARAR CARRITOS
// ==========================================

cartService.addProduct(
    clienteDomicilio,
    "HAM001",
    1
);

cartService.addProduct(
    clienteRecoge,
    "PER001",
    1
);

// ==========================================
// CREAR CHECKOUTS
// ==========================================

checkoutService.createCheckout(
    clienteDomicilio
);

checkoutService.selectDelivery(
    clienteDomicilio
);

checkoutService.createCheckout(
    clienteRecoge
);

checkoutService.selectPickup(
    clienteRecoge
);

// ==========================================
// CLIENTE A DOMICILIO
// ==========================================

console.log("======================================");
console.log("🛵 CLIENTE A DOMICILIO");
console.log("======================================");

customerDataService.setName(
    clienteDomicilio,
    "Juan Pérez"
);

customerDataService.setPhone(
    clienteDomicilio,
    "3001234567"
);

// Todavía NO agregamos dirección ni barrio.

let validation =
    customerDataService.validateCustomerData(
        clienteDomicilio
    );

console.log(
    `Sin dirección: ${
        validation.ok
            ? "❌ No debería ser válido"
            : "✅ Rechazado correctamente"
    }`
);

console.log(
    `Campo faltante: ${validation.field}`
);

// Ahora completamos los datos.

customerDataService.setAddress(
    clienteDomicilio,
    "Carrera 50 # 130 Sur 20"
);

customerDataService.setNeighborhood(
    clienteDomicilio,
    "La Playita"
);

customerDataService.setNotes(
    clienteDomicilio,
    "Casa de rejas negras"
);

validation =
    customerDataService.validateCustomerData(
        clienteDomicilio
    );

console.log(
    `Datos completos: ${
        validation.ok
            ? "✅ Válidos"
            : "❌ Inválidos"
    }`
);

// ==========================================
// CLIENTE RECOGE EN PUNTO
// ==========================================

console.log("");
console.log("======================================");
console.log("🏪 CLIENTE RECOGE EN PUNTO");
console.log("======================================");

customerDataService.setName(
    clienteRecoge,
    "Carlos Gómez"
);

customerDataService.setPhone(
    clienteRecoge,
    "3109876543"
);

// No ponemos dirección ni barrio.

const pickupValidation =
    customerDataService.validateCustomerData(
        clienteRecoge
    );

console.log(
    `Sin dirección: ${
        pickupValidation.ok
            ? "✅ Permitido correctamente"
            : "❌ No debería exigir dirección"
    }`
);

// ==========================================
// VALIDACIONES AUTOMÁTICAS
// ==========================================

console.log("");
console.log("======================================");
console.log("🧪 RESULTADO DE PRUEBAS");
console.log("======================================");

let errors = 0;

const domicilioFinal =
    customerDataService.validateCustomerData(
        clienteDomicilio
    );

if (domicilioFinal.ok) {

    console.log(
        "✅ Datos de domicilio completos"
    );

} else {

    console.log(
        "❌ Datos de domicilio inválidos"
    );

    errors++;

}

if (pickupValidation.ok) {

    console.log(
        "✅ Recogida no exige dirección"
    );

} else {

    console.log(
        "❌ Recogida está exigiendo datos innecesarios"
    );

    errors++;

}

const checkoutDomicilio =
    checkoutService.getCheckout(
        clienteDomicilio
    );

if (
    checkoutDomicilio.customer.address ===
        "Carrera 50 # 130 Sur 20" &&
    checkoutDomicilio.customer.neighborhood ===
        "La Playita"
) {

    console.log(
        "✅ Dirección y barrio almacenados correctamente"
    );

} else {

    console.log(
        "❌ Error almacenando dirección o barrio"
    );

    errors++;

}

// ==========================================
// RESULTADO FINAL
// ==========================================

console.log("");
console.log("======================================");

if (errors === 0) {

    console.log(
        "✅ DATOS DEL CLIENTE VALIDADOS CORRECTAMENTE"
    );

} else {

    console.log(
        `❌ DATOS DEL CLIENTE CON ${errors} ERROR(ES)`
    );

}

console.log("======================================");