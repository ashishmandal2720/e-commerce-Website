const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: "",
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  created: {
    type: String,
    default: new Date().toISOString(),
  },
  password: {
    type: String,
    // default: "",
  },
  lastActive: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    // default: "",
  },
  token: {
    type: String,
  },
  image: {
    type: String,
    // default: ''
}
});

module.exports = mongoose.model('User', userSchema);
