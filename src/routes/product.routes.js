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
    productSchema,
    updateProductSchema
} = require('../schemas/product.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/producto', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Crear'), 
    validateMiddleware(productSchema), 
    addProduct
);
router.get('/superAdmin/ver/productos', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readProducts);
router.get('/superAdmin/ver/producto/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readProductId);
router.patch(
    '/superAdmin/actualizar/producto/:id', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Modificar'), 
    validateMiddleware(updateProductSchema),
    updateProductId
);
router.delete('/superAdmin/eliminar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminiar'), deleteProductId);

//Rutas (endpoints) para el Admin
router.post(
    '/admin/crear/producto', 
    authMiddleware, 
    roleMiddleware('Admin', 'Crear'), 
    validateMiddleware(productSchema), 
    addProduct
);
router.get('/admin/ver/productos', authMiddleware, roleMiddleware('Admin', 'Ver'), readProducts);
router.get('/admin/ver/producto/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readProductId);
router.patch(
    '/admin/actualizar/producto/:id', 
    authMiddleware, 
    roleMiddleware('Admin', 'Modificar'), 
    validateMiddleware(updateProductSchema),
    updateProductId
);

//Rutas (endpoints) para el User
router.get('/usuario/ver/productos', readProducts);
router.get('/usuario/ver/producto/:id', readProductId);

//Exportación de todas las rutas de categoría
module.exports = router;