const express = require('express');
const router = new express.Router();
const {
    addCategory,
    readCategories,
    categoryPagination,
    readCategoryId,
    updateCategoryId,
    deleteCategoryId,
    activateCategoryId
} = require('../controllers/category.controller');
const {
    categorySchema,
    updateCategorySchema
} = require('../schemas/category.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/crear/categoria', authMiddleware, roleMiddleware('SuperAdmin', 'Crear'), validateMiddleware(categorySchema), addCategory);
router.get('/superAdmin/ver/categorias', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readCategories);
router.get('/superAdmin/ver/categorias/paginacion', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), categoryPagination);
router.get('/superAdmin/ver/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readCategoryId);
router.patch('/superAdmin/actualizar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Modificar'), validateMiddleware(updateCategorySchema), updateCategoryId);
router.patch('/superAdmin/activar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Modificar'), activateCategoryId);
router.delete('/superAdmin/eliminar/categoria/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteCategoryId);

//Rutas (endpoints) para el Admin
router.post('/admin/crear/categoria', authMiddleware, roleMiddleware('Admin', 'Crear'), validateMiddleware(categorySchema), addCategory);
router.get('/admin/ver/categorias', authMiddleware, roleMiddleware('Admin', 'Ver'), readCategories);
router.get('/admin/ver/categorias/paginacion', authMiddleware, roleMiddleware('Admin', 'Ver'), categoryPagination);
router.get('/admin/ver/categoria/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readCategoryId);
router.patch('/admin/actualizar/categoria/:id', authMiddleware, roleMiddleware('Admin', 'Modificar'), validateMiddleware(updateCategorySchema), updateCategoryId);

//Rutas (endpoints) para el User
router.get('/usuario/ver/categorias', readCategories);
router.get('/usuario/ver/categorias/paginacion', categoryPagination);
router.get('/usuario/ver/categoria/:id', readCategoryId);

//Exportación de todas las rutas de categoría
module.exports = router;