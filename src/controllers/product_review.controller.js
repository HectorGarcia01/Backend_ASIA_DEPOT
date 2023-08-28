const Sequelize = require('sequelize');
const ProductModel = require('../models/product');
const ProductReviewModel = require('../models/product_review');

/**
 * Función para agregar una reseña del producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto (product.js),
 *              Modelo Valoración de Producto (product_review.js)
 */

const addProductReview = async (req, res) => {
    try {
        const { user } = req;
        const { 
            Comentario_Producto, 
            Puntuacion_Producto,
            ID_Producto_FK
        } = req.body;

        const product = await ProductModel.findByPk(ID_Producto_FK);

        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado." });
        }

        const newProductReview = await ProductReviewModel.create({  
            Comentario_Producto,
            Puntuacion_Producto,
            ID_Cliente_FK: user.id,
            ID_Producto_FK
        });

        res.status(201).send({ msg: "Se ha registrado una nueva reseña.", newProductReview })
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todas las reseñas de un producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Valoración de Producto (product_review.js), 
 */

const readProductReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const productReviews = await ProductReviewModel.findAll({ 
            where: {
                ID_Producto_FK: id
            }
        });

        if (productReviews.length === 0) {
            return res.status(404).send({ error: "No hay reseñas para el producto." });
        }

        res.status(200).send({ productReviews });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

/**
 * Función para ver todas las reseñas que ha hecho el cliente sobre un producto por id
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Valoración de Producto (product_review.js), 
 */

const readCustomerReviews = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;

        const customerReviews = await ProductReviewModel.findAll({
            where: {
                ID_Cliente_FK: user.id,
                ID_Producto_FK: id
            }
        });

        if (customerReviews.length === 0) {
            return res.status(404).send({ error: "No has hecho ninguna reseña." });
        }

        res.status(200).send({ customerReviews });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación de controladores para la reseña del producto
module.exports = {
    addProductReview,
    readProductReviews,
    readCustomerReviews
};