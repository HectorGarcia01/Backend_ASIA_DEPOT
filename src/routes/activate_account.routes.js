const express = require('express');
const router = new express.Router();
const { activateUserAccount } = require('../controllers/activate_account.controller');

router.post('/usuario/activar/cuenta', activateUserAccount);

//Exportación de la ruta de activación de cuenta
module.exports = router;