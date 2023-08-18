const express = require('express');
const router = new express.Router();
const {
    guardarImagenUsuario
} = require('../controllers/upload_images.controller');
const middlewareAuth = require('../middlewares/auth');
const middlewareRol = require('../middlewares/check_rol');
const middlewareUpload = require('../middlewares/upload_images');

//Configuración de rutas (endpoints) para el SuperAdmin
router.post(
    '/superAdmin/subir/avatar', 
    middlewareAuth, 
    middlewareRol('SuperAdmin'), 
    middlewareUpload.single('avatar'),
    guardarImagenUsuario,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('superAdmin/ver/avatar');

//Configuración de rutas (endpoints) para el Admin
router.post(
    '/admin/subir/avatar',
    middlewareAuth,
    middlewareRol('Admin'),
    middlewareUpload.single('avatar'),
    guardarImagenUsuario,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('admin/ver/avatar');

//Configuración de rutas (endpoints) para el User
router.post(
    '/usuario/subir/avatar',
    middlewareAuth,
    middlewareRol('User'),
    middlewareUpload.single('avatar'),
    guardarImagenUsuario,
    (error, req, res, next) => {
        res.status(400).send({ error: error.message });
    }
);
router.get('usuario/ver/avatar');

//Configuración de rutas (endpoints) para el producto


//Exportación de todas las rutas para el manejo de imágen
module.exports = router;