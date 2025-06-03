const express =  require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const productRouter = require("../controllers/productController");



const upload = categoryController.multer;

router.get('/admin/category',categoryController.find);
router.post('/admin/category',upload.single("image"), categoryController.create);
router.get('/admin/category/view/:id', categoryController.view);
router.get('/admin/category/edit/:id', categoryController.editGet);
router.post('/admin/category/edit/:id', categoryController.editpost);
router.post('/admin/category/delete/:id', categoryController.delete);
module.exports = router;