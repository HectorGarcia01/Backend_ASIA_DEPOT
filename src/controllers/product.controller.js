const Sequelize = require('sequelize');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const InventoryModel = require('../models/inventory');

/**
 * Función para registrar un nuevo producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto (product.js), 
 *              Modelo Estado (state.js),
 *              Modelo Categoria (category.js),
 *              Modelo Inventario (inventory.js)
 */

const addProduct = async (req, res) => {
    try {
        const { user } = req;
        const { 
            Nombre_Producto,
            Marca_Producto,
            Precio_Promedio,
            Descripcion_Producto,
            ID_Categoria_FK,
            Cantidad_Stock //Modelo Inventario
        } = req.body;

        const category = await CategoryModel.findByPk(ID_Categoria_FK);

        if (!category) {
            return res.status(404).send({ error: "Categoría no encontrada." });
        }

        const stateProduct = await StateModel.findOne({
            where: {
                Tipo_Estado: 'Activo'
            }
        });

        if (!stateProduct) {
            return res.status(404).send({ error: "Estado no encontrado." });
        }

        const newProduct = await ProductModel.create({ 
            Nombre_Producto,
            Marca_Producto,
            Precio_Promedio,
            Descripcion_Producto,
            ID_Estado_FK: stateProduct.id,
            ID_Categoria_FK
        });

        await InventoryModel.create({
            Cantidad_Stock,
            ID_Empleado_FK: user.id,
            ID_Producto_FK: newProduct.id
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo producto.", newProduct })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe!" });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addProduct
};