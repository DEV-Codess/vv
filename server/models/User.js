// server/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // unique: true
  email:    { type: String, required: true, unique: true },  // unique: true
  password: { type: String, required: true },
  role:     { type: String, enum: ['admin', 'user'], default: 'user' },
  center:   { type: String }, // optional if you still need it
  permissions: { type: [String] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
