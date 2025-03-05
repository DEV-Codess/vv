const mongoose = require("mongoose");

const donationModeSchema = new mongoose.Schema({
  modeName: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("DonationMode", donationModeSchema);
