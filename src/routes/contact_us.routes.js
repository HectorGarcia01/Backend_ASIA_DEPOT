const express = require('express');
const router = new express.Router();
const {
    contactUs
} = require('../controllers/contact_us.controller');
const contactUsScheme = require('../schemas/contact_us.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

router.post('/usuario/contactanos', authMiddleware, roleMiddleware('User'), validateMiddleware(contactUsScheme), contactUs);

//Exportación de todas las rutas del contáctanos
module.exports = router;