// const mongoose = require('mongoose');

// const centerSchema = new mongoose.Schema({
//     code: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     address: { type: String, required: true },
//     phoneNumber: { type: String, required: true }
// });

// const Center = mongoose.model('Center', centerSchema);
// module.exports = Center;
const mongoose = require('mongoose');

const centerSchema = new mongoose.Schema({
  code: { type: String, unique: true }, // unique constraint on code
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: true }
});

// Pre-save hook to auto-generate code if not provided
centerSchema.pre("save", function (next) {
  if (!this.code) {
    this.code = "CENTER-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Center", centerSchema);
