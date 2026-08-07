const adminPanel = require(
    "./services/admin/adminPanelService"
);

console.log("======================================");
console.log("📦 PENDIENTES");
console.log("======================================");

console.log(
    adminPanel.processAdminMessage(
        "PENDIENTES"
    )
);

console.log("\n======================================");
console.log("📊 VENTAS");
console.log("======================================");

console.log(
    adminPanel.processAdminMessage(
        "VENTAS"
    )
);

console.log("\n======================================");
console.log("🔍 BUSCAR");
console.log("======================================");

console.log(
    adminPanel.processAdminMessage(
        "BUSCAR 0001"
    )
);

console.log("\n======================================");
console.log("🚚 ENCAMINO");
console.log("======================================");

console.log(
    adminPanel.processAdminMessage(
        "ENTREGADO 0001"
    )
);