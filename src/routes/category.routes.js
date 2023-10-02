const express = require('express');
const router = new express.Router();
const {
    addCategory,
    readCategories,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId
} = require('../controllers/category.controller');
const {
    categorySchema,
    updateCategorySchema
} = require('../schemas/category.schema');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/crear/categoria', authMiddleware, roleMiddleware('SuperAdmin'), validate(categorySchema), addCategory);
router.get('/superAdmin/ver/categorias', authMiddleware, roleMiddleware('SuperAdmin'), readCategories);
router.get('/superAdmin/ver/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin'), readCategoryId);
router.patch('/superAdmin/actualizar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin'), validate(updateCategorySchema), updateCategoryId);
router.delete('/superAdmin/eliminar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteCategoryId);

//Rutas (endpoints) para el Admin
router.post('/admin/crear/categoria', authMiddleware, roleMiddleware('Admin'), validate(categorySchema), addCategory);
router.get('/admin/ver/categorias', authMiddleware, roleMiddleware('Admin'), readCategories);
router.get('/admin/ver/categoria/:id', authMiddleware, roleMiddleware('Admin'), readCategoryId);
router.patch('/admin/actualizar/categoria/:id', authMiddleware, roleMiddleware('Admin'), validate(updateCategorySchema), updateCategoryId);

//Rutas (endpoints) para el User
router.get('/usuario/ver/categorias', readCategories);
router.get('/usuario/ver/categoria/:id', readCategoryId);

//Exportación de todas las rutas de categoría
module.exports = router;