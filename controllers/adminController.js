const admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const session = require("express-session");



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
            const successMessage = "Signup successful! Please login.";
            req.session.signUp = successMessage;
        }

        res.redirect('/admin/login');
    } catch (error) {
        console.log(error);
        res.status(500).send("Signup Failed");
    }
};

// POST Login
exports.postLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const login = await admin.findOne({ email });

        if (!login) {
            return res.render('login', { error: "Email not found." });
        }

        const Match = await bcrypt.compare(password, login.password);

        if (!Match) {
            return res.render('login', { error: "Password is incorrect." });
        }
        req.session.admin = login
        if(req.session.admin ){
            const successMessage = "login success fully";
            req.session.success = successMessage;
        }
        res.redirect('/admin/dashBord')
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>Server Error</h1>');
    }
};

// GET Login
exports.getLogin = (req, res) =>  {
    if (req.session.admin) {
        return res.redirect('/admin/dashBord');
    }

    const successMessage = req.session.signUp;
    delete req.session.signUp;

    // Check for logout message via query param
    const errorMessage = req.query.logout === 'success' ? "Logout Successfully" : null;

    res.render('login', {
        success: successMessage,
        message: errorMessage
    });
};

// GET SignUp
exports.getSignUp = (req, res) =>  {

    if(req.session.admin) {
        res.redirect('/admin/dashBord');
    }
    res.render('signup');
};

// GET Admin
exports.isAuthenticated = (req, res, next) => {
    if(req.session && req.session.admin) {
        next()
    }else {
        res.redirect('/admin/login');
    }

}

exports.getAuthenticated =  async (req, res) => {
    const successMessage = req.session.success;
    delete req.session.success;

    if(req.session.admin) {
        const data =await admin.find({});
        res.render('dashBord', {admin: req.session.admin, success: successMessage, data});
    }else {
        res.render('login');
    }

};

exports.getDashBord = (req,res) => {
    if(req.session.admin) {
        res.redirect('/admin/dashBord');
    }else{
        res.render('login')
    }
};

exports.getlogout = (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.redirect('/admin/dashBord');
        }

        // Redirect with query parameter
        res.redirect('/admin/login?logout=success');
    });

}
