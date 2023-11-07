const PaymentMethodModel = require('../models/payment_method');
const ShippingTypeModel = require('../models/shipping_type');

/**
 * Función para buscar el método de pago
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const findPaymentMethod = async (id) => {
    const payment_method = await PaymentMethodModel.findByPk(id);

    if (!payment_method) {
        const error = new Error("Método de pago no encontrado.");
        error.status = 404;
        throw error;
    }

    return payment_method;
};

/**
 * Función para buscar el tipo de envío
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Estado (state.js)
 */

const findShippingType = async (id) => {
    const shipping_type = await ShippingTypeModel.findByPk(id);

    if (!shipping_type) {
        const error = new Error("Tipo de envío no encontrado.");
        error.status = 404;
        throw error;
    }

    return shipping_type;
};

//Exportación de la función para buscar la información de envío
module.exports = {
    findPaymentMethod,
    findShippingType
};