const express = require('express');
const router = new express.Router();
const {
    addProductReview,
    readProductReviews,
    readCustomerReviews
} = require('../controllers/product_review.controller');
const productoReviewSchema = require('../schemas/product_review.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

router.post(
    '/usuario/nueva/valoracion/producto', 
    authMiddleware, 
    roleMiddleware('User'), 
    validateMiddleware(productoReviewSchema), 
    addProductReview
);
router.get('/usuario/ver/todas/valoraciones/producto/:id', readProductReviews);
router.get('/usuario/ver/tus/valoraciones/producto/:id', authMiddleware, roleMiddleware('User'), readCustomerReviews);

//Exportación de todas las rutas de reseña de producto
module.exports = router;