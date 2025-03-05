// const express = require("express");
// const router = express.Router();
// const Category = require("../models/category");
// const multer = require("multer");

// // Multer setup for file upload
// const storage = multer.memoryStorage();
// const upload = multer({ storage });
// // GET all categories
// router.get("/", async (req, res) => {
//     try {
//       const categories = await Category.find();
//       res.json(categories);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   });
  
  
  
// // ADD new category
// router.post("/", upload.single("photo"), async (req, res) => {
//   try {
//       console.log("Received request:", req.body);
//       console.log("File received:", req.file);

//       const { primaryCategory, subCategory, productName } = req.body;
//       if (!primaryCategory || !subCategory || !productName) {
//           return res.status(400).json({ message: "All fields are required." });
//       }

//       const newCategory = new Category({
//           primaryCategory,
//           subCategory,
//           products: [
//               {
//                   productName,
//                   photo: req.file
//                       ? {
//                             data: req.file.buffer,
//                             contentType: req.file.mimetype,
//                         }
//                       : null,
//               },
//           ],
//       });

//       await newCategory.save();
//       res.status(201).json(newCategory);
//   } catch (error) {
//       console.error("Error in POST /api/categories:", error);
//       res.status(500).json({ message: error.message });
//   }
// });

     

// // UPDATE category
// router.put("/:id", upload.single("photo"), async (req, res) => {
//   console.log("Incoming Update Request:", req.body);
//   console.log("Uploaded File:", req.file);

//   try {
//       const { primaryCategory, subCategory, productName } = req.body;

//       const category = await Category.findById(req.params.id);
//       if (!category) return res.status(404).json({ message: "Category not found" });

//       // ✅ If a new image is uploaded, update it; otherwise, keep the old one
//       let updatedPhoto = category.products[0].photo; // Default to old photo
//       if (req.file) {
//           updatedPhoto = {
//               data: req.file.buffer,
//               contentType: req.file.mimetype
//           };
//       }

//       // ✅ Update category data
//       category.primaryCategory = primaryCategory;
//       category.subCategory = subCategory;
//       category.products[0].productName = productName;
//       category.products[0].photo = updatedPhoto;

//       const updatedCategory = await category.save();
//       res.json(updatedCategory);
//   } catch (error) {
//       console.error("Update Error:", error);
//       res.status(500).json({ message: error.message });
//   }
// });





// // DELETE category
// router.delete("/:id", async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ message: "Category deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Category = require("../models/category");
const Inventory = require("../models/inventory"); // Import inventory model to check usage

// Ensure JSON parsing middleware is applied for this router
router.use(express.json());

// Helper to check for duplicates under the same parent
async function checkDuplicateName(productName, parentCategory, excludeId = null) {
  const filter = {
    productName: productName,
    parentCategory: parentCategory || null,
  };
  if (excludeId) {
    filter._id = { $ne: excludeId }; // exclude current record in update
  }

  const existing = await Category.findOne(filter);
  return !!existing; // returns true if found
}

// GET all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD new category
router.post("/", async (req, res) => {
  try {
    const { productName, alias, parentCategory } = req.body;
    if (!productName) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Check for duplicates under the same parent
    const isDuplicate = await checkDuplicateName(productName, parentCategory);
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "A category with this name already exists under the same parent." });
    }

    const newCategory = new Category({
      productName,
      alias: alias || "",
      parentCategory: parentCategory || null,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error in POST /api/categories:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE category
router.put("/:id", async (req, res) => {
  try {
    const { productName, alias, parentCategory } = req.body;
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (!productName) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Prevent user from making a category its own parent
    if (parentCategory === categoryId) {
      return res.status(400).json({ message: "A category cannot be its own parent." });
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicateName(productName, parentCategory, categoryId);
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "A category with this name already exists under the same parent." });
    }

    // Update fields
    category.productName = productName;
    category.alias = alias || "";
    category.parentCategory = parentCategory || null;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE category (check for sub-categories and inventory usage)
router.delete("/:id", async (req, res) => {
  try {
    const categoryId = req.params.id;

    // Check if this category has sub-categories
    const child = await Category.findOne({ parentCategory: categoryId });
    if (child) {
      return res
        .status(400)
        .json({ message: "Cannot delete. This category has sub-categories." });
    }

    // Check if this category is used in any inventory item
    const usedInInventory = await Inventory.findOne({ category: categoryId });
    if (usedInInventory) {
      return res.status(400).json({ message: "Cannot delete. This category is used in inventory items." });
    }

    await Category.findByIdAndDelete(categoryId);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

