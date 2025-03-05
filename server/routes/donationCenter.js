const express = require("express");
const router = express.Router();
const DonationCenter = require("../models/donationCenter");

// ✅ Correct Route
router.get("/", async (req, res) => {
  try {
    const centers = await DonationCenter.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  console.log("POST Request Received:", req.body); // ✅ Log incoming requests

  try {
    const newCenter = new DonationCenter({
      area: req.body.area,
      centerName: req.body.centerName,
    });
    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (error) {
    console.error("Server Error:", error); // ✅ Log server errors
    res.status(500).json({ message: error.message });
  }
});

// UPDATE donation center
router.put("/:id", async (req, res) => {
  try {
    const updatedCenter = await DonationCenter.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCenter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE donation center
router.delete("/:id", async (req, res) => {
  try {
    await DonationCenter.findByIdAndDelete(req.params.id);
    res.json({ message: "Donation Center deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
