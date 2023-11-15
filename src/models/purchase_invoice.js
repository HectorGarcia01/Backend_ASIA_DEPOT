const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Empleado = require('../models/employee');
const Proveedor = require('../models/supplier');
const Estado = require('../models/employee');

/**
 * Creación del modelo Factura_Compra
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Proveedor (supplier.js)
 */

const Factura_Compra = db.define(`${NAME_PREFIX}_Factura_Compra`, {
    Total_Factura: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Empleados`,
            key: 'id'
        }
    },
    ID_Proveedor_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Proveedors`,
            key: 'id'
        }
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Factura_Compra (purchase_invoice.js)  -> muchos
 */ 

Empleado.hasMany(Factura_Compra, {
    foreignKey: 'ID_Empleado_FK',
    as: 'facturas_compras'
});

Factura_Compra.belongsTo(Empleado, {
    foreignKey: 'ID_Empleado_FK',
    as: 'empleado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Proveedor (supplier.js) -> uno
 *              Modelo Factura_Compra (purchase_invoice.js)  -> muchos
 */

Proveedor.hasMany(Factura_Compra, {
    foreignKey: 'ID_Proveedor_FK',
    as: 'facturas_compras'
});

Factura_Compra.belongsTo(Proveedor, {
    foreignKey: 'ID_Proveedor_FK',
    as: 'proveedor'
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Factura_Compra (purchase_invoice.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Factura_Compra, {
    foreignKey: 'ID_Estado_FK'
});

Factura_Compra.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

//Exportación del modelo Factura_Compra
module.exports = Factura_Compra;