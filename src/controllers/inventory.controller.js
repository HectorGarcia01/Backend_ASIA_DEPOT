const Sequelize = require('sequelize');
const InventoryModel = require('../models/inventory');
const EmployeeModel = require('../models/employee');
const ProductModel = require('../models/product');

/**
 * Función para ver todo el inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js)
 */

const readInventories = async (req, res) => {
    try {
        const { query } = req;
        const where = {};

        if (query.Tipo_Movimiento) {
            where.Tipo_Movimiento = {
                [Sequelize.Op.like]: `%${query.Tipo_Movimiento}%`
            };
        }

        if (query.Cantidad_Movimiento) {
            where.Cantidad_Movimiento = query.Cantidad_Movimiento;
        }

        if (query.Monto_Movimiento) {
            where.Monto_Movimiento = query.Monto_Movimiento;
        }

        const inventories = await InventoryModel.findAll({ where });

        if (inventories.length === 0) {
            return res.status(404).send({ error: "No se encontraron inventarios que coincidan con los criterios de búsqueda." });
        }

        res.status(200).send({ inventories });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver el detalle de un inventario por id
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js), 
 *              Modelo Empleado (employee.js),
 *              Modelo Producto (product.js)
 */

const readInventoryId = async (req, res) => {
    try {
        const { id } = req.params;

        const inventory = await InventoryModel.findByPk(id, {
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'Nombre_Empleado', 'Apellido_Empleado']
            }, {
                model: ProductModel,
                as: 'producto',
                attributes: ['id', 'Nombre_Producto', 'Descripcion_Producto', 'Precio_Venta', 'Precio_Compra']
            }]
        });

        if (inventory.length === 0) {
            return res.status(404).send({ error: "Inventario no encontrado." });
        }

        res.status(200).send({ inventory });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

module.exports = {
    readInventories,
    readInventoryId
}