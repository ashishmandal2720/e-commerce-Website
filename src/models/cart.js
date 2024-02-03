const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Products"
      },
      price:{
        type:Number,
      },
      quantity:{
        type:Number,
     },
      size:{
        type:Number,
      }
     
    }, { timestamps: true });
    
    //Export the model
    module.exports = mongoose.model('Cart', cartSchema);
