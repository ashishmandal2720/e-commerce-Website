const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    address: {
        type: String,
    },
    type: {
        type: String,
        enum : ['Home','office'],
        default: 'Home'
    },
    phoneNo:{
        type:String,
    }

}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
