const express = require('express');
const router = new express.Router();
const {
    addSupplier
} = require('../controllers/supplier.controller');
const supplierSchema = require('../schemas/supplier.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/empleado',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(supplierSchema),
    addSupplier
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nuevo/empleado',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(supplierSchema),
    addSupplier
);

//Exportación de todas las rutas de empleado
module.exports = router;