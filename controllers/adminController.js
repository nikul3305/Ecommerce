const admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const session = require("express-session");
const products = require('../models/productSchema');


// GET Admin
exports.isAuthenticated = (req, res, next) => {
    if(req.session && req.session.admin) {
        next()
    }else {
        res.redirect('/admin/login');
    }
}
// GET DashBord_page
exports.getDashBord = (req,res) => {
    if(req.session.admin) {
        res.redirect('/admin/dashBord');
    }else{
        res.render('login')
    }
};
// GET Admin DashBord Page
exports.getAuthenticated =  async (req, res) => {
    if(req.session.admin) {
        const Totaluser = await admin.countDocuments();
        const Totalproduct = await products.countDocuments();
        res.render('dashBord', {admin: req.session.admin,  Totaluser , Totalproduct  });
    }else {
        res.render('login');
    }
};


// GET SignUp
exports.getSignUp = (req, res) =>  {
    if(req.session.admin) {
        res.redirect('/admin/dashBord');
    }
    res.render('signup');
};
// POST SignUp
exports.postSignUp = async (req, res) => {
    const { email, password, name, mobileNo } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const Create = new admin({
            email,
            password: hashedPassword,
            name,
            mobileNo
        });
        await Create.save();
         const adminsave  = await Create.save();
        if(adminsave){
            req.flash('success', 'Successfully signup in.', "You're in!");
        }
        res.redirect('/admin/login');
    } catch (err) {
        req.flash('error',  'Your account already exists. Please login.')
        return res.redirect('/admin/signup');
    }
};

// GET Login
exports.getLogin = (req, res) =>  {
    if (req.session.admin) {
        return res.redirect('/admin/dashBord');
    }
    res.render('login');
};
// POST Login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const login = await admin.findOne({ email });

        if (!login) {
            req.flash('error', "Email not found.");
            return res.redirect('/admin/login');
        }

        const Match = await bcrypt.compare(password, login.password);
        if (!Match) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/admin/login');
        }
        req.session.admin = login;
        req.flash('success', "Login successfully");
        return res.redirect('/admin/dashBord');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong.');
        return res.redirect('/admin/login');
    }
};


// GET Logout_page
exports.getLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);

            return res.redirect('/admin/dashBord');
        }

        res.redirect('/admin/login');
    });
};

exports.getProfile = async (req, res ) => {
    const admin = req.session.admin;
    if(admin) {
        res.render('profile', {admin: admin  });
    }else {
        res.render('login');
    }
}





