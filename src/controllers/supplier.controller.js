const Sequelize = require('sequelize');
const SupplierModel = require('../models/supplier');
const StateModel = require('../models/state');

/**
 * Función para crear un nuevo proveedor
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Proveedor (supplier.js), 
 *              Modelo Estado (state.js)
 */

const addSupplier = async (req, res) => {
    try {
        const {
            Nombre_Proveedor,
            Apellido_Proveedor,
            Telefono_Proveedor,
            Correo_Proveedor
        } = req.body;

        const stateSupplier = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Activo'
            }
        });

        if (!stateSupplier) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        await SupplierModel.create({
            Nombre_Proveedor,
            Apellido_Proveedor,
            Telefono_Proveedor,
            Correo_Proveedor,
            ID_Estado_FK: stateSupplier.id
        });

        res.status(201).send({ msg: "Se ha registrado con éxito." });
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El proveedor ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los empleados
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 *              Modelo Estado (state.js)
 */

const readSuppliers = async (req, res) => {
    try {
        const suppliers = await SupplierModel.findAll({});

        if (suppliers.length === 0) {
            return res.status(404).send({ error: "No existe ningún proveedor registrado." });
        }

        res.status(200).send({ suppliers });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un empleado por ID
 * Fecha creación: 23/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Empleado (employee.js),
 */

const readSupplierId = async (req, res) => {
    try {
        const { id } = req.params;
        const supplier = await SupplierModel.findByPk(id);

        if (!supplier) {
            return res.status(404).send({ error: "Proveedor no encontrado." });
        }

        res.status(200).send({ supplier });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación de controladores para el proveedor
module.exports = {
    addSupplier,
    readSuppliers,
    readSupplierId
};