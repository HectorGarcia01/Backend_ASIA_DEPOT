const express = require('express');
const router = new express.Router();
const {
    addSupplier,
    readSuppliers
} = require('../controllers/supplier.controller');
const supplierSchema = require('../schemas/supplier.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_rol');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('SuperAdmin'),
    validateMiddleware(supplierSchema),
    addSupplier
);
router.get('/superAdmin/ver/proveedores', authMiddleware, roleMiddleware('SuperAdmin'), readSuppliers);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(supplierSchema),
    addSupplier
);
router.get('/admin/ver/proveedores', authMiddleware, roleMiddleware('Admin'), readSuppliers);

//Exportación de todas las rutas de empleado
module.exports = router;