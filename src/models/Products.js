const mongoose = require('mongoose')

const productsSchema = new mongoose.Schema({
    Name: {
        type: String,
        // required: true
    },
    Price: {
        type: String,
        // required: true
    },
    Type: {
        type: String,
        // required: true
    },
    size: {
        type: String,
        // required: true
    },
    Category: {
        type: String,
        // required: true
    },
    Description: {
        type: String,
        // required: true
    },
    created_at: {
        type: Date,
        // required: true
    },
    image: {
        type: String,
    },
    rating: {
        type: String,
    },
    status: {
        type: String,
    },
    discount: {
        type: String,
    }

})

module.exports = mongoose.model('Products', productsSchema);
