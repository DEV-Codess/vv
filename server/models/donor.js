const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  fullName: String,
  address: String,
  mobile: String,
  whatsapp: String,
  email: String,
  ref: String,
  pan: String,
  birthDate: String,
  wifeName: String,
  wifeBirthDate: String,
  anniversary: String,
  donationCentre: String,
});

module.exports = mongoose.model("Donor", donorSchema);
