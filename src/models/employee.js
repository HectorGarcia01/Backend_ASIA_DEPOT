const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN, NAME_PREFIX } = require('../config/config');
const Estado = require('../models/state');

/**
 * Creación del modelo Empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Empleado = db.define(`${NAME_PREFIX}_Empleado`, {
    Nombre_Empleado: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Apellido_Empleado: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    Telefono_Empleado: {
        type: DataTypes.STRING(8),
        allowNull: false
    },
    NIT_Empleado: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Correo_Empleado: {
        type: DataTypes.STRING(40),
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Empleado: {
        type: DataTypes.BLOB('long'),
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Estados`,
            key: 'id'
        }
    },
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Rols`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a uno
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Empleado (employee.js) -> uno
 *              Modelo Estado (state.js)  -> uno
 */

Estado.hasOne(Empleado, {
    foreignKey: 'ID_Estado_FK'
});

Empleado.belongsTo(Estado, {
    foreignKey: 'ID_Estado_FK',
    as: 'estado'
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del empleado actual
 */

Empleado.beforeCreate(async (employee) => {
    employee.Password_Empleado = await bcrypt.hash(employee.Password_Empleado, 8);
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Empleado.prototype.generateAuthToken = (id, rol) => {
    const expiresIn = '1d';
    const token = jwt.sign({ id: id.toString(), rol }, KEY_TOKEN, { expiresIn });
    return token;
};

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.findByCredentials = async (Correo_Empleado, Password_Empleado, ID_Estado_FK) => {
    const employee = await Empleado.findOne({
        where: {
            Correo_Empleado,
            ID_Estado_FK
        }
    });

    if (!employee) {
        return false;
    }

    const isMatch = await bcrypt.compare(Password_Empleado, employee.Password_Empleado);

    if (!isMatch) {
        throw new Error("Credenciales inválidas.");
    }

    return employee;
};

/**
 * Método personalizado para filtrar información
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.toJSON = function () {
    const employee = { ...this.get() };
    
    delete employee.Avatar_Empleado;
    delete employee.Password_Empleado;
    delete employee.ID_Estado_FK;
    delete employee.ID_Rol_FK;
    delete employee.updatedAt;
    
    return employee;
};

//Exportación del modelo Empleado
module.exports = Empleado;