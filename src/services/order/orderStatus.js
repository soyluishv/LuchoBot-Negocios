/**
 * ==========================================
 * Estados de pedidos
 * ==========================================
 */

const STATUS = {

    CONFIRMED: "confirmed",

    PREPARING: "preparing",

    ON_THE_WAY: "on_the_way",

    DELIVERED: "delivered",

    CANCELLED: "cancelled"

};

function getStatusLabel(status) {

    switch (status) {

        case STATUS.CONFIRMED:
            return "Confirmado";

        case STATUS.PREPARING:
            return "En preparación";

        case STATUS.ON_THE_WAY:
            return "En camino";

        case STATUS.DELIVERED:
            return "Entregado";

        case STATUS.CANCELLED:
            return "Cancelado";

        default:
            return "Desconocido";

    }

}

module.exports = {

    STATUS,

    getStatusLabel

};