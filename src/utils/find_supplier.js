const SupplierModel = require('../models/supplier');
const StateModel = require('../models/state');

/**
 * Función para buscar un proveedor por su id
 * Fecha creación: 02/10/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js)
 *              Modelo Estado (state.js)
 */

const findSupplier = async (id) => {
    const supplier = await SupplierModel.findByPk(id, {
        include: {
            model: StateModel,
            as: 'estado',
            attributes: ['id', 'Tipo_Estado']
        }
    });

    if (!supplier) {
        const error = new Error("Proveedor no encontrado.");
        error.status = 404;
        throw error;
    }

    return supplier;
};

//Exportación de la función para buscar un proveedor
module.exports = findSupplier;