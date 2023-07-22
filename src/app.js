const { PORT } = require('./config/config');                           //Cargamos la variable de entorno PORT
const express = require('express');                                    //Cargamos los métodos necesarios de express

const app = express();                                                 //Creamos una instancia de la aplicación de express

//Iniciamos el servidor 
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${ PORT }`);
});
