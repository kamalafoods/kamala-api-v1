const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { setOtp, verifyOtp } = require('../services/otpService');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const JWT_EXPIRES_IN = '7d';

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /signup - only name and phone number - send otp
router.post('/signup', async (req, res) => {
  try {
    // Explicitly only pick phoneNumber and name to avoid accepting role from body
    const { phoneNumber, name } = req.body;

    if (!phoneNumber || !name) {
      return res.status(400).json({ message: 'phoneNumber and name are required.' });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({
        phoneNumber,
        name
      });
      await user.save();
    }

    setOtp(phoneNumber);

    return res.json({
      message: 'OTP sent to phone number for signup.'
    });
  } catch (err) {
    console.error('Signup error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /signupconfirm - confirm OTP
router.post('/signupconfirm', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'phoneNumber and otp are required.' });
    }

    const isValid = verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { $set: { isVerified: true } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Signup confirmed.',
      user,
      token
    });
  } catch (err) {
    console.error('Signup confirm error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /login - take phone number - send otp
router.post('/login', async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'phoneNumber is required.' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please sign up first.' });
    }

    setOtp(phoneNumber);

    return res.json({
      message: 'OTP sent to phone number for login.'
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// POST /loginConfirm - confirm OTP
router.post('/loginconfirm', async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({ message: 'phoneNumber and otp are required.' });
    }

    const isValid = verifyOtp(phoneNumber, otp);
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = generateToken(user);

    return res.json({
      message: 'Login confirmed.',
      user,
      token
    });
  } catch (err) {
    console.error('Login confirm error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;

