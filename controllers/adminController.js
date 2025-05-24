const admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const session = require("express-session");


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
    const successMessage = req.session.login_success;
    delete req.session.login_success;


    const updatemessage = req.session.edit;
    delete req.session.edit;

    if(req.session.admin) {
        const data =await admin.find({});
        res.render('dashBord', {admin: req.session.admin, login_success: successMessage, data , edit : updatemessage});
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
            const successMessage = "Signup successful! Please login.";
            req.session.signUp_success = successMessage;
        }

        res.redirect('/admin/login');
    } catch (error) {
        console.log(error);
        res.render('signup',{signup_err : "Your account already exists.pls login" });
        // res.status(500).send("Signup Failed");
    }
};



// GET Login
exports.getLogin = (req, res) =>  {
    if (req.session.admin) {
        return res.redirect('/admin/dashBord');
    }

    const successMessage = req.session.signUp_success ;
    delete req.session.signUp_success ;

    // Check for logout message via query param
    const errorMessage = req.query.logout === 'success' ? "Logout Successfully" : null;

    res.render('login', {
        signUp_success: successMessage,
        logout_success: errorMessage
    });
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
            req.session.login_success = successMessage;
        }
        res.redirect('/admin/dashBord')
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>Server Error</h1>');
    }
};

// GET Logout_page
exports.getLogout = (req, res) => {

    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.redirect('/admin/dashBord');
        }

        // Redirect with query parameter
        res.redirect('/admin/login?logout=success');
    });

}

// GET edit_page
exports.getEdit = async (req,res) => {
    const userData = await admin.findById({'_id': req.params.id});
    if(userData){
        res.render('edit',{userdata:userData});
    }else{
        res.redirect('/admin/dashBord');
    }
};
// POST edit_page  - user data update
exports.postEdit = async (req, res) => {
    const { name, mobileNo, email } = req.body;
    try {
        const userdata = await admin.findByIdAndUpdate(
            req.params.id,
            {
                name,
                mobileNo,
                email
            },
            { new: true }
        );

        req.session.edit = "update successfully";

        if (userdata) {
            res.redirect('/admin/dashBord');
        } else {
            res.redirect('/admin/dashBord');
        }
    } catch (err) {
        console.error("Edit error:", err);
        res.status(500).send("Internal Server Error");
    }
};


exports.getView = async (req,res) => {
    const userDataview = await admin.findById({'_id': req.params.id});
    if(userDataview){
        res.render('view',{userdata:userDataview});
    }else{
        res.redirect('/admin/dashBord');
    }
};
