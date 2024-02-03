const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    percent: {
        type: String,
    },
    image: {
        type: String,
    }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Offer', offerSchema);
