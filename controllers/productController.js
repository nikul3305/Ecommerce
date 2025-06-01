const products = require('../models/productSchema');
const session = require("express-session");
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
    const { name, description, status } = req.body;
    const images = req.files ? req.files.map(file => file.filename) : [];

    try {
        const add = new products({ name, description, status, image : images });
        const productAdd = await add.save();

        if (productAdd) {
            req.session.add = "Product added successfully";
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


        const  create_failed = req.session.create_failed;
        delete req.session.create_failed;

        const  limit = req.session.limit;
        delete req.session.limit;

        const create_message = req.session.add;
        delete req.session.add;

        const update_message = req.session.update;
        delete req.session.update;

        const delete_message = req.session.delete;
        delete req.session.delete;

            req.session.items = items;
        if(items){
            res.render('product', {
                items : req.session.items,
                product_add : create_message,
                product_update : update_message,
                product_delete : delete_message,
                create_failed : create_failed,
                limit : limit,
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
        const view = await products.findById(req.params.id);
        res.render('view',{view : view});
    }catch(err){
        console.log(err);
        res.render('product');
    }
};

exports.editGet  = async (req,res) => {
    const {id} = req.params;
    try{
        const edit = await products.findById(req.params.id);
        res.render('edit',{edit : edit});
    }catch(err){
        console.log(err);
    }
};

exports.editpost = async (req,res) => {
    const { id } = req.params;
    const { name, description, status} = req.body;
    try{
        const updateProduct = await products.findByIdAndUpdate(id,{name, description, status}, {new : true});

        if(updateProduct){
            req.session.update = "product update succesfully";
            res.redirect('/admin/product');
        }
        console.log(updateProduct);
        res.redirect('/admin/product');
    }catch (err){
        console.log(err);
    }
};


exports.delete= async(req,res) => {
    const {id} = req.params;
    try{
        const deleteproduct = await products.findByIdAndDelete(req.params.id);
        if(deleteproduct){
            req.session.delete = "product delete successfully";
            res.redirect('/admin/product');
        }else{
            res.redirect('/admin/product');
        }

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