const express = require('express');
const User = require('../models/User');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// All routes in this file are protected to admin/dev

// GET /users - list all users
router.get(
  '/users',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const users = await User.find().lean();
      return res.json(users);
    } catch (err) {
      console.error('List users error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// GET /users/:id - get single user
router.get(
  '/users/:id',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id).lean();
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      return res.json(user);
    } catch (err) {
      console.error('Get user error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// POST /users - create user (admin/dev only)
router.post(
  '/users',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { phoneNumber, name, geoLocation, address, cart, role, isVerified } = req.body;

      if (!phoneNumber || !name) {
        return res.status(400).json({ message: 'phoneNumber and name are required.' });
      }

      const existing = await User.findOne({ phoneNumber });
      if (existing) {
        return res.status(409).json({ message: 'User with this phoneNumber already exists.' });
      }

      const user = new User({
        phoneNumber,
        name,
        geoLocation,
        address,
        cart,
        role,
        isVerified
      });

      await user.save();
      return res.status(201).json(user);
    } catch (err) {
      console.error('Create user error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// PUT /users/:id - update user
router.put(
  '/users/:id',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.phoneNumber) {
        const existing = await User.findOne({
          _id: { $ne: id },
          phoneNumber: updates.phoneNumber
        });
        if (existing) {
          return res.status(409).json({ message: 'phoneNumber already in use.' });
        }
      }

      const user = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.json(user);
    } catch (err) {
      console.error('Update user error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// DELETE /users/:id - delete user
router.delete(
  '/users/:id',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      return res.json({ message: 'User deleted successfully.' });
    } catch (err) {
      console.error('Delete user error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

module.exports = router;

