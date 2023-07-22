const { PORT } = require('./config/config');                           //Cargamos la variable de entorno PORT
const express = require('express');                                    //Cargamos los métodos necesarios de express

const app = express();                                                 //Creamos una instancia de la aplicación de express

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
