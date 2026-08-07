/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: orderStorage.js
 * ==========================================
 */

const fs = require("fs");
const path = require("path");

// ==========================================
// ARCHIVO DE PEDIDOS
// ==========================================

const storageDirectory = path.join(
    __dirname,
    "../../data/orders"
);

const ordersFile = path.join(
    storageDirectory,
    "orders.json"
);

// ==========================================
// ASEGURAR ALMACENAMIENTO
// ==========================================

function ensureStorage() {

    if (!fs.existsSync(storageDirectory)) {

        fs.mkdirSync(
            storageDirectory,
            {
                recursive: true
            }
        );

    }

    if (!fs.existsSync(ordersFile)) {

        const initialData = {
            lastOrderNumber: 0,
            orders: []
        };

        fs.writeFileSync(
            ordersFile,
            JSON.stringify(
                initialData,
                null,
                2
            ),
            "utf8"
        );

    }

}

// ==========================================
// LEER DATOS
// ==========================================

function readData() {

    ensureStorage();

    try {

        const content = fs.readFileSync(
            ordersFile,
            "utf8"
        );

        const data = JSON.parse(content);

        if (
            typeof data.lastOrderNumber !== "number" ||
            !Array.isArray(data.orders)
        ) {

            throw new Error(
                "Estructura de almacenamiento inválida."
            );

        }

        return data;

    } catch (error) {

        console.error(
            "❌ Error leyendo pedidos:",
            error.message
        );

        throw error;

    }

}

// ==========================================
// GUARDAR DATOS
// ==========================================

function writeData(data) {

    ensureStorage();

    fs.writeFileSync(
        ordersFile,
        JSON.stringify(
            data,
            null,
            2
        ),
        "utf8"
    );

}

// ==========================================
// OBTENER SIGUIENTE NÚMERO
// ==========================================

function getNextOrderNumber() {

    const data = readData();

    data.lastOrderNumber++;

    writeData(data);

    return String(
        data.lastOrderNumber
    ).padStart(4, "0");

}

// ==========================================
// GUARDAR PEDIDO
// ==========================================

function saveOrder(order) {

    const data = readData();

    data.orders.push(order);

    writeData(data);

    return order;

}

// ==========================================
// BUSCAR PEDIDO
// ==========================================

function findOrder(orderNumber) {

    const data = readData();

    return data.orders.find(
        order =>
            order.orderNumber === orderNumber
    ) || null;

}

// ==========================================
// ACTUALIZAR PEDIDO
// ==========================================

function updateOrder(orderNumber, updatedFields) {

    const data = readData();

    const index = data.orders.findIndex(
        order =>
            order.orderNumber === orderNumber
    );

    if (index === -1) {

        return null;

    }

    data.orders[index] = {

        ...data.orders[index],

        ...updatedFields,

        updatedAt: Date.now()

    };

    writeData(data);

    return data.orders[index];

}

// ==========================================
// OBTENER TODOS
// ==========================================

function getAllOrders() {

    return readData().orders;

}

// ==========================================
// PEDIDOS POR USUARIO
// ==========================================

function getOrdersByUser(userId) {

    return getAllOrders().filter(
        order =>
            order.userId === userId
    );

}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

    getNextOrderNumber,
    saveOrder,
    findOrder,
    updateOrder,
    getAllOrders,
    getOrdersByUser

};