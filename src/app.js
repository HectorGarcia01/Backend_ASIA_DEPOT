const { PORT } = require('./config/config');                           //Cargamos la variable de entorno PORT
const express = require('express');                                    //Cargamos los métodos necesarios de express

const app = express();                                                 //Creamos una instancia de la aplicación de express

//Configuración de cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    next();
});

//Configuramos un manejo de rutas inexistentes
app.get('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Iniciamos el servidor 
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${ PORT }`);
});
