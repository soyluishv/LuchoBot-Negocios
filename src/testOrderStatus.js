const {

    STATUS,

    getStatusLabel

} = require(
    "./services/order/orderStatus"
);

console.log("======================================");
console.log("📦 ESTADOS DE PEDIDOS");
console.log("======================================");

Object.values(STATUS).forEach(status => {

    console.log(
        `${status} -> ${getStatusLabel(status)}`
    );

});

console.log("======================================");