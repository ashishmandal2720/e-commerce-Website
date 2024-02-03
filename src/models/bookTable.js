const mongoose = require("mongoose");

const BookTableSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  people: {
    type: ["string"]
  },
  price: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  size: {
    type: Number,
  }

}, { timestamps: true });

//Export the model
module.exports = mongoose.model('BookTable', BookTableSchema);
