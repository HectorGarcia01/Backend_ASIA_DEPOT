const StateModel = require('../models/state');
const RoleModel = require('../models/role');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');
const typeStates = require('../utils/seed/state_seed_data');
const typeRoles = require('../utils/seed/role_seed_data');
const addresses = require('../utils/seed/address_seed_data');

/**
 * Insertar datos predefinidos para el modelo Estado, Rol y Direccion
 * Fecha creación: 03/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Estado (state.js).
 *              Modelo Rol (role.js).
 *              Modelo Departamento (department.js).
 *              Modelo Municipio (municipality.js).
 *              Para estados predefinidos (state_seed_data.js).
 *              Para roles predefinidos (role_seed_data.js).
 *              Para direcciones predefinidas (address_seed_data.js).
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

        const existingDepartments = await DepartmentModel.findAll();

        if (existingDepartments.length === 0) {
            for (const department of addresses.departamentos) {
                const newDepartment = await DepartmentModel.create({ Nombre_Departamento: department.nombre });
                for (const Nombre_Municipio of department.municipios) {
                    await MunicipalityModel.create({ Nombre_Municipio, ID_Departamento_FK: newDepartment.id });
                }
            }
            console.log("Datos predefinidos de direcciones insertados con éxito.");
        }
    } catch (error) {
        console.log("Error al insertar datos predefinidos.", error); 
    }
};

module.exports = insertPredefinedData;