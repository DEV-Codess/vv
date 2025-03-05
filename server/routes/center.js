// server/routes/center.js
const express = require('express');
const router = express.Router();
const Center = require('../models/Center');

// GET all centres
router.get('/', async (req, res) => {
  try {
    const centers = await Center.find();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new centre (admin only)
router.post('/', async (req, res) => {
  const { code, name, address, phoneNumber } = req.body;
  
  try {
    // Check if code or name already exists
    const existing = await Center.findOne({
      $or: [
        { code: code.trim() },
        { name: name.trim() }
      ]
    });
    if (existing) {
      return res.status(400).json({ message: 'A center with this code or name already exists.' });
    }

    const newCenter = new Center({ code, name, address, phoneNumber });
    await newCenter.save();
    res.status(201).json({ message: 'Centre added successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update center by ID
router.put('/:id', async (req, res) => {
  const { code, name, address, phoneNumber } = req.body;
  try {
    // Check if code or name already exists (excluding current doc)
    const existing = await Center.findOne({
      _id: { $ne: req.params.id },
      $or: [
        { code: code.trim() },
        { name: name.trim() }
      ]
    });
    if (existing) {
      return res.status(400).json({ message: 'A center with this code or name already exists.' });
    }

    const updated = await Center.findByIdAndUpdate(
      req.params.id,
      { code, name, address, phoneNumber },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Center not found.' });
    }
    res.json({ message: 'Center updated successfully', center: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE center by ID
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Center.findByIdAndDelete(req.params.id);
    if (!removed) {
      return res.status(404).json({ message: 'Center not found.' });
    }
    res.json({ message: 'Center deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
