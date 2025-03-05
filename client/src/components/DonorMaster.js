import React, { useState, useEffect } from "react";
import donorService from "../services/donorService";
import "../styles/DonorMaster.css"; // Updated CSS filename if needed

const DonorMaster = () => {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({});
  const [isPopupOpen, setPopupOpen] = useState(false); // Consistent naming

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    const data = await donorService.getDonors();
    setDonors(data);
  };

  const handleAddNew = () => {
    setFormData({});
    setPopupOpen(true);
  };

  const handleEdit = (donor) => {
    setFormData(donor);
    setPopupOpen(true);
  };

  const handleDelete = async (id) => {
    await donorService.deleteDonor(id);
    fetchDonors();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._id) {
      await donorService.updateDonor(formData._id, formData);
    } else {
      await donorService.addDonor(formData);
    }
    fetchDonors();
    setPopupOpen(false);
  };

  return (
    <div className="donor-master-wrapper">
      <div className="donor-master-card">
        {/* Header: Title + Add Donor Button */}
        <div className="donor-master-header">
          <h2>Donor Master</h2>
          <button className="add-btn" onClick={handleAddNew}>
            + Add Donor
          </button>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="donor-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d._id}>
                  <td>{d.fullName}</td>
                  <td>{d.email}</td>
                  <td>{d.mobile}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(d)}>
                      ✏️ Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(d._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button
              className="close-btn"
              onClick={() => setPopupOpen(false)}
              title="Close"
            >
              ❌
            </button>
            <h3>{formData._id ? "Edit Donor" : "Add Donor"}</h3>

            <form onSubmit={handleSubmit} className="responsive-form">
              {/* Row 1: Full Name + Mobile */}
              <div>
                <label>Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Mobile No:</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile || ""}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  required
                />
              </div>

              {/* Row 2: WhatsApp + PAN */}
              <div>
                <label>WhatsApp No:</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp || ""}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                />
              </div>

              <div>
                <label>PAN No:</label>
                <input
                  type="text"
                  name="pan"
                  value={formData.pan || ""}
                  onChange={handleChange}
                  pattern="[A-Z]{5}[0-9]{4}[A-Z]{1}"
                />
              </div>

              {/* Row 3: Email + Ref Donor */}
              <div>
                <label>Email ID:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Ref Donor:</label>
                <input
                  type="text"
                  name="ref"
                  value={formData.ref || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Row 4: Donation Centre + (blank or other small field) */}
              <div>
                <label>Donation Centre:</label>
                <input
                  type="text"
                  name="donationCentre"
                  value={formData.donationCentre || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                {/* Could leave blank or add small field */}
              </div>

              {/* Row 5: Address is full-width */}
              <div className="full-width">
                <label>Address:</label>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Row 6: Donor B-Date + Wife Name */}
              <div>
                <label>Donor B-Date:</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Wife Name:</label>
                <input
                  type="text"
                  name="wifeName"
                  value={formData.wifeName || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Row 7: Wife B-Date + Anniv. Date */}
              <div>
                <label>Wife B-Date:</label>
                <input
                  type="date"
                  name="wifeBirthDate"
                  value={formData.wifeBirthDate || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Anniv. Date:</label>
                <input
                  type="date"
                  name="anniversary"
                  value={formData.anniversary || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Full-width Submit */}
              <div className="form-submit">
                <button className="submit-btn" type="submit">
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

export default DonorMaster;
