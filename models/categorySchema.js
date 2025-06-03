const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    }
},
    {
    timestamps: true,
});

module.exports = mongoose.model('category', categorySchema);