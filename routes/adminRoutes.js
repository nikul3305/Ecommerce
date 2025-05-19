const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// GET dashBord page
router.get('/', adminController.getDashBord);
// GET login page
router.get('/admin/login', adminController.getLogin);
// GET signup page
router.get('/admin/signup', adminController.getSignUp);
router.get('/logout', adminController.getlogout);

// GET admin dashboard - only accessible if authenticated
const isAuthenticated =  adminController.isAuthenticated;
router.get('/admin/dashBord', isAuthenticated, adminController.getAuthenticated);

// post login or signup page
router.post('/admin/login',adminController.postLogin);
router.post('/admin/signup',adminController.postSignUp);

module.exports = router;