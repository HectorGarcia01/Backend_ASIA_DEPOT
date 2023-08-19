const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/db_connection');
const { KEY_TOKEN } = require('../config/config');

/**
 * Creación del modelo Empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 */

const Empleado = db.define('Empleado', {
    Nombre_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Apellido_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Telefono_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    NIT_Empleado: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    Correo_Empleado: {
        type: DataTypes.STRING,
        allowNull: false,
        low: true,
        unique: true
    },
    Password_Empleado: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Avatar_Empleado: {
        type: DataTypes.BLOB,
        allowNull: true
    },
    ID_Estado_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Estados',
            key: 'id'
        }
    },
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Rols',
            key: 'id'
        }
    }
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del empleado actual
 */

Empleado.beforeCreate(async (empleado) => {
    empleado.Password_Empleado = await bcrypt.hash(empleado.Password_Empleado, 8);
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Empleado.prototype.generarToken = (id, rol) => {
    const token = jwt.sign({ id: id.toString(), rol }, KEY_TOKEN);
    return token;
}

/**
 * Método personalizado para validar credenciales
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.validarCredenciales = async (Correo_Empleado, Password_Empleado) => {
    const empleado = await Empleado.findOne({
        where: {
            Correo_Empleado
        }
    });

    if (!empleado) {
        return false;
    }

    const passwordValida = await bcrypt.compare(Password_Empleado, empleado.Password_Empleado);

    if (!passwordValida) {
        throw new Error("Credenciales inválidas.");
    }

    return empleado;
};

/**
 * Método personalizado para filtrar información
 * Fecha creación: 04/08/2023
 * Autor: Hector Armando García González
 */

Empleado.prototype.toJSON = function () {
    const empleado = { ...this.get() };
    
    delete empleado.Avatar_Empleado;
    delete empleado.Password_Empleado;
    delete empleado.createdAt;
    delete empleado.updatedAt;
    delete empleado.ID_Rol_FK;
    
    return empleado;
};

//Exportación del modelo Empleado
module.exports = Empleado;