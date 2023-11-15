const Sequelize = require('sequelize');
const InventoryModel = require('../models/inventory');
const EmployeeModel = require('../models/employee');
const ProductModel = require('../models/product');
const findState = require('../utils/find_state');
const {
    findCategory,
    findProductBrand
} = require('../utils/find_product');

/**
 * Función para registrar un nuevo producto (ajuste)
 * Fecha creación: 29/09/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Función para buscar categoría (find_product.js),
 *              Función para buscar marca de producto (find_product.js),
 *              Modelo Producto (product.js), 
 *              Modelo Estado (state.js),
 */

const addProductAjustInventory = async (req, res) => {
    try {
        const { user } = req;
        const {
            Nombre_Producto,
            Precio_Venta,
            Precio_Compra,
            Descripcion_Producto,
            Cantidad_Stock,
            Codigo_Barras,
            Producto_Destacado,
            ID_Categoria_FK,
            ID_Marca_FK,
        } = req.body;

        await findCategory(ID_Categoria_FK);

        if (ID_Marca_FK) {
            await findProductBrand(ID_Marca_FK);
        }

        const stateProduct = await findState('Activo');

        const newProduct = await ProductModel.create({
            Nombre_Producto,
            Precio_Venta,
            Precio_Compra,
            Descripcion_Producto,
            Cantidad_Stock,
            Codigo_Barras,
            Producto_Destacado,
            ID_Estado_FK: stateProduct.id,
            ID_Categoria_FK,
            ID_Marca_FK
        });

        await InventoryModel.create({
            Tipo_Movimiento: 'Ajuste',
            Cantidad_Movimiento: newProduct.Cantidad_Stock,
            Monto_Movimiento: (newProduct.Cantidad_Stock * newProduct.Precio_Compra),
            ID_Empleado_FK: user.id,
            ID_Producto_FK: newProduct.id,
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo producto." })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: error.message });
        }
    }
};

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
    addProductAjustInventory,
    readInventories,
    readInventoryId
}