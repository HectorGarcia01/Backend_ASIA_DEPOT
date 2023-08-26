const express = require('express');
const router = new express.Router();
const {
    addProduct,
    readProducts,
    readProductId,
    updateProductId,
    deleteProductId
} = require('../controllers/product.controller');
const {
    productSchema
} = require('../schemas/product.schema');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/crear/producto', authMiddleware, roleMiddleware('SuperAdmin'), validate(productSchema), addProduct);
router.get('/superAdmin/ver/productos', authMiddleware, roleMiddleware('SuperAdmin'), readProducts);
router.get('/superAdmin/ver/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), readProductId);
router.patch('/superAdmin/actualizar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), updateProductId);
router.delete('/superAdmin/eliminar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProductId);

//Rutas (endpoints) para el Admin
router.post('/admin/crear/producto', authMiddleware, roleMiddleware('Admin'), validate(productSchema), addProduct);
router.get('/admin/ver/productos', authMiddleware, roleMiddleware('Admin'), readProducts);
router.get('/admin/ver/producto/:id', authMiddleware, roleMiddleware('Admin'), readProductId);
router.get('/admin/actualizar/producto/:id', authMiddleware, roleMiddleware('Admin'), updateProductId);
router.delete('/admin/eliminar/producto/:id', authMiddleware, roleMiddleware('Admin'), deleteProductId);

//Rutas (endpoints) para el User
router.get('/usuario/ver/productos', readProducts);
router.get('/usuario/ver/producto/:id', readProductId);

//Exportación de todas las rutas de categoría
module.exports = router;