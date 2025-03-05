const express = require('express');
const mongoose = require('mongoose');
const Unit = require('../models/unit');
const Inventory = require('../models/inventory');
const router = express.Router();

// GET all units
router.get('/', async (req, res) => {
  try {
    const units = await Unit.find();
    res.json(units);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new unit with duplicate check
router.post('/', async (req, res) => {
  try {
    const { type, name, symbol, decimalPlaces } = req.body;

    // Check for duplicates (by name or symbol)
    const existingUnit = await Unit.findOne({
      $or: [{ name: name }, { symbol: symbol }]
    });
    if (existingUnit) {
      return res.status(400).json({ message: "A unit with the same name or symbol already exists." });
    }

    const newUnit = new Unit({
      type: type || "Simple", 
      name,
      symbol,
      decimalPlaces: parseInt(decimalPlaces, 10) || 0,
    });
    const savedUnit = await newUnit.save();
    res.status(201).json({ message: "Unit created", unit: savedUnit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE unit with duplicate check
router.put('/:id', async (req, res) => {
  try {
    const { type, name, symbol, decimalPlaces } = req.body;

    // Check for duplicates for update excluding current unit
    const existingUnit = await Unit.findOne({
      $or: [{ name: name }, { symbol: symbol }],
      _id: { $ne: req.params.id }
    });
    if (existingUnit) {
      return res.status(400).json({ message: "A unit with the same name or symbol already exists." });
    }

    const updatedUnit = await Unit.findByIdAndUpdate(
      req.params.id,
      {
        type: type || "Simple",
        name,
        symbol,
        decimalPlaces: parseInt(decimalPlaces, 10) || 0,
      },
      { new: true }
    );
    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }
    res.json({ message: "Unit updated", unit: updatedUnit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE unit (check for inventory usage)
router.delete('/:id', async (req, res) => {
    try {
      // Instead of manually converting, let Mongoose handle the conversion:
      const unitId = req.params.id;
  
      // Check if this unit is used in any inventory item
      const usedInInventory = await Inventory.findOne({ unit: unitId });
      if (usedInInventory) {
        return res.status(400).json({ message: "Cannot delete. This unit is used in inventory items." });
      }
  
      const deletedUnit = await Unit.findByIdAndDelete(unitId);
      if (!deletedUnit) {
        return res.status(404).json({ message: "Unit not found" });
      }
      res.json({ message: "Unit deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
module.exports = router;
