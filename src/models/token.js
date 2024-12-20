const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Estado = require('../models/state');
const Cliente = require('../models/customer');
const Empleado = require('../models/employee');

/**
 * Creación del modelo Token
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js)
 *              Modelo Cliente (customer.js).
 *              Modelo Empleado (employee.js)
 */

const Token = db.define(`${NAME_PREFIX}_Token`, {
    Token_Usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
            key: 'id'
        }
    },
    ID_Cliente_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: `${NAME_PREFIX}_Clientes`,
            key: 'id'
        }
    },
    ID_Empleado_FK: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: `${NAME_PREFIX}_Empleados`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Token (token.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Token, {
    foreignKey: 'ID_Estado_FK'
});

Token.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Cliente (customer.js) -> uno
 *              Modelo Token (token.js)  -> muchos
 */

Cliente.hasMany(Token, {
    foreignKey: 'ID_Cliente_FK',
    as: 'tokens'
});

Token.belongsTo(Cliente, {
    foreignKey: 'ID_Cliente_FK',
    as: 'cliente'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Token (token.js)  -> muchos
 */

Empleado.hasMany(Token, {
    foreignKey: 'ID_Empleado_FK',
    as: 'tokens'
});

Token.belongsTo(Empleado, {
    foreignKey: 'ID_Empleado_FK',
    as: 'empleado'
});

//Exportación del modelo Token
module.exports = Token;