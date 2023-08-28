const Sequelize = require('sequelize');
const ProductModel = require('../models/product');
const ProductReviewModel = require('../models/product_review');

/**
 * Función para agregar una reseña del producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Modelo Producto (product.js),
 *              Modelo Reseña de Producto (product_review.js)
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

//Exportación de controladores para la reseña del producto
module.exports = {
    addProductReview
};