const express = require("express");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const router = express.Router();

// Registration Route
// server/routes/auth.js (or user.js)
// server/routes/auth.js (Registration Route)
// Registration Route
router.post('/register', async (req, res) => {
    const { username, email, password, role, center, permissions } = req.body;
    
    try {
        console.log("Register request received:", req.body);

        // Check if the user already exists (by username or email)
        const existingUser = await User.findOne({
            $or: [{ email: email.trim().toLowerCase() }, { username: username.trim().toLowerCase() }]
        });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return res.status(400).json({ message: 'User already exists with that username or email' });
        }

        // Create a new user
        const newUser = new User({
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password,
            role,  // Save the role (admin/user)
            center: role === 'user' ? center : '',  // Only save center for users
            permissions: role === 'user' ? permissions : []  // Only save permissions for users
        });

        console.log("New user created:", newUser);
        await newUser.save();
        console.log("User saved successfully");

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Backend registration error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});      
// Login Route
// Login Route
// server/routes/auth.js
router.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Now we get username instead of email
  
    try {
      // 1) Find user by username
      const user = await User.findOne({ username: username.trim().toLowerCase() });
      if (!user) {
        return res.status(400).json({ message: 'User not found. Please register first' });
      }
  
      // 2) Compare password
      if (password !== user.password) { // In production, use hashed password checks
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // 3) If valid, return role + token + permissions
      return res.json({
        message: "Login successful",
        role: user.role,
        token: "user-dummy-token",
        permissions: user.permissions,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
  
// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not registered" });
        }

        // Send actual password via email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your Account Credentials",
            text: `Hello ${user.username},\n\nYour account credentials are as follows:\n\nUsername: ${user.username}\nPassword: ${user.password}\n\nPlease keep this information secure.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Credentials sent to your email" });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
