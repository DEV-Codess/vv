const express = require('express');
const router = express.Router();
const Donor = require('../models/donor');  // Ensure Donor model exists

// GET all donors
router.get('/', async (req, res) => {
  const donors = await Donor.find();
  res.json(donors);
});

// POST new donor
router.post('/', async (req, res) => {
  const donor = new Donor(req.body);
  await donor.save();
  res.json(donor);
});

// PUT update donor
router.put('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!donor) return res.status(404).json({ message: 'Donor not found' });
    res.json({ message: 'Donor updated successfully', donor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE donor
router.delete('/:id', async (req, res) => {
  await Donor.findByIdAndDelete(req.params.id);
  res.json({ message: 'Donor deleted successfully' });
});

module.exports = router;
