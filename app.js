require("./config/database").connect();
const express = require("express");
const app = express();
const nodemailer = require('nodemailer');
var path = require('path');
const port = 4000

app.use(express.json())
app.use(express.static(__dirname + '/public'));
app.use('/public/images', express.static(__dirname + '/public/images'));
app.use(express.static('public'))
app.use(express.static('node_modules'))


app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  // res.sendFile(path.join(__dirname+'/views/login.html')); 
  res.render("login")
});

app.get('/index', (req, res) => {
  res.render("index")
});

const userRegistration = require('./src/routers/userRegistrationRoutes')
app.use('/user', userRegistration);

const Products = require('./src/routers/productsRoutes');
app.use('/product', Products);

const cart = require('./src/routers/cartRoutes');
app.use('/cart', cart);

const category = require('./src/routers/categoryRoutes');
app.use('/category', category);

const Offer = require('./src/routers/offerRoutes');
app.use('/offer', Offer);

const Banner = require('./src/routers/bannerRoutes');
app.use('/banner', Banner);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

module.exports = app;