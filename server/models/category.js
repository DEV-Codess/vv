// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   productName: { type: String, required: true },
//   photo: { data: Buffer, contentType: String }  // Store image as binary
// });

// const categorySchema = new mongoose.Schema({
//   primaryCategory: { type: String, required: true },
//   subCategory: { type: String, required: true },
//   products: [productSchema],
// });

// module.exports = mongoose.model("Category", categorySchema);
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  productName: { type: String, required: true },
  alias: { type: String, default: "" },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
});

module.exports = mongoose.model("Category", categorySchema);
