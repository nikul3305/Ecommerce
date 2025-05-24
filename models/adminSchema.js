const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [8, 'Password must be at least 8 characters long'],
        // maxlength: [20, 'Password must be at most 20 characters long']
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobileNo: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function(v) {
                return /^[0-9]{10}$/.test(v); // Exactly 10 digits
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    }

},{
    timestamps: true,
})

module.exports = mongoose.model('admin', adminSchema);



