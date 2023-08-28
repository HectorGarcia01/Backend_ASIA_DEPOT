const express = require('express');
const router = new express.Router();
const {
    addSupplier,
    readSuppliers,
    readSupplierId,
    updateSupplierId,
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
router.patch('/superAdmin/actualizar/proveedor/:id', authMiddleware, roleMiddleware('SuperAdmin'), updateSupplierId);
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
router.patch('/admin/actualizar/proveedor/:id', authMiddleware, roleMiddleware('Admin'), updateSupplierId);

//Exportación de todas las rutas de empleado
module.exports = router;