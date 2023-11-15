const express = require('express');
const router = new express.Router();
const {
    KPICustomer,
    KPICustomerCount,
    KPISales,
    KPIProducts
} = require('../controllers/kpi.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/KPI/count/customers', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), KPICustomer);
router.get('/superAdmin/KPI/count/new/customers', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), KPICustomerCount);
router.get('/superAdmin/KPI/count/sales', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), KPISales);
router.get('/superAdmin/KPI/products', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), KPIProducts);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/KPI/count/customers', authMiddleware, roleMiddleware('Admin', 'Ver'), KPICustomer);
router.get('/admin/KPI/count/new/customers', authMiddleware, roleMiddleware('Admin', 'Ver'), KPICustomerCount);
router.get('/admin/KPI/count/sales', authMiddleware, roleMiddleware('Admin', 'Ver'), KPISales);
router.get('/admin/KPI/products', authMiddleware, roleMiddleware('Admin', 'Ver'), KPIProducts);

module.exports = router;