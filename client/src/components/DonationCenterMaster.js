import React, { useState, useEffect } from "react";
import donationCenterService from "../services/donationCenterService";
import "../styles/DonationCenterMaster.css"; // Make sure the path is correct

const DonationCenterMaster = () => {
  const [centers, setCenters] = useState([]);
  const [formData, setFormData] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await donationCenterService.getDonationCenters();
      setCenters(response.data); // Ensure your service returns { data: [...] }
    } catch (error) {
      console.error("Error fetching donation centers:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({});
    setPopupOpen(true);
  };

  const handleEdit = (center) => {
    setFormData(center);
    setPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation center?")) return;
    try {
      await donationCenterService.deleteDonationCenter(id);
      fetchCenters();
    } catch (error) {
      console.error("Error deleting center:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData._id) {
        await donationCenterService.updateDonationCenter(formData._id, formData);
      } else {
        await donationCenterService.addDonationCenter(formData);
      }
      fetchCenters();
      setPopupOpen(false);
    } catch (error) {
      console.error("Error saving donation center:", error);
    }
  };

  return (
    <div className="dc-wrapper">
      <div className="dc-container">
        {/* Header row: Title + Add button */}
        <div className="dc-header">
          <h2 className="dc-heading">Donation Center Cum Store Master</h2>
          <button className="dc-add-btn" onClick={handleAddNew}>
            + Add Donation Center
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="dc-table-container">
          <table className="dc-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Store Center Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {centers.length === 0 ? (
                <tr>
                  <td colSpan="3">No donation centers available.</td>
                </tr>
              ) : (
                centers.map((c) => (
                  <tr key={c._id}>
                    <td>{c.area}</td>
                    <td>{c.centerName}</td>
                    <td>
                      <button className="dc-edit-btn" onClick={() => handleEdit(c)}>
                        Edit
                      </button>
                      <button className="dc-delete-btn" onClick={() => handleDelete(c._id)}>
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
      {isPopupOpen && (
        <div className="dc-overlay">
          <div className="dc-modal">
            <button className="dc-close-btn" onClick={() => setPopupOpen(false)}>
              &times;
            </button>
            <h3>{formData._id ? "Edit Donation Center" : "Add Donation Center"}</h3>
            <form onSubmit={handleSubmit} className="dc-form">
              <label>Donation Center / Store Area:</label>
              <input
                type="text"
                name="area"
                value={formData.area || ""}
                onChange={handleChange}
                required
              />

              <label>Store Center Name:</label>
              <input
                type="text"
                name="centerName"
                value={formData.centerName || ""}
                onChange={handleChange}
                required
              />

              <div className="dc-form-submit">
                <button type="submit" className="dc-save-btn">
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

export default DonationCenterMaster;
