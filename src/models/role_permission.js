const { DataTypes } = require('sequelize');
const db = require('../database/db_connection');
const { NAME_PREFIX } = require('../config/config');
const Rol = require('../models/role');
const Permiso = require('../models/permission');

/**
 * Creación del modelo Rol_Permiso
 * Fecha creación: 06/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Rol (role.js),
 *              Modelo Permiso (permission.js)
 */

const Rol_Permiso = db.define(`${NAME_PREFIX}_Rol_Permiso`, {
    ID_Rol_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Rols`,
            key: 'id'
        }
    },
    ID_Permiso_FK: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: `${NAME_PREFIX}_Permisos`,
            key: 'id'
        }
    }
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Rol (role.js) -> uno
 *              Modelo Rol_Permiso (role_permission.js)  -> muchos
 */

Rol.hasMany(Rol_Permiso, {
    foreignKey: 'ID_Rol_FK',
    as: 'rol_permisos'
});

Rol_Permiso.belongsTo(Rol, {
    foreignKey: 'ID_Rol_FK',
    as: 'rol'
});

/**
 * Configurando la relación de uno a muchos
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencia:
 *              Modelo Permiso (permission.js) -> uno
 *              Modelo Rol_Permiso (role_permission.js)  -> muchos
 */

Permiso.hasMany(Rol_Permiso, {
    foreignKey: 'ID_Permiso_FK',
    as: 'rol_permisos'
});

Rol_Permiso.belongsTo(Permiso, {
    foreignKey: 'ID_Permiso_FK',
    as: 'permiso'
});


//Exportación del modelo Rol_Permiso
module.exports = Rol_Permiso;