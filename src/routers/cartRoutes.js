const router = require('express').Router();
const User = require('../models/user');

const {
    getAllCart,
    deleteCartData,
    editCartData,
    createCartData

}=require('../controller/cartController');

router.get("/getAllCart",getAllCart)
router.post("/createCartData",createCartData)
router.patch("/editCart",editCartData)
router.delete("/:id", deleteCartData);

  

module.exports = router;