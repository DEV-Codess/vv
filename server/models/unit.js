const mongoose = require("mongoose");

const unitSchema = new mongoose.Schema({
  type: { type: String, default: "Simple" }, // defaults to "Simple"
  name: { type: String, required: true },    // label it "Name"
  symbol: { type: String, required: true },
  decimalPlaces: { type: Number, default: 0 },
});

module.exports = mongoose.model("Unit", unitSchema);
