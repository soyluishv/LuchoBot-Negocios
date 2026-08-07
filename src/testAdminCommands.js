const adminService = require(
    "./services/admin/adminCommandService"
);

console.log("======================================");
console.log("👨‍💼 PRUEBA ADMIN");
console.log("======================================");

const result1 =
    adminService.processAdminCommand(
        "ENCAMINO 0001"
    );

console.log(
    result1.message
);

const result2 =
    adminService.processAdminCommand(
        "ENTREGADO 0002"
    );

console.log(
    result2.message
);

console.log("======================================");