const admin = require('../models/adminSchema');
const bcrypt = require('bcryptjs');


exports.SignUp = async (req, res) => {
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
        res.redirect('/admin/login');
    } catch (error) {
        console.log(error);
        res.status(500).send("Signup Failed");
    }
};

exports.Login = async (req, res) => {
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
        // Session create
        req.session.admin = login;

        res.redirect('/admin/dashBord')
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>Server Error</h1>');
    }
};




