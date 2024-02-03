const { json } = require('body-parser');

const User = require('../models/user')
const nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
const Products = require('../models/Products');
const Payments = require('../models/Products');
const Cart = require('../models/cart');


const getAllCart = async (req, res) => {
    try {
        const getAllCart = await Cart.find({})
        .populate({
          path: 'userId',
        //   select: 'fullName', // Populate the 'user' field with 'fullName'
        })
        .populate({
            path: 'productId'
        });
        res.json({ cart: getAllCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteCartData = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id)
        const a1 = await cart.deleteOne()
        res.send('deleted sucessfully')
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


const editCartData = async (req, res) => {
    const { userId, productId, price, quantity, size } = req.body;

    try {
        const updatedCart = await Cart.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { userId, productId, price, quantity, size  } },
            { new: true }
        );

        if (!updatedCart) {
            return res.json({ success: false, message: 'Product not found' });
        }

        return res.json({ success: true, product: updatedCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};



const createCartData = async (req, res) => {
    const { userId, productId, price, quantity, size  } = req.body;

    try {
        const newCart = await Cart.create({
            userId,
            productId,
            price,
            quantity,
            size,
        });

        return res.json({ success: true, product: newCart });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};




module.exports = {
    getAllCart,
    deleteCartData,
    editCartData,
    createCartData
}

