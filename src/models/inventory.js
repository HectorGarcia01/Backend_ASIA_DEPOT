const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const Empleado = require('../models/employee');
const Producto = require('../models/product');

/**
 * Creación del modelo Inventario
 * Fecha creación: 12/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const Inventario = db.define('PRGADH_Inventario', {
    Tipo_Movimiento: {
        type: DataTypes.STRING(6),
        allowNull: false,
        values: ['Compra', 'Venta', 'Ajuste']
    },
    Cantidad_Movimiento: {
        type: DataTypes.INTEGER,
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
    ID_Producto_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'PRGADH_Productos',
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
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Empleado.hasMany(Inventario, {
    foreignKey: 'ID_Departamento_FK',
    as: 'inventarios'
});

Inventario.belongsTo(Empleado, {
    foreignKey: 'ID_Departamento_FK',
    as: 'empleado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Producto (product.js) -> uno
 *              Modelo Inventario (inventory.js)  -> muchos
 */

Producto.hasMany(Inventario, {
    foreignKey: 'ID_Departamento_FK',
    as: 'inventarios'
});

Inventario.belongsTo(Producto, {
    foreignKey: 'ID_Departamento_FK',
    as: 'producto'
});

//Exportación del modelo Inventario
module.exports = Inventario;