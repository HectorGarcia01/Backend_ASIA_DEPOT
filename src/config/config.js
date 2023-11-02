require('dotenv').config({ path: `.dev.env` });
const randomPrefix = require('../utils/generate_prefix');

//Exportando las variables de entorno
module.exports = {
    PORT: process.env.PORT,
    DATABASE: process.env.DATABASE,
    USERNAME_DB: process.env.USERNAME_DB,
    PASSWORD_DB: process.env.PASSWORD_DB,
    HOST_DB: process.env.HOST_DB,
    KEY_TOKEN: process.env.KEY_TOKEN,
    KEY_RECAPTCHA: process.env.KEY_RECAPTCHA,
    KEY_RECAPTCHA_SITE: process.env.KEY_RECAPTCHASITE,
    NAME_PREFIX: randomPrefix,
    CLIENT_ID_MAIL: process.env.CLIENT_ID_MAIL,
    CLIENT_SECRET_MAIL: process.env.CLIENT_SECRET_MAIL,
    REDIRECT_URI_MAIL: process.env.REDIRECT_URI_MAIL,
    REFRESH_TOKEN_MAIL: process.env.REFRESH_TOKEN_MAIL
};