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
 *              Función para buscar un departamento (find_address.js),
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
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
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

/**
 * Función para actualizar datos de departamento por id
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar departamento (find_address.js)
 */

const updateDepartmentId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Departamento'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const department = await findDepartment(id);
        updates.forEach((update) => department[update] = req.body[update]);

        await department.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para actualizar datos de municipio por id
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar departamento (find_address.js),
 *              Modelo Municipio (municipality.js)
 */

const updateMunicipalityId = async (req, res) => {
    try {
        const { id } = req.params;
        const { ID_Departamento_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Nombre_Municipio', 'ID_Departamento_FK'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Departamento_FK) {
            await findDepartment(ID_Departamento_FK);
        }

        const municipality = await MunicipalityModel.findByPk(id);

        if (!municipality) {
            return res.status(404).send({ error: "Municipio no encontrado." });
        }

        updates.forEach((update) => municipality[update] = req.body[update]);

        await municipality.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para eliminar departamento por id
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Departamento (department.js)
 */

const deleteDepartmentId = async (req, res) => {
    try {
        const { id } = req.params;

        const department = await findDepartment(id);

        const deleteMunicipality = await MunicipalityModel.destroy({ where: { ID_Departamento_FK: id } });

        if (deleteMunicipality === 0) {
            return res.status(404).send({ error: "Municipios no encontrados." });
        }

        const deleteDepartment = await department.destroy();

        if (deleteDepartment === 0) {
            return res.status(404).send({ error: "Error al eliminar el departamento" });
        }

        res.status(200).send({ msg: "Departamento y sus municipios eliminados con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error });
        }
    }
};

/**
 * Función para eliminar municipio por id
 * Fecha creación: 26/09/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Municipio (municipality.js)
 */

const deleteMunicipalityId = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteMunicipality = await MunicipalityModel.destroy({ where: { id } });

        if (deleteMunicipality === 0) {
            return res.status(404).send({ error: "Municipio no encontrado." });
        }

        res.status(200).send({ msg: "Municipio eliminado con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    addDepartment,
    addMunicipality,
    readAddresses,
    updateDepartmentId,
    updateMunicipalityId,
    deleteDepartmentId,
    deleteMunicipalityId
};