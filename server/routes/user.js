// server/routes/user.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new user
router.post("/", async (req, res) => {
  const { username, email, password, center, permissions } = req.body;

  try {
    // Check for duplicate email
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const newUser = new User({
      username,
      email: email.trim().toLowerCase(),
      password,
      center,
      permissions
    });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update user by ID
router.put("/:id", async (req, res) => {
  const { username, email, password, center, permissions } = req.body;
  try {
    // Check for duplicates, excluding current user
    const existing = await User.findOne({
      _id: { $ne: req.params.id },
      email: email.trim().toLowerCase()
    });
    if (existing) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email: email.trim().toLowerCase(), password, center, permissions },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const removedUser = await User.findByIdAndDelete(req.params.id);
    if (!removedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
