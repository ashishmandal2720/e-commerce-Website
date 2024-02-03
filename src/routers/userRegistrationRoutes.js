const router = require('express').Router();
const User = require('../models/user');
const {isAdmin,authMiddleware} = require("../middleware/auth")
const uploadOptions = require("../middleware/uploadImage")


const {
    registerUserData,
    loginUserData,
    loginAdminData,
    verifyEmail,
    frogotPassword,
    verifyFrogotPassword,
    getAllUser,
    deleteUser,
    apploginUser,
    verifyAppLogin,
    editUserDetails,
    getOneUser,
    findUserById
    
}=require('../controller/userRegistrationController');

router.get("/getAllUser",authMiddleware,getAllUser)
router.post("/register",  registerUserData)
router.post("/loginAdmin",loginAdminData)
router.patch("/loginUser",loginUserData)
router.patch("/applogin",apploginUser)
router.patch("/verifyLogin",verifyAppLogin)
router.patch("/verify", verifyEmail);
router.post("/forgot", frogotPassword);
router.patch("/verifyForgot", verifyFrogotPassword);
router.delete("/:id", deleteUser);
router.post("/getSingleUser",authMiddleware, getOneUser);
router.patch("/editUser", editUserDetails)


router.get('/index', (req, res) => {
  res.render("index") 
})

router.get('/single/:id',findUserById)


router.get('/userPage', (req, res) => {
  User.find({})
  .then((x)=>{
    res.render("usersTable", {x}) 
    console.log(x)
  })
  .catch((y)=>{
    console.log(y)
  })
  })


router.get('/productPage', (req, res) => {
  User.find({})
  .then((x)=>{
    res.render("productsTable", {x}) 
    console.log(x)
  })
  .catch((y)=>{
    console.log(y)
  })
  })

  router.post(`/image`, uploadOptions.single('image'), async (req, res) => {
    const user1 = await User.findById(req.body.category);
    if (!category) return res.status(400).send('Invalid Category')
  
    const file = req.file;
    if (!file) return res.status(400).send('No image in the request')
  
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/images/`;
    let user = new User({
      image: `${basePath}${fileName}`,// "http://localhost:3000/public/upload/image-2323232"
    })
  
    user = await user.save();
  
    if (!user)
      return res.status(500).send('The product cannot be created')
  
    res.send(user);
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