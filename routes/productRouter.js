const express = require('express');
const router = express.Router();
const productRouter = require('../controllers/productController');







const upload = productRouter.multer;

// GET product
const isAuthenticated =  productRouter.isAuthenticated;
router.post('/admin/product', upload.array("image",5), productRouter.create);

router.get('/admin/product',isAuthenticated, productRouter.find);
router.get('/view/:id', productRouter.view);
router.get('/edit/:id', productRouter.editGet);
router.post('/edit/:id', productRouter.editpost);
router.post('/delete/:id', productRouter.delete);

module.exports = router;