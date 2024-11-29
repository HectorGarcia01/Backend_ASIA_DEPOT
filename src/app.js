const express = require('express');
const https = require('https');
// const path = require('path');
const fs = require('fs');

const { PORT } = require('./config/config');
const db = require('./database/db_connection');
const predefinedData = require('./controllers/seed_data.controller');

const customerRoutes = require('./routes/customer.routes');
const addressRoutes = require('./routes/address.routes');
const employeeRoutes = require('./routes/employee.routes');
const authRoutes = require('./routes/auth.routes');
// const activateAccoutnRoutes = require('./routes/activate_account.routes');
const contactUsRoutes = require('./routes/contact_us.routes');
const newsletterRoutes = require('./routes/newsletter.routes');
const imagesRoutes = require('./routes/upload_images.routes');
const shoppingRoutes = require('./routes/shopping.routes');
const supplierRoutes = require('./routes/supplier.routes');
const categoryRoutes = require('./routes/category.routes');
const productBrandRoutes = require('./routes/brand_product.routes');
const productRoutes = require('./routes/product.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const salesInvoiceRoutes = require('./routes/sales_invoice.routes');
const purchaseInvoiceRoutes = require('./routes/purchase_invoice.routes');
const productReviewRoutes = require('./routes/product_review.routes');
const favoriteProductRoutes = require('./routes/favorite_product.routes');
const KPIRoutes = require('./routes/kpi.routes');
const nonexistentRoutes = require('./routes/nonexistent.routes');
// const captchaRoutes = require('./routes/recaptcha.routes');

const app = express();

const sslPath = path.join(__dirname, 'utils');
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'email/views'));

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
    res.setHeader('Access-Control-Allow-Credentials', 'true');
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
// app.use(activateAccoutnRoutes);
app.use(contactUsRoutes);
app.use(newsletterRoutes);
app.use(imagesRoutes);
app.use(shoppingRoutes);
app.use(supplierRoutes);
app.use(categoryRoutes);
app.use(productBrandRoutes);
app.use(productRoutes);
app.use(inventoryRoutes);
app.use(salesInvoiceRoutes);
app.use(purchaseInvoiceRoutes);
app.use(productReviewRoutes);
app.use(favoriteProductRoutes);
app.use(KPIRoutes);
// app.use(captchaRoutes);
app.use(nonexistentRoutes);

//Inicializando el servidor
// https.createServer({
//     cert: fs.readFileSync(path.join(sslPath, '/ssl/server.cer')),
//     key: fs.readFileSync(path.join(sslPath, '/ssl/server.key'))
// }, app).listen(PORT, () => {
//     console.log(`Servidor inicializado en el puerto: ${ PORT }`);
// });

app.listen(PORT, () => {
    console.log(`Servidor inicializado en el puerto: ${ PORT }`);
});