const mongoose = require('mongoose')

const paymentsSchema = new mongoose.Schema({
    OrderId: {
        type: String,
        required: true
    },
    Amount: {
        type: String,
        required: true
    },
    PaymentType: {
        type: String,
        required: true
    },
    // Category : {
    //     type: String,
    //     required: true
    // },
	Remark : {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    },
})

module.exports = mongoose.model('Payments', paymentsSchema);
