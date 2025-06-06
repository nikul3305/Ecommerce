const express = require('express');
const app = express();
const path = require('path');
const router = require('./routes/adminRoutes');
const productRoutes = require('./routes/productRouter');
const categoryRoutes = require('./routes/categoryRoutes');
const dbconnect = require('./config/connect');
const bodyParser = require('body-parser');
const engine = require('ejs-blocks');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


dbconnect();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser('NotSoSecret'));
app.use(session({secret: 'your_secret_key', resave: false, saveUninitialized: true}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    next();
});


app.use('/', router);
app.use('/', productRoutes);
app.use('/', categoryRoutes);


app.listen(3000);