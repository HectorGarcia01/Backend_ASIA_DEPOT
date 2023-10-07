const express = require('express');
const router = new express.Router();
const {
    addProductBrand,
    readProductBrands,
    readProductBrandId,
    updateProductBrandId,
    deleteProductBrandId
} = require('../controllers/brand_product.controller');
const {
    productBrandSchema,
    updateProductBrandSchema
} = require('../schemas/brand_product.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/crear/marca',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(productBrandSchema),
    addProductBrand
);
router.get('/superAdmin/ver/marcas', authMiddleware, roleMiddleware('SuperAdmin'), readProductBrands);
router.get('/superAdmin/ver/marca/:id', authMiddleware, roleMiddleware('SuperAdmin'), readProductBrandId);
router.patch(
    '/superAdmin/actualizar/marca/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(updateProductBrandSchema),
    updateProductBrandId
);
router.delete('/superAdmin/eliminar/marca/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteProductBrandId);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/crear/marca',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(productBrandSchema),
    addProductBrand
);
router.get('/admin/ver/marcas', authMiddleware, roleMiddleware('Admin'), readProductBrands);
router.get('/admin/ver/marca/:id', authMiddleware, roleMiddleware('Admin'), readProductBrandId);
router.patch(
    '/admin/actualizar/marca/:id',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(updateProductBrandSchema),
    updateProductBrandId
);

//Configuración de rutas (endpoints) para el usuario
router.get('/usuario/ver/marcas', readProductBrands);
router.get('/usuario/ver/marca/:id', readProductBrandId);

module.exports = router;