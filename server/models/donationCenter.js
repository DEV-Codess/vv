const mongoose = require("mongoose");

const donationCenterSchema = new mongoose.Schema({
  area: { type: String, required: true },
  centerName: { type: String, required: true }
});

module.exports = mongoose.model("DonationCenter", donationCenterSchema);
