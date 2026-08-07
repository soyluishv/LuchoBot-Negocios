const sessionStorage = require(
    "./storage/sessionStorage"
);

console.log("======================================");
console.log("👤 SESIÓN CLIENTE");
console.log("======================================");

const session1 =
    sessionStorage.getSession(
        "cliente-1"
    );

console.log(session1);

sessionStorage.updateSession(
    "cliente-1",
    {
        state: "VIEWING_MENU"
    }
);

const session2 =
    sessionStorage.getSession(
        "cliente-1"
    );

console.log(session2);

sessionStorage.clearSession(
    "cliente-1"
);

const session3 =
    sessionStorage.getSession(
        "cliente-1"
    );

console.log(session3);

console.log("======================================");