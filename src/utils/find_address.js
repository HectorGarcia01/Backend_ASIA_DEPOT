const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');

/**
 * Función para para validar si el departamento ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const findDepartment = async(ID_Departamento_FK) => {
    const departmentCustomer = await DepartmentModel.findOne({
        where: {
            id: ID_Departamento_FK
        }
    });

    if (!departmentCustomer) {
        const error = new Error("Departamento no encontrado.");
        error.status = 404;
        throw error;
    }
};

/**
 * Función para para validar si el municipio ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js)
 */

const findMunicipality = async (ID_Municipio_FK, ID_Departamento_FK) => {
    const municipalityCustomer = await MunicipalityModel.findOne({
        where: {
            id: ID_Municipio_FK,
            ID_Departamento_FK
        }
    });

    if (!municipalityCustomer) {
        const error = new Error("Municipio no encontrado.");
        error.status = 404;
        throw error;
    }
};

//Exportación de la función para validar la existencia de municipio y departamento
module.exports = {
    findDepartment,
    findMunicipality
};