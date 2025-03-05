const express = require("express");
const router = express.Router();
const DonationMode = require("../models/donationMode");

// Fetch all donation modes
router.get("/", async (req, res) => {
  try {
    const modes = await DonationMode.find();
    res.json(modes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new donation mode
router.post("/", async (req, res) => {
  try {
    const newMode = new DonationMode({
      modeName: req.body.modeName
    });
    await newMode.save();
    res.status(201).json(newMode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update donation mode
router.put("/:id", async (req, res) => {
  try {
    const updatedMode = await DonationMode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMode);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete donation mode
router.delete("/:id", async (req, res) => {
  try {
    await DonationMode.findByIdAndDelete(req.params.id);
    res.json({ message: "Donation Mode deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
