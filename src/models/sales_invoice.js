const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Factura_Venta
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Cliente (customer.js),
 *              Modelo Metodo_Pago (payment_method.js),
 *              Modelo Tipo_Envio (shipping_type.js)
 */

const Factura_Venta = db.define('Factura_Venta', {
    NIT_Cliente: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Total_Factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    Estado_Factura: { //Por le momento, luego hará referencia a la llave foránea
        type: DataTypes.STRING,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Empleados',
            key: 'id'
        }
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Proveedors',
            key: 'id'
        }
    },
    ID_Metodo_Pago_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Metodo_Pagos',
            key: 'id'
        }
    },
    ID_Tipo_Envio_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Tipo_Envios',
            key: 'id'
        }
    }
});

//Exportación del modelo Factura_Venta
module.exports = Factura_Venta;