const { handleSuccess, handleResponse } = require('../response_handling');
const MunicipalityModel = require('../../models/municipality');

/**
 * Función para para validar si el municipio ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 */

const validateMunicipality = async (res, ID_Municipio_FK, ID_Departamento_FK) => {
    const addressCustomer = await MunicipalityModel.findOne({
        where: {
            id: ID_Municipio_FK,
            ID_Departamento_FK
        }
    });

    if (!addressCustomer) {
        handleResponse(res, 404, "Municipio no encontrado.");
    }
};

//Exportación de la función para validar la existencia de municipio
module.exports = validateMunicipality;