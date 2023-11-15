const Sequelize = require('sequelize');
const InventoryModel = require('../models/inventory');
const EmployeeModel = require('../models/employee');
const ProductModel = require('../models/product');

/**
 * Función para ver todo el inventario
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Inventario (inventory.js),
 *              Modelo Empleado (employee.js)
 */

const readInventories = async (req, res) => {
    try {
        const { page, pageSize, nombre } = req.query;
        const pageValue = req.query.page ? parseInt(page) : 1;
        const pageSizeValue = req.query.pageSize ? parseInt(pageSize) : 10;
        const where = {
            [Sequelize.Op.or]: [
                {
                    Tipo_Movimiento: {
                        [Sequelize.Op.like]: `%${nombre}%`
                    }
                },
                {
                    Cantidad_Movimiento: nombre 
                },
                {
                    Monto_Movimiento: nombre 
                }
            ]
        };

        if (!nombre) {
            delete where[Sequelize.Op.or];
        }

        const count = await InventoryModel.count({
            where: nombre ? where : {}
        });

        const inventories = await InventoryModel.findAll({ 
            where,
            include: [{
                model: EmployeeModel,
                as: 'empleado',
                attributes: ['id', 'Nombre_Empleado', 'Apellido_Empleado']
            }],
            offset: (pageValue - 1) * pageSizeValue,
            limit: pageSizeValue
        });

        if (inventories.length === 0) {
            return res.status(404).send({ error: "No se encontraron inventarios que coincidan con los criterios de búsqueda." });
        }

        const totalPages = Math.ceil(count / pageSizeValue);
        res.status(200).send({ inventories, currentPage: pageValue, totalPages });
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