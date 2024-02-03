const { json } = require('body-parser');

const User = require('../models/user')
const nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');
const Products = require('../models/Products');
const Payments = require('../models/Products');
const Category = require('../models/category');
const Offer = require('../models/offer');


const getAllProducts = async (req, res) => {
    try {
        const allProducts = await Offer.find({})
        res.json({ offer: allProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const editProduct = async (req, res) => {
    const { Name, Price, Type, Description, Category, status, rating, image, size, discount } = req.body;

    try {
        const updatedProduct = await Products.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { Name, Price, Type, Description, Category, status, rating, image, size, discount } },
            { new: true }
        );

        if (!updatedProduct) {
            return res.json({ success: false, message: 'Product not found' });
        }

        return res.json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};



const createCategoryData = async (req, res) => {
    const { 
        categoryName,
        type,
        image } = req.body;

    try {
        const newCategory = await Category.create({
            categoryName,
            type,
            image,
        });

        return res.json({ success: true, product: newCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'An error occurred' });
    }
};




module.exports = {
    getAllProducts,
    deleteProduct,
    editProduct,
    createCategoryData
}

