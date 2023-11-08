const express = require('express');
const router = new express.Router();
const {
    addProductReview,
    readProductReviews,
    readCustomerReviews,
    updateCustomerReviewId
} = require('../controllers/product_review.controller');
const productoReviewSchema = require('../schemas/product_review.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

router.post(
    '/usuario/nueva/valoracion/producto', 
    authMiddleware, 
    roleMiddleware('User'), 
    validateMiddleware(productoReviewSchema), 
    addProductReview
);
router.get('/usuario/ver/todas/valoraciones/producto/:id', readProductReviews);
router.get('/usuario/ver/tus/valoraciones/producto/:id', authMiddleware, roleMiddleware('User'), readCustomerReviews);
router.patch('/usuario/actualizar/tu/valoracion/producto/:id', authMiddleware, roleMiddleware('User'), updateCustomerReviewId);

//Exportación de todas las rutas de reseña de producto
module.exports = router;