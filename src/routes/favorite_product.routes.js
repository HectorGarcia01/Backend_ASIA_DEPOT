const express = require('express');
const router = new express.Router();
const {
    addFavoriteProduct,
    readFavoriteProduct,
    deleteFavoriteProductId
} = require('../controllers/favorite_product.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

router.post('/usuario/agregar/producto/favorito/:id', authMiddleware, roleMiddleware('User'), addFavoriteProduct);
router.get('/usuario/ver/productos/favorito', authMiddleware, roleMiddleware('User'), readFavoriteProduct);
router.delete('/usuario/eliminar/producto/favorito/:id', authMiddleware, roleMiddleware('User'), deleteFavoriteProductId
);

//Exportación de todas las rutas de productos favoritos
module.exports = router;