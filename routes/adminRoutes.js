const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');   // admin controller


// GET admin dashboard - only accessible if authenticated
const isAuthenticated =  adminController.isAuthenticated;
router.get('/', isAuthenticated, adminController.getDashBord);
router.get('/admin/dashBord', isAuthenticated, adminController.getAuthenticated);


// GET signup_page
router.get('/admin/signup', adminController.getSignUp);
// POST signup_page
router.post('/admin/signup',adminController.postSignUp);


// GET login_page
router.get('/admin/login', adminController.getLogin);
// post login_page
router.post('/admin/login',adminController.postLogin);


// GET logout
router.get('/logout', adminController.getLogout);


// User Data  edit in dashBord page
router.get('/edit/:id', isAuthenticated, adminController.getEdit);
router.post('/edit/:id', isAuthenticated, adminController.postEdit);

// User Data View  - view_page
router.get('/view/:id', isAuthenticated, adminController.getView);


module.exports = router;