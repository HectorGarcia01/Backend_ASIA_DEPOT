const StateModel = require('../models/state');
const RoleModel = require('../models/role');
const typeStates = require('../utils/seed/state_seed_data');
const typeRoles = require('../utils/seed/role_seed_data');

/**
 * Insertar datos predefinidos para el modelo Estado y Rol
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 *              Para estados predefinidos (state_seed_data.js).
 *              Para roles predefinidos (role_seed_data.js).
 */
const insertPredefinedData = async () => {
    try {
        const existingState = await StateModel.findAll();

        if (existingState.length === 0) {
            await StateModel.bulkCreate(typeStates);
            console.log("Datos predefinidos de estados insertados con éxito.");
        }

        const existingRole = await RoleModel.findAll();

        if (existingRole.length === 0) {
            await RoleModel.bulkCreate(typeRoles);
            console.log("Datos predefinidos de roles insertados con éxito.");
        }
    } catch (error) {
        console.log("Error al insertar datos predefinidos.");
    }
};

module.exports = insertPredefinedData;