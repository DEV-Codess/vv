// const mongoose = require("mongoose");

// const inventorySchema = new mongoose.Schema({
//   productName: { type: String, required: true },
//   region: { type: String, required: true },
//   category: { type: String, required: true },
//   unit: { type: String, required: true },
//   storageLocation: { type: String, required: true },
//   minInventory: { type: Number, required: true, min: 0 },
//   maxInventory: { type: Number, required: true, min: 0 },
//   photo: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads.files' },  // Store file ID from GridFS
// });

// module.exports = mongoose.model("Inventory", inventorySchema);
const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  code: { type: String, unique: true }, // auto-generated
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  unit: { type: mongoose.Schema.Types.ObjectId, ref: "Unit" },
  photo: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }, // GridFS file ID
  size: { type: String },
  color: { type: String },
  quantity: { type: Number, default: 0 },
  rate: { type: Number, default: 0 },
  value: { type: Number, default: 0 },
});

// Auto-generate `code` if not present
inventorySchema.pre("save", async function (next) {
  if (!this.code) {
    // Example: "ITEM-<timestamp>"
    this.code = "ITEM-" + Date.now();
  }
  next();
});

module.exports = mongoose.model("Inventory", inventorySchema);
