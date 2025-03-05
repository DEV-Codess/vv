import React, { useState, useEffect } from "react";
import donationModeService from "../services/donationModeService";
import "../styles/DonationModeMaster.css"; // Ensure the path is correct

const DonationModeMaster = () => {
  const [modes, setModes] = useState([]);
  const [formData, setFormData] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    fetchModes();
  }, []);

  const fetchModes = async () => {
    try {
      const response = await donationModeService.getDonationModes();
      setModes(response.data || []);
    } catch (error) {
      console.error("Error fetching donation modes:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({});
    setPopupOpen(true);
  };

  const handleEdit = (mode) => {
    setFormData(mode);
    setPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation mode?")) return;
    try {
      await donationModeService.deleteDonationMode(id);
      fetchModes();
    } catch (error) {
      console.error("Error deleting donation mode:", error);
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
        await donationModeService.updateDonationMode(formData._id, formData);
      } else {
        await donationModeService.addDonationMode(formData);
      }
      fetchModes();
      setPopupOpen(false);
    } catch (error) {
      console.error("Error saving donation mode:", error);
    }
  };

  return (
    <div className="dm-wrapper">
      <div className="dm-container">
        {/* Header row: Title + Add button */}
        <div className="dm-header">
          <h2 className="dm-heading">Donation Mode Master</h2>
          <button className="dm-add-btn" onClick={handleAddNew}>
            + Add Donation Mode
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="dm-table-container">
          <table className="dm-table">
            <thead>
              <tr>
                <th>Mode Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {modes.length === 0 ? (
                <tr>
                  <td colSpan="2">No donation modes available.</td>
                </tr>
              ) : (
                modes.map((m) => (
                  <tr key={m._id}>
                    <td>{m.modeName}</td>
                    <td>
                      <button className="dm-edit-btn" onClick={() => handleEdit(m)}>
                        Edit
                      </button>
                      <button
                        className="dm-delete-btn"
                        onClick={() => handleDelete(m._id)}
                      >
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
        <div className="dm-overlay">
          <div className="dm-modal">
            <button className="dm-close-btn" onClick={() => setPopupOpen(false)}>
              &times;
            </button>
            <h3>{formData._id ? "Edit Donation Mode" : "Add Donation Mode"}</h3>

            <form onSubmit={handleSubmit} className="dm-form">
              <label>Donation Mode Name:</label>
              <input
                type="text"
                name="modeName"
                value={formData.modeName || ""}
                onChange={handleChange}
                required
              />

              <div className="dm-form-submit">
                <button className="dm-save-btn" type="submit">
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

export default DonationModeMaster;
