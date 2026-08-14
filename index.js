console.clear();

console.log(`
╔══════════════════════════════╗
║   🤖 LuchoBot Negocios       ║
║        Versión 1.0           ║
╚══════════════════════════════╝
`);

console.log("🚀 Iniciando WhatsApp...");

const BOT_START_TIME =
    Math.floor(Date.now() / 1000);

const wppconnect = require(
    "@wppconnect-team/wppconnect"
);

const customerHandler = require(
    "./src/handlers/customer/customerHandler"
);

const adminPanelService = require(
    "./src/services/admin/adminPanelService"
);

wppconnect.create({
    session: "LuchoBotNegocios",

    headless: false,

    devtools: false,

    useChrome: true,

    debug: false,

    logQR: false,

    disableWelcome: true
})

.then(async (client) => {
    global.whatsappClient = client;
    console.log(
        "✅ WhatsApp conectado"
    );

    client.onMessage(
        async (message) => {

if (
   !message.from ||
    message.isGroupMsg ||
    message.from === "status@broadcast" ||
    message.from.endsWith("@newsletter")
) {
    return;
}


if (
    message.timestamp &&
    message.timestamp < BOT_START_TIME
) {

    console.log(
        "⏭️ Mensaje antiguo ignorado"
    );

    return;

}

console.log(
    "===================="
);

            console.log(
                "FROM:",
                message.from
            );

            const phone =
                message.from
                    .replace("@c.us", "")
                    .replace("@lid", "")
                    .replace("57", "");

            console.log(
                "PHONE:",
                phone
            );

            console.log(
                "BODY:",
                message.body
            );

            console.log(
                "===================="
            );

            let response;

            if (
                phone === "33286130770090"
            ) {

                console.log(
                    "ADMIN DETECTADO"
                );

const adminCommands = [
    "PENDIENTES",
    "VENTAS",
    "HISTORIAL",
    "BUSCAR",
    "OK",
    "CANCELAR",
    "AYUDA"
];

                const adminText =
                    message.body
                        .trim()
                        .toUpperCase();

                const isAdminCommand =
                    adminCommands.some(
                            command =>
                            adminText.startsWith(
                                command
                            )
                        );

                if (isAdminCommand) {

                        console.log(
                            "COMANDO ADMIN:",
                            adminText
                        );

                        response =
                            adminPanelService.processAdminMessage(
                                adminText
                            );

                    console.log(
                        "RESPUESTA ADMIN:"
                    );

                    console.log(
                        response
                    );

                } else {

                    response =
                        customerHandler.processCustomerMessage(
                            message.from,
                            message.body
                        );

                }

            } else {

                response =
                    customerHandler.processCustomerMessage(
                        message.from,
                        message.body
                    );

            }

            if (response) {

                    const responseText =
                        typeof response === "string"
                            ? response
                            : response.message;

            if (
                            responseText &&
                            responseText.trim() !== ""
                       ) {

        await client.sendText(
            message.from,
            responseText
        );

    }

}

        }
    );

})
.catch((error) => {

    console.error(
        "❌ Error:",
        error
    );

});