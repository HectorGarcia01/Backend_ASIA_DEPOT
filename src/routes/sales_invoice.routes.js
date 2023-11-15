const express = require('express');
const router = new express.Router();
const {
    readSalesInvoices,
    readSalesInvoiceId,
    changeSalesInvoiceProcess,
    changeSalesInvoiceComplete
} = require('../controllers/sales_invoice.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/ver/ventas', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readSalesInvoices);
router.get('/superAdmin/ver/venta/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readSalesInvoiceId);
router.patch(
    '/superAdmin/actualizar/estado/venta/proceso/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    changeSalesInvoiceProcess
);
router.patch(
    '/superAdmin/actualizar/estado/venta/completado/:id',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    changeSalesInvoiceComplete
);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/ver/ventas', authMiddleware, roleMiddleware('Admin', 'Ver'), readSalesInvoices);
router.get('/admin/ver/venta/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readSalesInvoiceId);
router.patch(
    '/admin/actualizar/estado/venta/proceso/:id',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    changeSalesInvoiceProcess
);
router.patch(
    '/admin/actualizar/estado/venta/completado/:id',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    changeSalesInvoiceComplete
);

module.exports = router;