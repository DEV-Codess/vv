const express = require("express");
const router = express.Router();
const Maharaj = require("../models/maharaj");
const Inventory = require("../models/inventory"); // If you want to block usage in Inventory

// Ensure JSON parsing middleware is applied for this router
router.use(express.json());

// Helper to check for duplicates under the same parent
async function checkDuplicateName(maharName, parentMaharaj, excludeId = null) {
  const filter = {
    maharName: maharName,
    parentMaharaj: parentMaharaj || null,
  };
  if (excludeId) {
    filter._id = { $ne: excludeId }; // exclude current record
  }

  const existing = await Maharaj.findOne(filter);
  return !!existing; // returns true if found
}

// GET all Maharajs
router.get("/", async (req, res) => {
  try {
    const maharajs = await Maharaj.find();
    res.json(maharajs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD new Maharaj
router.post("/", async (req, res) => {
  try {
    const { maharName, alias, parentMaharaj } = req.body;
    if (!maharName) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Check for duplicates under the same parent
    const isDuplicate = await checkDuplicateName(maharName, parentMaharaj);
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "A Maharaj with this name already exists under the same parent." });
    }

    const newMaharaj = new Maharaj({
      maharName,
      alias: alias || "",
      parentMaharaj: parentMaharaj || null,
    });

    await newMaharaj.save();
    res.status(201).json(newMaharaj);
  } catch (error) {
    console.error("Error in POST /api/maharajs:", error);
    res.status(500).json({ message: error.message });
  }
});

// UPDATE Maharaj
router.put("/:id", async (req, res) => {
  try {
    const { maharName, alias, parentMaharaj } = req.body;
    const maharajId = req.params.id;

    const maharaj = await Maharaj.findById(maharajId);
    if (!maharaj) {
      return res.status(404).json({ message: "Maharaj not found" });
    }

    if (!maharName) {
      return res.status(400).json({ message: "Name is required." });
    }

    // Prevent user from making a Maharaj its own parent
    if (parentMaharaj === maharajId) {
      return res
        .status(400)
        .json({ message: "A Maharaj cannot be its own parent." });
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicateName(maharName, parentMaharaj, maharajId);
    if (isDuplicate) {
      return res
        .status(400)
        .json({ message: "A Maharaj with this name already exists under the same parent." });
    }

    // Update fields
    maharaj.maharName = maharName;
    maharaj.alias = alias || "";
    maharaj.parentMaharaj = parentMaharaj || null;

    const updatedMaharaj = await maharaj.save();
    res.json(updatedMaharaj);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE Maharaj (check for sub-Maharajs & inventory usage)
router.delete("/:id", async (req, res) => {
  try {
    const maharajId = req.params.id;

    // Check if this Maharaj has sub-Maharajs
    const child = await Maharaj.findOne({ parentMaharaj: maharajId });
    if (child) {
      return res
        .status(400)
        .json({ message: "Cannot delete. This Maharaj has sub-Maharajs." });
    }

    // (Optional) Check if this Maharaj is used in Inventory
    // If your Inventory references maharaj, you can block usage
    const usedInInventory = await Inventory.findOne({ maharaj: maharajId });
    if (usedInInventory) {
      return res
        .status(400)
        .json({ message: "Cannot delete. This Maharaj is used in inventory items." });
    }

    await Maharaj.findByIdAndDelete(maharajId);
    res.json({ message: "Maharaj deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
