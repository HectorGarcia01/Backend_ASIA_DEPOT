const express = require('express');
const router = new express.Router();

//Configuración del manejo de rutas inexistentes para GET
router.get('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Configuración del manejo de rutas inexistentes para POST
router.post('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Configuración del manejo de rutas inexistentes para PATCH
router.patch('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Configuración del manejo de rutas inexistentes para DELETE
router.delete('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

module.exports = router;