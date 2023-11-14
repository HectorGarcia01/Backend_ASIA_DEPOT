const express = require('express');
const router = new express.Router();
const {
    addSupplier,
    readSuppliers,
    readSupplierId,
    updateSupplierId,
    deleteSupplierId,
    activateSupplierId
} = require('../controllers/supplier.controller');
const {
    supplierValidateSchema,
    updateSupplierValidateSchema
} = require('../schemas/supplier.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Crear'),
    validateMiddleware(supplierValidateSchema),
    addSupplier
);
router.get('/superAdmin/ver/proveedores', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readSuppliers);
router.get('/superAdmin/ver/proveedor/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readSupplierId);
router.patch(
    '/superAdmin/actualizar/proveedor/:id', 
    authMiddleware, 
    roleMiddleware('SuperAdmin', 'Modificar'), 
    validateMiddleware(updateSupplierValidateSchema),
    updateSupplierId
);
router.patch(
    '/superAdmin/activar/proveedor/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    activateSupplierId
);
router.delete('/superAdmin/eliminar/proveedor/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteSupplierId);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nuevo/proveedor',
    authMiddleware,
    roleMiddleware('Admin', 'Crear'),
    validateMiddleware(supplierValidateSchema),
    addSupplier
);
router.get('/admin/ver/proveedores', authMiddleware, roleMiddleware('Admin', 'Ver'), readSuppliers);
router.get('/admin/ver/proveedor/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readSupplierId);
router.patch(
    '/admin/actualizar/proveedor/:id', 
    authMiddleware, 
    roleMiddleware('Admin', 'Modificar'), 
    validateMiddleware(updateSupplierValidateSchema),
    updateSupplierId
);

//Exportación de todas las rutas de proveedor
module.exports = router;