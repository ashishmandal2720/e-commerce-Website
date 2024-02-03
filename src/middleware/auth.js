const jwt = require('jsonwebtoken');
const User = require("../models/user");

const authMiddleware = (async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, "apple");
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      res.status(401).send("Token expired or invalid"); }
  } else {
    res.status(401).send("No token provided");  }
});
const isAdmin = (async(req,res,next) => {
   const {email} = req.user;
  try {
    const isAdmin = await User.findOne({email});
    if(isAdmin.role !=="admin"){
        throw new Error("You are not admin");
    } else{
        next();
    }
  } catch (error) {
    throw new Error(error);
  }
})

module.exports = { authMiddleware,isAdmin };
