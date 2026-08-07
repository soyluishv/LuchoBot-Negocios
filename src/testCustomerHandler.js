const customerHandler = require(
    "./handlers/customer/customerHandler"
);

console.log("======================================");
console.log("👤 CLIENTE");
console.log("======================================");

console.log(
    customerHandler.processCustomerMessage(
        "cliente-1",
        "hola"
    )
);

console.log("\n======================================");

console.log(
    customerHandler.processCustomerMessage(
        "cliente-1",
        "1"
    )
);

console.log("\n======================================");

console.log(
    customerHandler.processCustomerMessage(
        "cliente-1",
        "0"
    )
);