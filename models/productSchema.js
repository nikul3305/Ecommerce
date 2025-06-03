const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:String,
        required:true
    },
    image: {
        type: [String],
        required:true
    },
    category : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required:true
        },
        name : {
            type:String,
            required:true,
        }
    },
},
    {
        timestamps:true
    });

module.exports = mongoose.model('products', productSchema);