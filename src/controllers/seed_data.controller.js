const Estado = require('../models/state');
const Rol = require('../models/role');
const tiposEstados = require('../utils/seed/state_seed_data');
const tiposRoles = require('../utils/seed/role_seed_data');

/**
 * Insertar datos predefinidos para el modelo Estado
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 *              Para estados predefinidos (state_seed_data.js).
 *              Para roles predefinidos (role_seed_data.js).
 */
const insertarDatosPredefinidos = async () => {
    try {
        const estadosExistentes = await Estado.findAll();

        if (estadosExistentes.length === 0) {
            await Estado.bulkCreate(tiposEstados);
            console.log("Datos predefinidos de estados insertados con éxito.");
        }

        const rolesExistentes = await Rol.findAll();

        if (rolesExistentes.length === 0) {
            await Rol.bulkCreate(tiposRoles);
            console.log("Datos predefinidos de roles insertados con éxito.");
        }
    } catch (error) {
        console.log("Error al insertar datos predefinidos.");
    }
};

module.exports = insertarDatosPredefinidos;