const router = require('express').Router();
const uploadOptions = require("../middleware/uploadImage")
const { isAdmin, authMiddleware } = require("../middleware/auth")

const {
  getAllProducts,
  deleteProduct,
  editProduct,
  // createProductData


} = require('../controller/offerController');
const Products = require('../models/Products');
const Payments = require('../models/payments');
const Orders = require('../models/orders');
const payments = require('../models/payments');
const Category = require('../models/category');
const Offer = require('../models/offer');


router.get("/allproducts", getAllProducts);
router.delete("/:id", deleteProduct);
router.patch("/edit/:id", editProduct);
// router.post("/create", createProductData);


router.get('/productPage', (req, res) => {
  Products.find({})
    .then((x) => {
      res.render("productsTable", { x })
      console.log(x)
    })
    .catch((y) => {
      console.log(y)
    })
})
router.get('/singleProductpage', (req, res) => {
  Payments.find({})
    .then((x) => {
      res.render("singleProductsTable", { x })
      console.log(x)
    })
    .catch((y) => {
      console.log(y)
    })
})
// router.get('/singleProductpage', (req, res) => {
//       res.render("singleProductsTable", { pro:Products })
// })


router.post(`/image`, uploadOptions.single('image'), async (req, res) => {

  const file = req.file;
  const { title, percent } = req.body;

  const offer1 = await Offer.findOne({ title });
  if (offer1) return res.status(400).send('Category already exists')


  // if (!file) return res.status(400).send('No image in the request')

  const fileName = file.filename
  const basePath = `${req.protocol}://${req.get('host')}/public/images/`;
  let offer = new Offer({
    title: title,
    percent: percent,
    image: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
  })

  offer = await offer.save();

  if (!offer)
    return res.status(500).send('The product cannot be created')
  else {
    res.send(offer);
  }
})

router.get('/image/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Retrieve the product by its ID from your database
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Send the image as a response
    res.send(product.image);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



module.exports = router;