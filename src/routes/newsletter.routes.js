const express = require('express');
const router = new express.Router();
const {
    subscriptionNewsletter,
    unsubscriptionNewsletter
} = require('../controllers/newsletter.controller');
const newsletterScheme = require('../schemas/newsletter.schema');
const validateMiddleware = require('../middlewares/validate');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/check_role_permission');

router.post('/usuario/suscripcion/newsletter', authMiddleware, roleMiddleware('User'), validateMiddleware(newsletterScheme), subscriptionNewsletter);
router.delete('/usuario/anular/suscripcion/newsletter', authMiddleware, roleMiddleware('User'), unsubscriptionNewsletter);

//Exportación de todas las rutas del newsletter
module.exports = router;