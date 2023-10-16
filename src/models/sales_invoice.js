const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Empleado = require('../models/employee');
const Cliente = require('../models/customer');
const Metodo_Pago = require('../models/payment_method');
const Tipo_Envio = require('../models/shipping_type');
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

const Factura_Venta = db.define(`${NAME_PREFIX}_Factura_Venta`, {
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
            model: `${NAME_PREFIX}_Empleados`,
            key: 'id'
        }
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Proveedors`,
            key: 'id'
        }
    },
    ID_Metodo_Pago_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Metodo_Pagos`,
            key: 'id'
        }
    },
    ID_Tipo_Envio_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Tipo_Envios`,
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
 *              Modelo Factura_Venta (sales_invoice.js)  -> muchos
 */

Empleado.hasMany(Factura_Venta, {
    foreignKey: 'ID_Empleado_FK',
    as: 'facturas_venta'
});

Factura_Venta.belongsTo(Empleado, {
    foreignKey: 'ID_Empleado_FK',
    as: 'empleado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (customer.js) -> uno
 *              Modelo Factura_Venta (sales_invoice.js)  -> muchos
 */

Cliente.hasMany(Factura_Venta, {
    foreignKey: 'ID_Cliente_FK',
    as: 'facturas_venta'
});

Factura_Venta.belongsTo(Cliente, {
    foreignKey: 'ID_Cliente_FK',
    as: 'cliente'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Metodo_Pago (payment_method.js) -> uno
 *              Modelo Factura_Venta (sales_invoice.js)  -> muchos
 */

Metodo_Pago.hasMany(Factura_Venta, {
    foreignKey: 'ID_Metodo_Pago_FK',
    as: 'facturas_venta'
});

Factura_Venta.belongsTo(Metodo_Pago, {
    foreignKey: 'ID_Metodo_Pago_FK',
    as: 'metodo_pago'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Tipo_Envio (shipping_type.js) -> uno
 *              Modelo Factura_Venta (sales_invoice.js)  -> muchos
 */

Tipo_Envio.hasMany(Factura_Venta, {
    foreignKey: 'ID_Tipo_Envio_FK',
    as: 'facturas_venta'
});

Factura_Venta.belongsTo(Tipo_Envio, {
    foreignKey: 'ID_Tipo_Envio_FK',
    as: 'tipo_envio'
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Factura_Venta (sales_invoice.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Factura_Venta, {
    foreignKey: 'ID_Estado_FK'
});

Factura_Venta.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

//Exportación del modelo Factura_Venta
module.exports = Factura_Venta;