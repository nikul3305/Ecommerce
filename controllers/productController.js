const products = require('../models/productSchema');
const session = require("express-session");

exports.create = async (req,res) => {
    const { name, description, status} = req.body;
    try{
        const add = new products({name, description, status});
        await add.save();
        const productAdd = await add.save();
        if(productAdd){
            req.session.add = "product add successfully";
            res.redirect('/admin/product');
        }else{
            res.redirect('/admin/product');
        }
    }catch(err) {
        console.log(err, "product not save");
    }
    res.render('product');
};

exports.find = async (req,res) => {

    try{
        const items  = await products.find();


        const create_message = req.session.add;
        delete req.session.add;
        const update_message = req.session.update;
        delete req.session.update;

        const delete_message = req.session.delete;
        delete req.session.delete;

        if(items){
            res.render('product', {
                items : items, product_add : create_message,
                product_update : update_message,
                product_delete : delete_message
            });
        }else{
            res.render('product');
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