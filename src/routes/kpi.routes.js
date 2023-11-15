const express = require('express');
const router = new express.Router();
const {
    KPICustomer
} = require('../controllers/kpi.controller');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

//Configuración de rutas (endpoints) para el SuperAdmin
router.get('/superAdmin/KPI/count/customers', authMiddleware, roleMiddleware('SuperAdmin', 'Ver'), KPICustomer);

//Configuración de rutas (endpoints) para el Admin
router.get('/admin/KPI/count/customers', authMiddleware, roleMiddleware('Admin', 'Ver'), KPICustomer);

module.exports = router;