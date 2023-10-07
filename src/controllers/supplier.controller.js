const Sequelize = require('sequelize');
const findState = require('../utils/find_state');
const findSupplier = require('../utils/find_supplier');
const SupplierModel = require('../models/supplier');
const StateModel = require('../models/state');

/**
 * Función para crear un nuevo proveedor
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Modelo Proveedor (supplier.js)
 */

const addSupplier = async (req, res) => {
    try {
        const {
            Nombre_Proveedor,
            Apellido_Proveedor,
            Nombre_Empresa,
            Telefono_Proveedor,
            Correo_Proveedor
        } = req.body;

        const stateSupplier = await findState('Activo');

        await SupplierModel.create({
            Nombre_Proveedor,
            Apellido_Proveedor,
            Nombre_Empresa,
            Telefono_Proveedor,
            Correo_Proveedor,
            ID_Estado_FK: stateSupplier.id
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo proveedor." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El proveedor ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los proveedores
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Proveedor (supplier.js),
 *              Modelo Estado (state.js)
 */

const readSuppliers = async (req, res) => {
    try {
        const suppliers = await SupplierModel.findAll({
            include: {
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }
        });

        if (suppliers.length === 0) {
            return res.status(404).send({ error: "No existe ningún proveedor registrado." });
        }

        res.status(200).send({ suppliers });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un proveedor por ID
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar proveedor (find_supplier.js)
 */

const readSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await findSupplier(id);

        res.status(200).send({ supplier });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para actualizar datos de un proveedor por ID
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar proveedor (find_supplier.js),
 */

const updateSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = Object.keys(req.body);

        const allowedUpdates = [
            'Nombre_Proveedor', 
            'Apellido_Proveedor', 
            'Nombre_Empresa', 
            'Telefono_Proveedor', 
            'Correo_Proveedor'
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const supplier = await findSupplier(id);
        updates.forEach((update) => supplier[update] = req.body[update]);

        await supplier.save();
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
 * Función para eliminar de forma lógica un proveedor por id
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar proveedor (find_supplier.js),
 *              Función para buscar estado (find_state.js)
 */

const deleteSupplierId = async (req, res) => {
    try {
        const { id } = req.params;

        const supplier = await findSupplier(id);
        const stateSupplier = await findState('Inactivo');

        supplier.ID_Estado_FK = stateSupplier.id;
        await supplier.save();
        res.status(200).send({ msg: "Proveedor eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

//Exportación de controladores para el proveedor
module.exports = {
    addSupplier,
    readSuppliers,
    readSupplierId,
    updateSupplierId,
    deleteSupplierId
};