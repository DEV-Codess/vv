import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/UserMaster.css";

// Permissions available for assignment
const availablePermissions = [
  'Donor Master',
  'Maharaj Master',
  'Inventory Master',
  'Category Master',
  'Donation Center Master',
  'Donation Mode Master',
  'Unit Master'
];

function UserMaster() {
  const [users, setUsers] = useState([]);
  const [centers, setCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    _id: null,
    username: '',
    email: '',
    password: '',
    center: '',
    permissions: []
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch both users and centers from the backend
  const fetchAllData = async () => {
    try {
      // 1) Get all users from user routes
      const userRes = await axios.get('/api/users');
      console.log("Users fetched:", userRes.data);
      setUsers(userRes.data || []);

      // 2) Get all centers from centers collection
      const centerRes = await axios.get('/api/centers');
      setCenters(centerRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Open modal for adding a new user
  const handleAddNew = () => {
    setFormData({
      _id: null,
      username: '',
      email: '',
      password: '',
      center: '',
      permissions: []
    });
    setShowModal(true);
  };

  // Open modal for editing an existing user
  const handleEdit = (user) => {
    setFormData({
      _id: user._id,
      username: user.username,
      email: user.email,
      password: '', // Do not prefill password
      center: user.center || '',
      permissions: user.permissions || []
    });
    setShowModal(true);
  };

  // Delete a user using the /api/users endpoint
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      fetchAllData();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.message || "Error deleting user");
    }
  };

  // Handle text/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for permissions
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => {
      let updatedPermissions = prev.permissions;
      if (checked) {
        updatedPermissions = [...prev.permissions, name];
      } else {
        updatedPermissions = prev.permissions.filter(p => p !== name);
      }
      return { ...prev, permissions: updatedPermissions };
    });
  };

  // Submit form (add or update) via /api/users endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for duplicate email if adding new user
    if (!formData._id) {
      const duplicate = users.find(
        u => u.email.trim().toLowerCase() === formData.email.trim().toLowerCase()
      );
      if (duplicate) {
        alert("A user with this email already exists.");
        return;
      }
    }

    // Prepare payload (note: password required only when adding new user)
    const payload = {
      username: formData.username.trim(),
      email: formData.email.trim(),
      password: formData.password.trim(),
      center: formData.center,
      permissions: formData.permissions
    };

    try {
      if (formData._id) {
        // Update existing user
        await axios.put(`/api/users/${formData._id}`, payload);
      } else {
        // Add new user
        await axios.post('/api/users', payload);
      }
      fetchAllData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving user:", error);
      alert(error.response?.data?.message || 'Failed to save user');
    }
  };

  return (
    <div className="um-wrapper">
      <div className="um-container">
        {/* Header row: Title + Add button */}
        <div className="um-header">
          <h2 className="um-heading">User</h2>
          <button className="um-add-btn" onClick={handleAddNew}>
            + Add User
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="um-table-container">
          <table className="um-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Center</th>
                <th>Permissions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5">No users available.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u._id}>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.center || '—'}</td>
                    <td>{(u.permissions || []).join(', ')}</td>
                    <td>
                      <button className="um-edit-btn" onClick={() => handleEdit(u)}>
                        Edit
                      </button>
                      <button className="um-delete-btn" onClick={() => handleDelete(u._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
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
              <h3>{formData._id ? "Edit User" : "Add User"}</h3>

              <form onSubmit={handleSubmit} className="um-form">
                <label>Username:</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />

                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <label>Password:</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!formData._id} // required only when adding new
                />

                <label>Center:</label>
                <select
                  name="center"
                  value={formData.center}
                  onChange={handleChange}
                  required
                >
                  <option value="">--Select Center--</option>
                  {centers.map(center => (
                    <option key={center._id || center.code} value={center.code}>
                      {center.name}
                    </option>
                  ))}
                </select>

                {/* Permissions checkboxes */}
                <label>Permissions:</label>
                <div className="um-permissions">
                  {availablePermissions.map((perm, idx) => (
                    <div key={idx} className="um-checkbox-item">
                      <input
                        type="checkbox"
                        name={perm}
                        id={`perm-${idx}`}
                        checked={formData.permissions.includes(perm)}
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor={`perm-${idx}`}>{perm}</label>
                    </div>
                  ))}
                </div>

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
}

export default UserMaster;
