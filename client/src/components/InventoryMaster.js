import React, { useState, useEffect } from "react";
import inventoryService from "../services/inventoryService";
import categoryService from "../services/categoryService";
import unitService from "../services/unitService";
import "../styles/InventoryMaster.css"; // Make sure this path is correct

const InventoryMaster = () => {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [units, setUnits] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    _id: null,
    code: "",
    name: "",
    category: "",
    unit: "",
    size: "",
    color: "",
    quantity: 0,
    rate: 0,
    value: 0,
    photo: null,
    existingPhoto: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const invData = await inventoryService.getInventory();
      setInventory(invData);

      const catData = await categoryService.getCategories();
      setCategories(catData);

      const unitData = await unitService.getUnits();
      setUnits(unitData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddNew = () => {
    setFormData({
      _id: null,
      code: "",
      name: "",
      category: "",
      unit: "",
      size: "",
      color: "",
      quantity: 0,
      rate: 0,
      value: 0,
      photo: null,
      existingPhoto: null,
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      _id: item._id,
      code: item.code || "",
      name: item.name || "",
      category: item.category?._id || "",
      unit: item.unit?._id || "",
      size: item.size || "",
      color: item.color || "",
      quantity: item.quantity || 0,
      rate: item.rate || 0,
      value: item.value || 0,
      photo: null,
      existingPhoto: item.photo
        ? `http://localhost:5000/api/inventory/photo/${item.photo}`
        : null,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await inventoryService.deleteInventory(id);
      fetchAllData();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Handle changes (auto-calc value if quantity or rate changes)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "photo" && files?.length > 0) {
      setFormData((prev) => ({ ...prev, photo: files[0] }));
    } else if (name === "quantity" || name === "rate") {
      const numericVal = Math.max(0, parseFloat(value) || 0);
      const newState = { ...formData, [name]: numericVal };
      newState.value =
        name === "quantity"
          ? newState.rate * numericVal
          : newState.quantity * numericVal;
      setFormData(newState);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit form (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      if (formData._id) {
        // For updates, include code if it exists
        payload.append("code", formData.code);
      }

      payload.append("name", formData.name);
      payload.append("category", formData.category);
      payload.append("unit", formData.unit);
      payload.append("size", formData.size);
      payload.append("color", formData.color);
      payload.append("quantity", formData.quantity);
      payload.append("rate", formData.rate);
      payload.append("value", formData.value);

      if (formData.photo) {
        payload.append("photo", formData.photo);
      } else if (formData.existingPhoto) {
        payload.append("existingPhoto", formData.existingPhoto);
      }

      if (formData._id) {
        await inventoryService.updateInventory(formData._id, payload);
      } else {
        await inventoryService.addInventory(payload);
      }
      fetchAllData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving inventory:", error);
      alert("Failed to save inventory item.");
    }
  };

  // For displaying unit symbol in quantity field
  const selectedUnit = units.find((u) => String(u._id) === String(formData.unit));
  const unitSymbol = selectedUnit ? selectedUnit.symbol : "";

  return (
    <div className="im-wrapper">
      <div className="im-container">
        {/* Header Row: Title + Add Button */}
        <div className="im-header">
          <h2 className="im-heading">Inventory Master</h2>
          <button className="im-add-btn" onClick={handleAddNew}>
            + Add Product
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="im-table-container">
          <table className="im-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Under</th>
                <th>Unit</th>
                <th>Size</th>
                <th>Color</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Value</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.code}</td>
                  <td>{item.name}</td>
                  <td>{item.category?.productName || "—"}</td>
                  <td>{item.unit?.symbol || "—"}</td>
                  <td>{item.size}</td>
                  <td>{item.color}</td>
                  <td>{item.quantity}</td>
                  <td>{item.rate}</td>
                  <td>{item.value}</td>
                  <td>
                    {item.photo && (
                      <img
                        src={`http://localhost:5000/api/inventory/photo/${item.photo}`}
                        alt="item"
                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>
                    <button className="im-edit-btn" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      className="im-delete-btn"
                      onClick={() => handleDelete(item._id)}
                    >
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
  <div className="im-overlay">
    <div className="im-modal">
      <button className="im-close-btn" onClick={() => setShowModal(false)}>
        &times;
      </button>
      <h3>{formData._id ? "Edit Product" : "Add Product"}</h3>

      <form onSubmit={handleSubmit} className="im-form-grid">
        {/* Row 1: Code + Name */}
        <div className="form-field">
          <label>Code:</label>
          <input
            type="text"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Row 2: Under + Unit */}
        <div className="form-field">
          <label>Under:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label>Unit:</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Unit --</option>
            {units.map((u) => (
              <option key={u._id} value={u._id}>
                {u.symbol}
              </option>
            ))}
          </select>
        </div>

        {/* Row 3: Size + Color */}
        <div className="form-field">
          <label>Size:</label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label>Color:</label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        {/* Row 4: Quantity + Rate */}
        <div className="form-field">
          <label>Quantity:</label>
          <div className="quantity-input-group">
            <input
              type="number"
              min="0"
              step="any"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <span className="quantity-unit">{unitSymbol}</span>
          </div>
        </div>

        <div className="form-field">
          <label>Rate/item:</label>
          <input
            type="number"
            min="0"
            step="any"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Row 5: Value + Photo (photo might be a full row if you prefer) */}
        <div className="form-field">
          <label>Value:</label>
          <input
            type="number"
            min="0"
            step="any"
            name="value"
            value={formData.value}
            onChange={handleChange}
            required
          />
        </div>

        {/* Photo spanning both columns if you want */}
        <div className="form-field full-span">
          <label>Photo:</label>
          <div className="photo-row">
            {formData.existingPhoto && (
              <img
                src={formData.existingPhoto}
                alt="existing"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            )}
            <input type="file" name="photo" onChange={handleChange} />
          </div>
        </div>

        {/* Final row: Save button (full span) */}
        <div className="form-field full-span" style={{ textAlign: "center" }}>
          <button type="submit" className="im-save-btn">
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

export default InventoryMaster;
