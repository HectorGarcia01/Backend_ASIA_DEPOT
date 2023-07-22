require('dotenv').config({ path: `.dev.env` });

//Exportando las variables de entorno
module.exports = {
    PORT: process.env.PORT
}