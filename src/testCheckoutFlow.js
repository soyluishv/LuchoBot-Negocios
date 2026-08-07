const cartService = require(
    "./services/cart/cartService"
);

const checkoutService = require(
    "./services/checkout/checkoutService"
);

const customerDataService = require(
    "./services/checkout/customerDataService"
);

const orderService = require(
    "./services/order/orderService"
);

console.log("======================================");
console.log("🛒 FLUJO COMPLETO");
console.log("======================================");

// Producto al carrito

cartService.addProduct(
    "cliente-1",
    "HAM002",
    2
);

// Crear checkout

checkoutService.createCheckout(
    "cliente-1"
);

// Domicilio

checkoutService.selectDelivery(
    "cliente-1"
);

// Datos cliente

customerDataService.setName(
    "cliente-1",
    "Luis Alberto"
);

customerDataService.setPhone(
    "cliente-1",
    "3001234567"
);

customerDataService.setAddress(
    "cliente-1",
    "Calle 123 #45-67"
);

customerDataService.setNeighborhood(
    "cliente-1",
    "Caldas"
);

// Confirmar pedido

const result =
    orderService.confirmOrder(
        "cliente-1"
    );

console.log(result);

console.log("\n======================================");
console.log("🛒 CARRITO DESPUÉS DEL PEDIDO");
console.log("======================================");

console.log(
    cartService.getCart(
        "cliente-1"
    )
);