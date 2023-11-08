const { KEY_RECAPTCHA, KEY_RECAPTCHA_SITE } = require('../config/config');

const sendRecaptchaKey = (req, res) => {
    try {
        const recaptchaSecretKey = KEY_RECAPTCHA;
        const recaptchaSiteKey = KEY_RECAPTCHA_SITE;
        res.status(200).send({ recaptchaSecretKey, recaptchaSiteKey });
    } catch (error) {
        
    }
};

module.exports = {
    sendRecaptchaKey
};