const express = require('express');
const router = express.Router();
const productRouter = require('../controllers/productController');

// GET product


router.post('/admin/product', productRouter.create);
router.get('/admin/product', productRouter.find);
router.get('/view/:id', productRouter.view);
router.get('/edit/:id', productRouter.editGet);
router.post('/edit/:id', productRouter.editpost);

router.post('/delete/:id', productRouter.delete);

module.exports = router;