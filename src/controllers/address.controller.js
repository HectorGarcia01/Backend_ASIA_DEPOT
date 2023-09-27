const Sequelize = require('sequelize');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');

/**
 * Función para registrar una nueva dirección (departamento y municipio)
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Departamento (department.js), 
 *              Modelo Municipio (municipality.js)
 */

const addAddress = (req, res) => {
    try {

    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El departamento ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los departamentos con sus municipios
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Departamento (department.js), 
 *              Modelo Municipio (municipality.js)
 */

const readAddresses = async (req, res) => {
    try {
        const address = await DepartmentModel.findAll({
            include: [{
                model: MunicipalityModel,
                as: 'municipios'
            }]
        });

        if (address.length === 0) {
            return res.status(404).send({ error: "No hay registro de departamentos y municipios." });
        }

        res.status(200).send({ address });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    addAddress,
    readAddresses
};