const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');

/**
 * Función para para validar si el departamento ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const findDepartment = async (ID_Departamento_FK) => {
    const department = await DepartmentModel.findByPk(ID_Departamento_FK);

    if (!department) {
        const error = new Error("Departamento no encontrado.");
        error.status = 404;
        throw error;
    }

    return department;
};

/**
 * Función para para validar si el municipio ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js)
 */

const findMunicipality = async (ID_Municipio_FK, ID_Departamento_FK) => {
    const municipality = await MunicipalityModel.findOne({
        where: {
            id: ID_Municipio_FK,
            ID_Departamento_FK
        }
    });

    if (!municipality) {
        const error = new Error("Municipio no encontrado.");
        error.status = 404;
        throw error;
    }

    return municipality;
};

//Exportación de la función para validar la existencia de municipio y departamento
module.exports = {
    findDepartment,
    findMunicipality
};