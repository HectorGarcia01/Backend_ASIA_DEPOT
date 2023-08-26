const express = require('express');
const router = new express.Router();
const {
    addCategory
} = require('../controllers/category.controller');
const {
    categorySchema
} = require('../schemas/category.schema');
const validate = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/crear/categoria', authMiddleware, roleMiddleware('SuperAdmin'), validate(categorySchema), addCategory);

//Rutas (endpoints) para el Admin
router.post('/admin/crear/categoria', authMiddleware, roleMiddleware('Admin'), validate(categorySchema), addCategory);

//Rutas (endpoints) para el User

//Exportación de todas las rutas de categoría
module.exports = router;