const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // ✅ Load environment variables

const app = express(); // ✅ Initialize app FIRST
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); 

// ✅ MongoDB Connection
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.error("Stack Trace:", err.stack);
    process.exit(1); // Exit the process if MongoDB fails
  });

// ✅ GridFS Setup - Fix Here
const conn = mongoose.connection;  // ✅ Define conn here

let gfs;
conn.once('open', () => {
  const Grid = require('gridfs-stream');
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
  console.log('✅ Connected to GridFS');
});

// ✅ Import Routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const maharajRoutes = require("./routes/maharaj");
const inventoryRoutes = require("./routes/inventory");
const categoryRoutes = require("./routes/category");
const donationCenterRoutes = require("./routes/donationCenter");
const donationModeRoutes = require("./routes/donationMode");
const UnitRoutes = require("./routes/unit");
const CenterFormRoutes = require("./routes/center");
const RegistenewUserRoutes = require("./routes/auth");
// server.js
const userRoutes = require("./routes/user");

// ✅ Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use("/api/maharajs", maharajRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/donation-centers", donationCenterRoutes);
app.use("/api/donation-modes", donationModeRoutes);
app.use("/api/unit", UnitRoutes);
app.use("/api/center-form",CenterFormRoutes);
app.use("/api/centers",CenterFormRoutes);
app.use("/api/register-user", RegistenewUserRoutes);
app.use("/api/users", userRoutes);


app.use("/uploads", express.static("uploads"));

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
