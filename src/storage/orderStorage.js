/**
 * ==========================================
 * LuchoBot Negocios
 * Versión: 1.0.0
 * Archivo: orderStorage.js
 * Módulo: Persistencia de Pedidos
 *
 * Descripción:
 * Gestiona el almacenamiento físico
 * de los pedidos en orders.json.
 *
 * Responsabilidades:
 * - Crear archivo de pedidos
 * - Leer pedidos almacenados
 * - Guardar pedidos
 * - Actualizar pedidos
 * - Generar consecutivos
 * - Consultar historial
 *
 * Tipo de almacenamiento:
 * JSON local (sin base de datos)
 *
 * Archivo utilizado:
 * data/orders/orders.json
 *
 * Futuras mejoras:
 * - SQLite
 * - MySQL
 * - PostgreSQL
 * - MongoDB
 *
 * ==========================================
 */

// ==========================================
// DEPENDENCIAS DEL SISTEMA
//
// Módulos nativos de Node.js utilizados
// para manejar archivos y directorios.
// ==========================================

const fs = require("fs");
const path = require("path");

// ==========================================
// RUTAS DE ALMACENAMIENTO
//
// Define la ubicación física donde
// se guardan los pedidos del sistema.
//
// Estructura:
//
// data/
// └── orders/
//     └── orders.json
//
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
// INICIALIZAR ALMACENAMIENTO
//
// Verifica:
//
// 1. Que exista la carpeta orders
// 2. Que exista orders.json
//
// Si no existen,
// se crean automáticamente.
//
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
// LEER BASE DE DATOS JSON
//
// Obtiene toda la información almacenada
// en orders.json.
//
// También valida la estructura para evitar
// corrupción de datos.
//
// Retorna:
//
// {
//   lastOrderNumber,
//   orders
// }
//
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
// ESCRIBIR BASE DE DATOS JSON
//
// Guarda completamente la estructura
// de pedidos en disco.
//
// Cada modificación del sistema termina
// pasando por esta función.
//
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
// GENERAR CONSECUTIVO DE PEDIDO
//
// Incrementa el contador interno y genera
// el siguiente número disponible.
//
// Ejemplos:
//
// 0001
// 0002
// 0003
//
// Garantiza que no existan números
// repetidos.
//
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
// REGISTRAR NUEVO PEDIDO
// Propósito:
// Guardar un pedido confirmado en el historial.
//
// Uso:
// Se ejecuta cuando el cliente confirma
// definitivamente una compra.
//
// Entrada:
// order
//
// Salida:
// Pedido guardado
// ==========================================

function saveOrder(order) {

    const data = readData();

    data.orders.push(order);

    writeData(data);

    return order;

}

// ==========================================
// BUSCAR PEDIDO POR NÚMERO
//
// Permite localizar un pedido específico.
//
// Entrada:
//
// orderNumber
//
// Retorna:
//
// Pedido encontrado
// o
// null
//
// ==========================================

function findOrder(orderNumber) {

    const data = readData();

    return data.orders.find(
        order =>
            order.orderNumber === orderNumber
    ) || null;

}

// ==========================================
// ACTUALIZAR INFORMACIÓN DE PEDIDO
//
// Permite modificar:
//
// - Estado
// - Datos adicionales
// - Fecha actualización
//
// Utilizado principalmente por
// el panel administrativo.
//
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
// CONSULTAR HISTORIAL COMPLETO
//
// Devuelve todos los pedidos
// almacenados en el sistema.
//
// ==========================================

function getAllOrders() {

    return readData().orders;

}

// ==========================================
// HISTORIAL DE CLIENTE
//
// Obtiene todos los pedidos asociados
// a un usuario específico.
//
// Permite futuras funcionalidades:
//
// - Clientes frecuentes
// - Fidelización
// - Estadísticas
// - Historial personal
//
// ==========================================

function getOrdersByUser(userId) {

    return getAllOrders().filter(
        order =>
            order.userId === userId
    );

}

// ==========================================
// API PÚBLICA DEL ALMACENAMIENTO
//
// Funciones disponibles para lectura,
// escritura y actualización de pedidos.
//
// ==========================================

module.exports = {

    getNextOrderNumber,
    saveOrder,
    findOrder,
    updateOrder,
    getAllOrders,
    getOrdersByUser

};