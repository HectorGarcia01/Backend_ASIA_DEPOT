const Sequelize = require('sequelize');
const findState = require('../utils/find_state');
const {
    findCategory,
    findProductBrand,
    findProduct
} = require('../utils/find_product');
const ProductModel = require('../models/product');
const StateModel = require('../models/state');
const CategoryModel = require('../models/category');
const BrandProductModel = require('../models/brand_product');

/**
 * Función para registrar un nuevo producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar estado (find_state.js),
 *              Función para buscar categoría (find_product.js),
 *              Función para buscar marca de producto (find_product.js),
 *              Modelo Producto (product.js), 
 *              Modelo Estado (state.js),
 */

const addProduct = async (req, res) => {
    try {
        const {
            Nombre_Producto,
            Precio_Venta,
            Precio_Compra,
            Descripcion_Producto,
            Cantidad_Stock,
            ID_Categoria_FK,
            ID_Marca_FK,
        } = req.body;

        await findCategory(ID_Categoria_FK);
        await findProductBrand(ID_Marca_FK);
        const stateProduct = await findState('Activo');

        const newProduct = await ProductModel.create({
            Nombre_Producto,
            Precio_Venta,
            Precio_Compra,
            Descripcion_Producto,
            Cantidad_Stock,
            ID_Estado_FK: stateProduct.id,
            ID_Categoria_FK,
            ID_Marca_FK
        });

        res.status(201).send({ msg: "Se ha registrado un nuevo producto.", newProduct })
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).send({ error: "¡El producto ya existe!" });
        } else if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para ver todos los productos
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Producto (product.js), 
 */

const readProducts = async (req, res) => {
    try {
        const products = await ProductModel.findAll({
            include: [{
                model: StateModel,
                as: 'estado',
                attributes: ['id', 'Tipo_Estado']
            }, {
                model: CategoryModel,
                as: 'categoria',
            }, {
                model: BrandProductModel,
                as: 'marca',
            }]
        });

        if (products.length === 0) {
            return res.status(404).send({ error: "No hay productos registrados." });
        }

        res.status(200).send({ products });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver un producto por ID
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar producto (find_product.js)
 */

const readProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await findProduct(id);

        res.status(200).send({ product });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

/**
 * Función para actualizar datos del producto
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar categoría (find_product.js),
 *              Función para buscar marca de producto (find_product.js),
 *              Función para buscar producto (find_product.js)
 */

const updateProductId = async (req, res) => {
    try {
        const { id } = req.params;
        const { ID_Categoria_FK, ID_Marca_FK } = req.body;
        const updates = Object.keys(req.body);

        const allowedUpdates = [
            'Nombre_Producto',
            'Precio_Venta',
            'Precio_Compra',
            'Descripcion_Producto',
            'Cantidad_Stock',
            'ID_Categoria_FK',
            'ID_Marca_FK',
        ];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        if (ID_Categoria_FK) {
            await findCategory(ID_Categoria_FK);
        }

        if (ID_Marca_FK) {
            await findProductBrand(ID_Marca_FK);
        }

        const product = await findProduct(id);

        updates.forEach((update) => product[update] = req.body[update]);
        await product.save();

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
 * Función para eliminar de forma lógica un producto por id
 * Fecha creación: 24/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Función para buscar producto (find_product.js),
 *              Función para buscar estado (find_state.js),
 */

const deleteProductId = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await findProduct(id);
        const stateProduct = await findState('Inactivo');

        product.ID_Estado_FK = stateProduct.id;
        await product.save();
        res.status(200).send({ msg: "Producto eliminado con éxito." });
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
    }
};

module.exports = {
    addProduct,
    readProducts,
    readProductId,
    updateProductId,
    deleteProductId
};