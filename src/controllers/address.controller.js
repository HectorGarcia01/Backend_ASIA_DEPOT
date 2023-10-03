const Sequelize = require('sequelize');
const {
    findDepartment,
    findMunicipality
} = require('../utils/find_address');
const DepartmentModel = require('../models/department');
const MunicipalityModel = require('../models/municipality');

/**
 * Función para registrar un nuevo departamento
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Departamento (department.js), 
 */

const addDepartment = async (req, res) => {
    try {
        const { Nombre_Departamento } = req.body;

        const newDepartment = await DepartmentModel.create({ Nombre_Departamento });

        res.status(201).send({ msg: "Se ha registrado un nuevo departamento.", newDepartment })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El departamento ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para registrar un nuevo municipio
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Municipio (municipality.js), 
 */

const addMunicipality = async (req, res) => {
    try {
        const { Nombre_Municipio, ID_Departamento_FK } = req.body;

        await findDepartment(ID_Departamento_FK);

        const newMunicipality = await MunicipalityModel.create({ 
            Nombre_Municipio,
            ID_Departamento_FK
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo municipio.", newMunicipality })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El muni ya existe!" });
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
    addDepartment,
    addMunicipality,
    readAddresses
};