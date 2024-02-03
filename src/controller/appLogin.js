const loginUser = async (req, res) => {
    try {
      const { mobileNumber } = req.body;
      const findUser = await User.findOne({ mobileNumber: mobileNumber });
  
      if (!findUser) {
        const otpGenerated = generateOTP();
        const newUser = await User.create({
          mobileNumber,
          otp: otpGenerated,
        });
        return res.json({ success: true, message: 'Login otp', otp: otpGenerated });
      } else {
        const otpGenerated = generateOTP(); // Move this line inside the 'else' block
        const updatedUser = await User.findOneAndUpdate(
          { _id: findUser._id },
          { $set: { otp: otpGenerated } },
          { new: true }
        );
        return res.json({ success: true, message: 'Login otp', otp: otpGenerated });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'An error occurred' });
    }
  };
  