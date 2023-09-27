const RoleModel = require('../models/role');

/**
 * Función para buscar un rol por su nombre
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Rol (role.js)
 */

const findRole = async (Nombre_Rol) => {
    const role = await RoleModel.findOne({
        where: {
            Nombre_Rol
        }
    });

    if (!role) {
        const error = new Error("Rol no encontrado.");
        error.status = 404;
        throw error;
    }

    return role;
};

//Exportación de la función para buscar un rol
module.exports = findRole;
