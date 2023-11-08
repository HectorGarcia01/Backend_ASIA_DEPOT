const RoleModel = require('../models/role');
const PermissionModel = require('../models/permission');
const RolePermissionModel = require('../models/role_permission');

/**
 * Middleware de validación de rol y permisos
 * Fecha creación: 16/08/2023
 * Autor: Hector Armando García González
 */

const checkRolePermission = ( roleName, permissionName ) => async (req, res, next) => {
    try {
        const { role } = req;

        if (role !== roleName) {
            throw new Error("No tienes los permisos necesarios para realizar esta acción.");
        }

        if (role !== 'User') {
            if (!permissionName) {
                throw new Error("No tienes los permisos necesarios para realizar esta acción.");
            }
            const userRole = await RoleModel.findOne({ where: { Nombre_Rol: role } });
            const userPermission = await PermissionModel.findOne({ where: { Nombre_Permiso: permissionName } });
            const rolePermission = await RolePermissionModel.findOne({
                where: {
                    ID_Rol_FK: userRole.id,
                    ID_Permiso_FK: userPermission.id
                }
            });

            if (!rolePermission) {
                throw new Error("No tienes los permisos necesarios para realizar esta acción.");
            }
        }

        next();
    } catch (error) {
        res.status(403).send({ error: error.message });
    }
};

module.exports = checkRolePermission;