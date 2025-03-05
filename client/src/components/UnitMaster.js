import React, { useState, useEffect } from "react";
import unitService from "../services/unitService";
import "../styles/UnitMaster.css"; // Make sure the path is correct

const UnitMaster = () => {
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    _id: null,
    type: "Simple",
    name: "",
    symbol: "",
    decimalPlaces: 0,
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const data = await unitService.getUnits();
      setUnits(data);
    } catch (error) {
      console.error("Error fetching units:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      _id: null,
      type: "Simple",
      name: "",
      symbol: "",
      decimalPlaces: 0,
    });
    setShowModal(true);
  };

  const handleEdit = (unit) => {
    setFormData({
      _id: unit._id,
      type: unit.type || "Simple",
      name: unit.name || "",
      symbol: unit.symbol || "",
      decimalPlaces: unit.decimalPlaces || 0,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this unit?")) return;
    try {
      await unitService.deleteUnit(id);
      fetchUnits();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Error deleting unit");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end duplicate check for new units
    if (!formData._id) {
      const duplicate = units.find(
        (u) =>
          u.name.trim().toLowerCase() === formData.name.trim().toLowerCase() ||
          u.symbol.trim().toLowerCase() === formData.symbol.trim().toLowerCase()
      );
      if (duplicate) {
        alert("A unit with the same name or symbol already exists.");
        return;
      }
    }

    const payload = {
      type: formData.type || "Simple",
      name: formData.name,
      symbol: formData.symbol,
      decimalPlaces: parseInt(formData.decimalPlaces, 10) || 0,
    };

    try {
      if (formData._id) {
        await unitService.updateUnit(formData._id, payload);
      } else {
        await unitService.addUnit(payload);
      }
      fetchUnits();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving unit:", error);
      alert("Failed to save unit.");
    }
  };

  return (
    <div className="um-wrapper">
      <div className="um-container">
        {/* Header row: Title + Add button */}
        <div className="um-header">
          <h2 className="um-heading">Unit Master</h2>
          <button className="um-add-btn" onClick={handleAddNew}>
            + Add Unit
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="um-table-container">
          <table className="um-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Symbol</th>
                <th>Name</th>
                <th>Decimal Places</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u._id}>
                  <td>{u.type}</td>
                  <td>{u.symbol}</td>
                  <td>{u.name}</td>
                  <td>{u.decimalPlaces}</td>
                  <td>
                    <button className="um-edit-btn" onClick={() => handleEdit(u)}>
                      Edit
                    </button>
                    <button className="um-delete-btn" onClick={() => handleDelete(u._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for Add/Edit */}
        {showModal && (
          <div className="overlay">
            <div className="modal">
              <button className="um-close-btn" onClick={() => setShowModal(false)}>
                &times;
              </button>
              <h3>{formData._id ? "Edit Unit" : "Add Unit"}</h3>

              <form onSubmit={handleSubmit} className="um-form">
                <label>Type:</label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                />

                <label>Symbol:</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleChange}
                  required
                />

                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <label>Decimal Places:</label>
                <input
                  type="number"
                  min="0"
                  name="decimalPlaces"
                  value={formData.decimalPlaces}
                  onChange={handleChange}
                  required
                />

                <div className="um-form-submit">
                  <button type="submit" className="um-save-btn">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitMaster;
