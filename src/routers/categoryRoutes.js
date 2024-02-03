const router = require('express').Router();
const uploadOptions = require("../middleware/uploadImage")
const {isAdmin,authMiddleware} = require("../middleware/auth")


const {
  getAllProducts,
  deleteCategory,
  editProduct,
  // createProductData


} = require('../controller/categoryController');
const Products = require('../models/Products');
const Payments = require('../models/payments');
const Orders = require('../models/orders');
const payments = require('../models/payments');
const Category = require('../models/category');


router.post("/allproducts", getAllProducts);
router.delete("/:id", deleteCategory);
router.patch("/edit/:id", editProduct);
// router.post("/create", createProductData);





router.post(`/image`, uploadOptions.single('image'), async (req, res) => {

  const file = req.file;
  const { categoryName, type } = req.body;

  const category = await Category.findOne({ categoryName });
  if (category) return res.status(400).send('Category already exists')


  // if (!file) return res.status(400).send('No image in the request')

  const fileName = file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/images/`;
  let product1 = new Category({
    categoryName: categoryName,
    type: type,
    image: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
  })

  product1 = await product1.save();

  if (!product1)
    return res.status(500).send('The product cannot be created')
  else {
    res.send(product1);
  }
})




module.exports = router;