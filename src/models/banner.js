const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
    name: {
        type: String
    },

    image: {
        type: String,
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Banner', bannerSchema);
