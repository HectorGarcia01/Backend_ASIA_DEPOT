const express = require('express');
const router = new express.Router();
const {
    addSupplier,
    readSuppliers,
    readSupplierId,
    deleteSupplierId
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
router.get('/superAdmin/ver/proveedor/:id', authMiddleware, roleMiddleware('SuperAdmin'), readSupplierId);
router.delete('/superAdmin/eliminar/proveedor/:id', authMiddleware, roleMiddleware('SuperAdmin'), deleteSupplierId);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('Admin'),
    validateMiddleware(supplierSchema),
    addSupplier
);
router.get('/admin/ver/proveedores', authMiddleware, roleMiddleware('Admin'), readSuppliers);
router.get('/admin/ver/proveedor/:id', authMiddleware, roleMiddleware('Admin'), readSupplierId);
router.delete('/admin/eliminar/proveedor/:id', authMiddleware, roleMiddleware('Admin'), deleteSupplierId);

//Exportación de todas las rutas de empleado
module.exports = router;