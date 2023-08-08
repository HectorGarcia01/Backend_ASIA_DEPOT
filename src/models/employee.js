const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');

/**
 * Creación del modelo Empleado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Modelo Estado (state.js)
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
    }
});

/**
 * Hook para el cifrado de contraseña
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Datos del empleado actual
 */

Empleado.beforeCreate(async (empleado) => {
    try {
        empleado.Password_Empleado = await bcrypt.hash(empleado.Password_Empleado, 8);
    } catch (error) {
        throw new Error({ mensajeError: "Error al cifrar la contraseña.", error });
    }
});

/**
 * Método personalizado para generar tokens
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: Variable de entorno para llave secreta (config.js)
 */

Empleado.prototype.generarToken = async function () {
    try {
        const empleado = this;
        const token = jwt.sign({ id: empleado.id.toString() }, KEY_TOKEN);
        return token;
    } catch (error) {
        throw new Error({ mensajeError: "Error al generar token.", error });
    }
}

//Exportación del modelo Empleado
module.exports = Empleado;