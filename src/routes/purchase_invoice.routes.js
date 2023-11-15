const express = require('express');
const router = new express.Router();
const {
    addPurchaseInvoice,
    readPurchaseInvoiceProcess,
    deleteProductIdPurchaseInvoice,
    deletePurchaseInvoiceProcess,
    changePurchaseInvoiceComplete
} = require('../controllers/purchase_invoice.controller');
// const { shoppingSchema } = require('../schemas/shopping.schema');
// const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/nueva/compra',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Crear'),
    // validateMiddleware(shoppingSchema),
    addPurchaseInvoice
);
router.get('/superAdmin/ver/compra/proceso', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readPurchaseInvoiceProcess);
router.delete('/superAdmin/compra/eliminar/producto/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deleteProductIdPurchaseInvoice);
router.delete('/superAdmin/eliminar/compra/proceso', authMiddleware, roleMiddleware('SuperAdmin', 'Eliminar'), deletePurchaseInvoiceProcess);
router.patch(
    '/superAdmin/actualizar/estado/compra/completado',
    authMiddleware,
    roleMiddleware('SuperAdmin', 'Modificar'),
    changePurchaseInvoiceComplete
);

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/nueva/compra',
    authMiddleware,
    roleMiddleware('Admin', 'Crear'),
    // validateMiddleware(shoppingSchema),
    addPurchaseInvoice
);
router.get('/admin/ver/compra/proceso', authMiddleware, roleMiddleware('Admin', 'Ver'), readPurchaseInvoiceProcess);
router.delete('/admin/compra/eliminar/producto/:id', authMiddleware, roleMiddleware('Admin', 'Eliminar'), deleteProductIdPurchaseInvoice);
router.delete('/admin/eliminar/compra/proceso', authMiddleware, roleMiddleware('Admin', 'Eliminar'), deletePurchaseInvoiceProcess);
router.patch(
    '/admin/actualizar/estado/compra/completado',
    authMiddleware,
    roleMiddleware('Admin', 'Modificar'),
    changePurchaseInvoiceComplete
);

module.exports = router;