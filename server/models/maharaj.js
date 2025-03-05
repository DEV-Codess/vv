const mongoose = require("mongoose");

const maharajSchema = new mongoose.Schema({
  maharName: { type: String, required: true },
  alias: { type: String, default: "" },
  parentMaharaj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maharaj",
    default: null,
  },
});

module.exports = mongoose.model("Maharaj", maharajSchema);
