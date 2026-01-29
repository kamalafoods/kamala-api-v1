const express = require('express');
const Pickle = require('../models/Pickle');
const { authenticate, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// GET /getAllPickles
router.get('/getAllPickles', async (req, res) => {
  try {
    const pickles = await Pickle.find().lean();
    return res.json(pickles);
  } catch (err) {
    console.error('Get all pickles error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// GET /getPickle/:pickleSlug
router.get('/getPickle/:pickleSlug', async (req, res) => {
  try {
    const { pickleSlug } = req.params;
    const pickle = await Pickle.findOne({ pickleSlug }).lean();

    if (!pickle) {
      return res.status(404).json({ message: 'Pickle not found.' });
    }

    return res.json(pickle);
  } catch (err) {
    console.error('Get pickle error', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

// Protected CRUD routes for Pickle (admin/dev only)

// POST /pickles - create pickle
router.post(
  '/pickles',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { name, price, stock, description, ingredients, pickleSlug } = req.body;

      if (!name || price == null || stock == null || !pickleSlug) {
        return res.status(400).json({
          message: 'name, price, stock and pickleSlug are required.'
        });
      }

      const existing = await Pickle.findOne({ pickleSlug });
      if (existing) {
        return res.status(409).json({ message: 'pickleSlug already exists.' });
      }

      const pickle = new Pickle({
        name,
        price,
        stock,
        description,
        ingredients,
        pickleSlug
      });

      await pickle.save();
      return res.status(201).json(pickle);
    } catch (err) {
      console.error('Create pickle error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// PUT /pickles/:id - update pickle
router.put(
  '/pickles/:id',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      if (updates.pickleSlug) {
        const existing = await Pickle.findOne({
          _id: { $ne: id },
          pickleSlug: updates.pickleSlug
        });
        if (existing) {
          return res.status(409).json({ message: 'pickleSlug already exists.' });
        }
      }

      const pickle = await Pickle.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true
      });

      if (!pickle) {
        return res.status(404).json({ message: 'Pickle not found.' });
      }

      return res.json(pickle);
    } catch (err) {
      console.error('Update pickle error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

// DELETE /pickles/:id - delete pickle
router.delete(
  '/pickles/:id',
  authenticate,
  authorizeRoles('admin', 'dev'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const pickle = await Pickle.findByIdAndDelete(id);
      if (!pickle) {
        return res.status(404).json({ message: 'Pickle not found.' });
      }

      return res.json({ message: 'Pickle deleted successfully.' });
    } catch (err) {
      console.error('Delete pickle error', err);
      return res.status(500).json({ message: 'Internal server error.' });
    }
  }
);

module.exports = router;

