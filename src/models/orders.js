const mongoose = require('mongoose')

const ordersSchema = new mongoose.Schema({
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    CartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },

    Address: {
        type: String,
    },

    Payment_Method: {
        type: String,
    },
    Payment_Status: {
        type: String,
    },

    Order_Status: {
        type: String,

    },
    Ordered_Items: {
        type: String,

    },

    TotalAmount: {
        type: String,
        required: true
    },
    Status: {
        type: String,
        required: true,
        enum: ['ordered', 'shipped', 'delivered'],
        default: 'delivered'
    },
    // Remark : {
    //     type: String,
    //     required: true
    // },
    created_at: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Orders', ordersSchema);
