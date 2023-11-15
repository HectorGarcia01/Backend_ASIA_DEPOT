const express = require('express');
const router = new express.Router();
const {
    addProductAjustInventory,
    readInventories,
    readInventoryId
} = require('../controllers/inventory.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post('/superAdmin/inventario/nuevo/producto', authMiddleware, roleMiddleware('SuperAdmin', 'Crear'), addProductAjustInventory);
router.get('/superAdmin/ver/inventarios', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readInventories);
router.get('/superAdmin/ver/inventario/:id', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), readInventoryId);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/inventario/nuevo/producto', authMiddleware, roleMiddleware('Admin', 'Crear'), addProductAjustInventory);
router.get('/admin/ver/inventarios', authMiddleware, roleMiddleware('Admin', 'Ver'), readInventories);
router.get('/admin/ver/inventario/:id', authMiddleware, roleMiddleware('Admin', 'Ver'), readInventoryId);

module.exports = router;