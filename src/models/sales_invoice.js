const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

const Estado = require('../models/state');

/**
 * Creación del modelo Factura_Venta
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Cliente (customer.js),
 *              Modelo Metodo_Pago (payment_method.js),
 *              Modelo Tipo_Envio (shipping_type.js),
 *              Modelo Estado (state.js)
 */

const Factura_Venta = db.define('PRGADH_Factura_Venta', {
    NIT_Cliente: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Total_Factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Empleados',
            key: 'id'
        }
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Proveedors',
            key: 'id'
        }
    },
    ID_Metodo_Pago_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Metodo_Pagos',
            key: 'id'
        }
    },
    ID_Tipo_Envio_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Tipo_Envios',
            key: 'id'
        }
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Estados',
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Factura_Venta (sales_invoice.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Factura_Venta.hasOne(Estado, {
    foreignKey: 'ID_Estado_FK'
});

//Exportación del modelo Factura_Venta
module.exports = Factura_Venta;