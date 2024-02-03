const { json } = require('body-parser');
const { sendMail } = require('../services/MAIL');
const { encrypt, compare } = require('../services/crypto')

const nodemailer = require('nodemailer');
const User = require('../models/user');
const Mailgen = require('mailgen');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { match } = require('assert');
const user = require('../models/user');
const { generateToken } = require("../../config/jwtToken");


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}


const registerUserData = async (req, res) => {
  const { fullName, email, password, mobileNumber, gender, dob } = req.body;

  const isExisting = await findUserByEmail(email);
  if (isExisting) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  const newUser = await createUser(fullName, email, password, mobileNumber, gender, dob);
  if (newUser) {
    return res.status(200).json({ success: true, message: 'User created successfully', user: newUser });
  } else {
    return res.status(400).json({ success: false, message: 'Unable to create new user' });
  }
};


const verifyEmail = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const validationResult = await validateUserSignUp(email, otp);

    if (validationResult.success) {
      res.status(200).json({ success: true, user: validationResult.user });
    } else {
      res.status(400).json({ success: false, message: validationResult.message });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const findUserByEmail = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (!user) {
    // return ("Unable to find id in request");
    return false;
  }
  return user;
};

const createUser = async (fullName, email, password, res) => {
  const hashedPassword = await encrypt(password);
  const otpGenerated = generateOTP();
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    otp: otpGenerated,
  });
  if (!newUser) {
    return res.status(400).json(("Unable to create"));
  }
  try {
    await sendMail({
      to: email,
      OTP: otpGenerated,
    });
    return [true, newUser];

  } catch (error) {
    return [false, 'Unable to sign up, Please try again later', error];
  }
};


const validateUserSignUp = async (email, otp) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (user.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    const refreshToken = generateRefreshToken(user._id);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { active: true } },
      { token: refreshToken },
      { new: true }
    );

    if (!updatedUser) {
      return { success: false, message: 'Failed to update user' };
    }

    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, message: 'An error occurred', error: error.message };
  }
};


// const createToken =(id)=>{
//   return jwt.sign({id},"apple")
// }

const loginAdminData = async (req, res) => {
  try {
    // const  email  = req.body;
    // const  password  = req.body;
    const { email, password } = req.body;

    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const match = await bcrypt.compare(password, findUser.password);
      if (match) {
        const OTP = findUser.otp;
        await sendMail({
          to: email,
          OTP,
        });
        return res.render("index")
        // return res.json({ success: true, message: 'OTP sent successfully' });
      } else {
        return res.json({ success: false, message: 'Invalid password' });
      }
    } else {
      return res.json({ success: false, message: 'User not registered' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const frogotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email: email });
    if (findUser) {
      const OTP = findUser.otp;
      await sendMail({
        to: email,
        OTP,
      });
      console.log("OTP sent:", OTP);
      return res.json({ success: true, message: 'OTP sent successfully' });
    }
    else {
      return res.json({ success: false, message: 'User not registered' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const verifyFrogotPassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }
    if (user.otp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { $set: { password: hashedPassword } },
      { new: true }
    );
    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const loginUserData = async (req, res) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email: email });

    if (findUser) {
      const match = await bcrypt.compare(password, findUser.password);

      if (match) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: findUser._id },
          { $set: { active: true } },
          { new: true }
        );
        return res.json({ success: true, message: 'Login successfully', updatedUser });
      } else {
        return res.json({ success: false, message: 'Invalid password' });
      }
    } else {
      return res.json({ success: false, message: 'User not registered' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};


const apploginUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;
    if (!mobileNumber) {
      return res.status(404).json({ success: false, message: 'mobile number not inserted ' });
    }

    const findUser = await User.findOne({ mobileNumber: mobileNumber });

    if (!findUser) {
      const otpGenerated = generateOTP();
      const user = await User.create({
        mobileNumber,
        otp: otpGenerated,
      });
      return res.json({ success: true, message: 'Login otp', user });
    } else {
      const otpGenerated = generateOTP(); // Move this line inside the 'else' block
      const user = await User.findOneAndUpdate(
        { _id: findUser._id },
        { $set: { otp: otpGenerated } },
        { new: true }
      );
      return res.json({ success: true, message: 'Login otp', user });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};
const verifyAppLogin = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  try {
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.json({ success: false, message: 'mobileNumber not found' });
    }
    if (user.otp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    const refreshToken = generateToken(User._id);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          active: true,
          token: refreshToken
        }
      },
      { new: true }
    );
    return res.json({ success: true, message: 'login Sucessfuly', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const getAllUser = async (req, res) => {
  try {
    const getAllUser = await User.find({})
    // .populate({
    //   path: 'user',
    //   select: 'fullName', // Populate the 'user' field with 'fullName'
    // })
    // .populate({
    //   path: 'round_2',
    // populate: {
    //   path: 'chosenDog', // Populate the 'chosenDog' reference in 'rounds'
    //   model: 'Dog', // Specify the model to use (assuming it's 'Dog')
    // },
    // });
    res.json({ getAllUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const getOneUser = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    if (!mobileNumber) {
      return res.status(400).json({ message: 'Mobile number is required' });
    }

    const user = await User.findOne({ mobileNumber });

    if (user) {
      res.json({ user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // User.id = req.body.tech
    const a1 = await user.deleteOne()
    res.send('deleted sucessfully')
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
}


const editUserDetails = async (req, res) => {
  const { fullName, email, password, gender, dob, mobileNumber } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { mobileNumber: mobileNumber },
      { $set: { fullName, email, password, gender, dob } },
      { new: true }
    );

    if (!updatedUser) {
      return res.json({ success: false, message: 'Product not found' });
    }

    return res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'An error occurred' });
  }
};

const findUserById = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (user) {
      res.render('singleProductsTable', {
        user: user,
        title: "Single User"
      });
    } else {
      res.status(404).send('User not found'); // You may want to handle the case where the user is not found
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error'); // Handle other errors appropriately
  }
};



module.exports = {
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


}

