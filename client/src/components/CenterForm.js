import React, { useState, useEffect } from "react";
import { getCenters, addCenter, updateCenter, deleteCenter } from "../services/centerService";
import "../styles/CenterMaster.css";

const CenterMaster = () => {
  const [centers, setCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form data for add/edit
  const [formData, setFormData] = useState({
    _id: null,
    code: "",
    name: "",
    address: "",
    phoneNumber: ""
  });

  useEffect(() => {
    fetchAllCenters();
  }, []);

  // Fetch existing centers from backend
  const fetchAllCenters = async () => {
    try {
      const data = await getCenters();
      setCenters(data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  // Open modal for adding a new center
  const handleAddNew = () => {
    setFormData({
      _id: null,
      code: "",
      name: "",
      address: "",
      phoneNumber: ""
    });
    setShowModal(true);
  };

  // Open modal for editing an existing center
  const handleEdit = (center) => {
    setFormData({
      _id: center._id,
      code: center.code,
      name: center.name,
      address: center.address,
      phoneNumber: center.phoneNumber
    });
    setShowModal(true);
  };

  // Delete a center
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this center?")) return;
    try {
      await deleteCenter(id);
      fetchAllCenters();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Error deleting center");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit the form (add or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Front-end check to avoid duplicates by code or name
    if (!formData._id) {
      // If adding a new center, check for duplicates
      const duplicate = centers.find(
        c =>
          c.code.trim().toLowerCase() === formData.code.trim().toLowerCase() ||
          c.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
      );
      if (duplicate) {
        alert("A center with the same code or name already exists.");
        return;
      }
    }

    const payload = {
      code: formData.code.trim(),
      name: formData.name.trim(),
      address: formData.address.trim(),
      phoneNumber: formData.phoneNumber.trim()
    };

    try {
      if (formData._id) {
        // Update existing center
        await updateCenter(formData._id, payload);
      } else {
        // Add new center
        await addCenter(payload);
      }
      fetchAllCenters();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving center:", error);
      alert(error.response?.data?.message || "Failed to save center.");
    }
  };

  return (
    <div className="cm-wrapper">
      <div className="cm-container">
        {/* Header row: Title + Add button */}
        <div className="cm-header">
          <h2 className="cm-heading">Add New Vayavach Centre</h2>
          <button className="cm-add-btn" onClick={handleAddNew}>
            + Add Centre
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="cm-table-container">
          <table className="cm-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone Number</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.length === 0 ? (
                <tr>
                  <td colSpan="5">No centers available.</td>
                </tr>
              ) : (
                centers.map(center => (
                  <tr key={center._id}>
                    <td>{center.code}</td>
                    <td>{center.name}</td>
                    <td>{center.address}</td>
                    <td>{center.phoneNumber}</td>
                    <td>
                      <button className="cm-edit-btn" onClick={() => handleEdit(center)}>
                        Edit
                      </button>
                      <button className="cm-delete-btn" onClick={() => handleDelete(center._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {showModal && (
        <div className="cm-overlay">
          <div className="cm-modal">
            <button className="cm-close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
            <h3>{formData._id ? "Edit Centre" : "Add Centre"}</h3>

            <form onSubmit={handleSubmit} className="cm-form">
              <label>Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
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

              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />

              <label>Phone Number:</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />

              <div className="cm-form-submit">
                <button type="submit" className="cm-save-btn">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CenterMaster;
