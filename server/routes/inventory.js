// const express = require('express');
// const mongoose = require('mongoose');
// const multer = require('multer');
// const { GridFsStorage } = require('multer-gridfs-storage');
// const Inventory = require('../models/inventory');

// const router = express.Router();

// // ✅ GridFS Storage Configuration
// const storage = new GridFsStorage({
//     url: process.env.MONGO_URI,
//     options: { useNewUrlParser: true, useUnifiedTopology: true },
//     file: (req, file) => {
//       return {
//         filename: `${Date.now()}-${file.originalname}`,
//         bucketName: 'uploads',
//         metadata: { originalname: file.originalname },
//       };
//     },
//   });
  
//   const upload = multer({ storage });
  
// // ✅ GET all inventory items
// router.get('/', async (req, res) => {
//   const items = await Inventory.find();
//   res.json(items);
// });
// router.post("/", upload.single("photo"), async (req, res) => {
//   console.log("Incoming Request Body:", req.body);
//   console.log("Uploaded File Info:", req.file); // Debugging log

//   try {
//       const { productName, region, category, unit, storageLocation, minInventory, maxInventory } = req.body;

//       if (!req.file) {
//           return res.status(400).json({ message: "File upload failed!" });
//       }

//       const newInventory = new Inventory({
//           productName,
//           region,
//           category,
//           unit,
//           storageLocation,
//           minInventory: parseInt(minInventory, 10),
//           maxInventory: parseInt(maxInventory, 10),
//           photo: req.file.id // ✅ Store GridFS file ID
//       });

//       await newInventory.save();
//       res.status(201).json({ message: "Inventory item added successfully!", newInventory });
//   } catch (error) {
//       console.error("Upload Error:", error);
//       res.status(500).json({ message: error.message });
//   }
// });

// // ✅ Upload Inventory Item with File
// router.put("/:id", upload.single("photo"), async (req, res) => {
//   console.log("Incoming Update Request:", req.body);
//   console.log("Uploaded File:", req.file);

//   try {
//       const { productName, region, category, unit, storageLocation, minInventory, maxInventory, existingPhoto } = req.body;

//       const updatedData = {
//           productName,
//           region,
//           category,
//           unit,
//           storageLocation,
//           minInventory: parseInt(minInventory, 10),
//           maxInventory: parseInt(maxInventory, 10),
//       };

//       // ✅ If a new image is uploaded, update it; otherwise, keep the old image
//       if (req.file) {
//           updatedData.photo = req.file.id; // New Image ID from GridFS
//       } else if (existingPhoto) {
//           updatedData.photo = existingPhoto.split("/").pop(); // Extract ID from URL
//       }

//       const updatedInventory = await Inventory.findByIdAndUpdate(req.params.id, updatedData, { new: true });

//       if (!updatedInventory) {
//           return res.status(404).json({ message: "Inventory item not found" });
//       }

//       res.json(updatedInventory);
//   } catch (error) {
//       console.error("Update Error:", error);
//       res.status(500).json({ message: error.message });
//   }
// });





// // ✅ GET Image from GridFS
// // ✅ GET Image from GridFS
// router.get("/photo/:id", async (req, res) => {
//   const { id } = req.params;
//   const conn = mongoose.connection;
//   const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: 'uploads',
//   });

//   gfs.find({ _id: new mongoose.Types.ObjectId(id) }).toArray((err, files) => {
//     if (!files || files.length === 0) {
//       return res.status(404).json({ message: "File not found" });
//     }

//     gfs.openDownloadStream(new mongoose.Types.ObjectId(id)).pipe(res);
//   });
// });


// // ✅ DELETE Inventory Item
// router.delete('/:id', async (req, res) => {
//   try {
//     const item = await Inventory.findById(req.params.id);
//     if (!item) return res.status(404).json({ message: "Inventory item not found" });

//     // ✅ Delete Image from GridFS if it exists
//     if (item.photo) {
//       const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
//         bucketName: 'uploads',
//       });
//       await gfs.delete(new mongoose.Types.ObjectId(item.photo));
//     }

//     await Inventory.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Inventory deleted successfully' });
//   } catch (error) {
//     console.error("Delete Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Inventory = require('../models/inventory');

const router = express.Router();

// GridFS Storage config
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      filename: `${Date.now()}-${file.originalname}`,
      bucketName: 'uploads',
      metadata: { originalname: file.originalname },
    };
  },
});
const upload = multer({ storage });

/**
 * GET all inventory items
 */
router.get('/', async (req, res) => {
  try {
    // Populate category & unit if you want to show their names
    const items = await Inventory.find({})
      .populate('category', 'productName') // e.g. if your Category model has 'productName'
      .populate('unit', 'symbol');         // e.g. if your Unit model has 'symbol'
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * GET one item by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * CREATE inventory item
 */
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    // Extract fields
    const {
      name,
      category,
      unit,
      size,
      color,
      quantity,
      rate,
      value
    } = req.body;

    // Build object
    const newInventory = new Inventory({
      name,
      category,
      unit,
      size,
      color,
      quantity: parseFloat(quantity) || 0,
      rate: parseFloat(rate) || 0,
      value: parseFloat(value) || 0,
    });

    // If a photo was uploaded
    if (req.file) {
      newInventory.photo = req.file.id;
    }

    const savedItem = await newInventory.save();
    res.status(201).json({
      message: "Inventory item added successfully!",
      item: savedItem,
    });
  } catch (error) {
    console.error("Error creating inventory:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * UPDATE inventory item
 */
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      category,
      unit,
      size,
      color,
      quantity,
      rate,
      value,
      existingPhoto,
    } = req.body;

    // Prepare update data
    const updatedData = {
      name,
      category,
      unit,
      size,
      color,
      quantity: parseFloat(quantity) || 0,
      rate: parseFloat(rate) || 0,
      value: parseFloat(value) || 0,
    };

    // If new photo is uploaded
    if (req.file) {
      updatedData.photo = req.file.id;
    }
    // Else if user wants to keep old photo
    else if (existingPhoto) {
      // existingPhoto might be a full URL. Extract the file ID if needed:
      updatedData.photo = existingPhoto.split("/").pop();
    }

    const updatedItem = await Inventory.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Inventory item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating inventory:", error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET photo from GridFS
 */
router.get('/photo/:id', async (req, res) => {
  const { id } = req.params;
  const conn = mongoose.connection;
  const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });

  gfs.find({ _id: new mongoose.Types.ObjectId(id) }).toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    gfs.openDownloadStream(new mongoose.Types.ObjectId(id)).pipe(res);
  });
});

/**
 * DELETE inventory item
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // Delete image from GridFS if exists
    if (item.photo) {
      const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
      });
      await gfs.delete(new mongoose.Types.ObjectId(item.photo));
    }

    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Inventory deleted successfully" });
  } catch (error) {
    console.error("Error deleting inventory:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
