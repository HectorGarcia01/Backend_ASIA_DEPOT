const MunicipalityModel = require('../../models/municipality');

/**
 * Función para para validar si el municipio ingresado existe
 * Fecha creación: 27/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js)
 */

const validateMunicipality = async (ID_Municipio_FK, ID_Departamento_FK) => {
    const addressCustomer = await MunicipalityModel.findOne({
        where: {
            id: ID_Municipio_FK,
            ID_Departamento_FK
        }
    });

    if (!addressCustomer) {
        const error = new Error("Municipio no encontrado.");
        error.status = 404;
        throw error;
    }
};

//Exportación de la función para validar la existencia de municipio
module.exports = validateMunicipality;