const { PORT } = require('./config/config');
const express = require('express');
const db = require('./database/db_connection');
const predefinedData = require('./controllers/seed_data.controller');
const customerRoutes = require('./routes/customer.routes');
const addressRoutes = require('./routes/address.routes');
const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');
const imagesRoutes = require('./routes/upload_images.routes');
const supplierRoutes = require('./routes/supplier.routes');
const categoryRoutes = require('./routes/category.routes');
const productRoutes = require('./routes/product.routes');
const productReviewRoutes = require('./routes/product_review.routes');

const app = express();    

//Conexión a la base de datos
(async () => {
    try {
        await db.authenticate();
        await db.sync();
        await predefinedData();
    } catch (error) {
        throw new Error(error);
    }
})()

//Configuración de cors
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");
    next();
});

app.use(express.json());

//Configuración de rutas
app.use(customerRoutes);
app.use(addressRoutes);
app.use(employeeRoutes);
app.use(authRoutes);
app.use(imagesRoutes);
app.use(supplierRoutes);
app.use(categoryRoutes);
app.use(productRoutes);
app.use(productReviewRoutes);

//Configuración del manejo de rutas inexistentes
app.get('*', (req, res) => {
    //Enviamos un estado de error 404 y un objeto
    res.status(404).send({
        title: '404',
        errorMessage: "Página no encontrada."
    });
});

//Inicializando el servidor 
app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${ PORT }`);
});
