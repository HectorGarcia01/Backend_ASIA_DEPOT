const generateRandomPrefix = () => {
    try {
        // return Math.random().toString(36).substring(7);
        return 'TempPrefix'
    } catch (error) {
        throw new Error("Error al general un prefijo");
    }
};

const randomPrefix = generateRandomPrefix();

//Exportación de la función para generar prefijo
module.exports = randomPrefix;