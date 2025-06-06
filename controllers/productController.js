const products = require('../models/productSchema');
const category = require('../models/categorySchema');
const path = require("path");
const multer = require("multer");


exports.isAuthenticated = (req, res, next) => {
    if(req.session && req.session.admin) {
        next()
    }else {
        res.redirect('/admin/login');
    }
}

exports.create = async (req, res) => {
    const { name, description, status, categoryid } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];
    try {
        const categoryData = await category.findById(categoryid);
        if (!categoryData) {
            req.flash('error','Invalid category selected')
            return res.redirect('/admin/product');
        }
        const add = new products(
            { name,
                description,
                status,
                image : images,
                category: {
                    id: categoryData._id,
                    name: categoryData.name
                 }
            });
        const productAdd = await add.save();

        if (productAdd) {
            req.flash('success','Product added successfully')
            res.redirect('/admin/product');
        } else {
            res.redirect('/admin/product');
        }
    } catch (err) {
        if(err){
            req.session.create_failed = "Product not saved";
            res.redirect('/admin/product');
        }

        console.log(err, "Product not saved");
    }
};

exports.find = async (req,res) => {
    try{
        const items  = await products.find();
        const categoryitem = await category.find();

        req.session.items = items;
        if(items){
            res.render('product', {
                items : req.session.items,
                category : categoryitem
            });
        }else{
            res.redirect('/admin/product');
        }
    }catch(err) {
        console.log(err, "product not save");
    }
}

exports.view = async (req,res) => {
    const { id } = req.params;
    try{
        const productdata = await products.findById(req.params.id);
        res.render('view',{view : productdata, type : "product"});
    }catch(err){
        console.log(err);
        res.render('product');
    }
};

exports.editGet  = async (req,res) => {
    const {id} = req.params;
    try{
        const edit = await products.findById(req.params.id);
        res.render('edit',{edit : edit, type : 'product'});
    }catch(err){
        console.log(err);
    }
};

exports.editpost = async (req,res) => {
    const { id } = req.params;
    const { name, description, status} = req.body;
    try{
        const updateProduct = await products.findByIdAndUpdate(id,{name, description, status}, {new : true});
        req.flash('success','product update succesfully')
        res.redirect('/admin/product');
    }catch (err){
        console.log(err);
    }
};

exports.delete= async(req,res) => {
    const {id} = req.params;
    try{
        const deleteproduct = await products.findByIdAndDelete(req.params.id);

        req.flash('success','product delete successfully');
        res.redirect('/admin/product');

    }catch(err){
        console.log(err);
    }
}

const storage =  multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets/images");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const fileFilter =  (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true); // Accept file
    } else {
        cb(new Error("Only image files are allowed!"));
    }
};
exports.multer =  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

