const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRouter');

const dbconnect = require('./config/connect');
const bodyParser = require('body-parser');
const session = require('express-session');
const engine = require('ejs-blocks');




app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));


dbconnect();
//settings
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', router);

app.use('/', productRoutes);

app.listen(3000);