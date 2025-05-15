const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');


router.get('/',(req,res) => req.session.admin ? res.redirect('/admin/dashBord') : res.render('login'));
router.get('/admin/dashBord',(req,res) => req.session.admin ? res.render('dashBord',{ admin: req.session.admin }) : res.render('login'));
router.get('/admin/login', (req, res) =>  req.session.admin ?  res.redirect('/admin/dashBord') : res.render('login'));
router.get('/admin/signup', (req, res) => req.session.admin ? res.redirect('/admin/dashBord') : res.render('signup'));

const isAuthenticated = (req, res, next) => req.session.admin ? next() : res.redirect('/admin/login');
router.get('/admin/dashBord', isAuthenticated, (req, res) => res.render('dashBord', { admin: req.session.admin }));


router.post('/admin/login',adminController.Login);
router.post('/admin/signup',adminController.SignUp);

module.exports = router;