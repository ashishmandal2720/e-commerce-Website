const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    categoryName: {
        type: String,
    },
    type: {
        type: String,
    },
    image: {
        type: String,
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Category', categorySchema);
