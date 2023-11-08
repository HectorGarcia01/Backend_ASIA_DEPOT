const Sequelize = require('sequelize');
const { findProduct } = require('../utils/find_product');
const ProductReviewModel = require('../models/product_review');
const CustomerModel = require('../models/customer');

/**
 * Función para agregar una reseña del producto
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias: 
 *              Función para buscar producto (find_product.js),
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

        await findProduct(ID_Producto_FK);

        const newProductReview = await ProductReviewModel.create({  
            Comentario_Producto,
            Puntuacion_Producto,
            ID_Cliente_FK: user.id,
            ID_Producto_FK
        });

        res.status(201).send({ msg: "Se ha registrado una nueva reseña.", newProductReview })
    } catch (error) {
        if (error.status === 404) {
            res.status(error.status).send({ error: error.message });
        } else {
            res.status(500).send({ error: "Error interno del servidor." });
        }
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
            }, 
            attributes: ['id', 'Comentario_Producto', 'Puntuacion_Producto', 'createdAt'],
            include: [{
                model: CustomerModel,
                as: 'cliente',
                attributes: ['Nombre_Cliente']
            }]
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
 *              Modelo Valoración de Producto (product_review.js)
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

/**
 * Función para actualizar datos de la reseña que ha hecho un cliente
 * Fecha creación: 28/08/2023
 * Autor: Hector Armando García González
 * Referencias:
 *              Modelo Valoración de Producto (product_review.js)
 */

const updateCustomerReviewId = async (req, res) => {
    try {
        const { id } = req.params;
        const { user } = req;
        const updates = Object.keys(req.body);

        const allowedUpdates = ['Comentario_Producto', 'Puntuacion_Producto'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: '¡Actualización inválida!' });
        }

        const customerReview = await ProductReviewModel.findOne({
            where: {
                id,
                ID_Cliente_FK: user.id
            }
        });

        if (!customerReview) {
            return res.status(404).send({ error: "Reseña no encontrada." });
        }

        updates.forEach((update) => customerReview[update] = req.body[update]);

        await customerReview.save();
        res.status(200).send({ msg: "Datos actualizados con éxito." });
    } catch (error) {
        res.status(500).send({ error: "Error interno del servidor." });
    }
};

//Exportación de controladores para la reseña del producto
module.exports = {
    addProductReview,
    readProductReviews,
    readCustomerReviews,
    updateCustomerReviewId
};