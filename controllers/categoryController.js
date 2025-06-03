const category = require('../models/categorySchema');
const path = require('path');
const multer = require('multer');


exports.isAuthenticated = (req, res, next) => {
    if(req.session && req.session.admin) {
        next()
    }else {
        res.redirect('/admin/login');
    }
}

exports.create = async (req, res) => {
    const { name, description, status } = req.body;
    const image = req.file ? req.file.filename : null;
    try {
        const add = new category({ name, description, status, image});
        const categoryAdd = await add.save();

        if (categoryAdd) {
            req.session.add = "Product added successfully";
            res.redirect('/admin/category');
        } else {
            res.redirect('/admin/category');
        }
    } catch (err) {
        if(err){
            req.session.create_failed = "Product not saved";
            res.redirect('/admin/category');
        }

        console.log(err, "Product not saved");
    }
};

exports.find = async (req,res) => {
    try{
        const find  = await category.find();


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

        req.session.find = find;
        if(find){
            res.render('category', {
                find : req.session.find,
                product_add : create_message,
                product_update : update_message,
                product_delete : delete_message,
                create_failed : create_failed,
                limit : limit,
            });
        }else{
            res.redirect('/admin/category');
        }
    }catch(err) {
        console.log(err, "product not save");

    }
}

exports.view = async (req,res) => {
    const { id } = req.params;
    try{
        const categorydata = await category.findById(req.params.id);
        res.render('view',{view : categorydata, type : "category"});
    }catch(err){
        console.log(err);
        res.render('category');
    }
};

exports.editGet  = async (req,res) => {
    const {id} = req.params;
    try{
        const edit = await category.findById(req.params.id);
        res.render('edit',{edit : edit, type : "category"});
    }catch(err){
        console.log(err);
    }
};

exports.editpost = async (req,res) => {
    const { id } = req.params;
    const { name, description, status} = req.body;
    try{
        const updatecategory = await category.findByIdAndUpdate(id,{name, description, status}, {new : true});

        if(updatecategory){
            req.session.update = "product update succesfully";
            res.redirect('/admin/category');
        }
        console.log(updatecategory);
        res.redirect('/admin/category');
    }catch (err){
        console.log(err);
    }
};

exports.delete = async(req,res) => {
    const {id} = req.params;
    try{
        const deleteproduct = await category.findByIdAndDelete(req.params.id);
        if(deleteproduct){
            req.session.delete = "product delete successfully";
            res.redirect('/admin/category');
        }else{
            res.redirect('/admin/login');
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