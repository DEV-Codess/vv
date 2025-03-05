import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import maharajService from "../services/maharajService";
import "../styles/MaharajMaster.css"; // The updated CSS

// Recursively build a nested tree from the flat list
function buildTree(maharajs, parentId = null) {
  return maharajs
    .filter((m) => String(m.parentMaharaj) === String(parentId))
    .map((m) => ({
      ...m,
      children: buildTree(maharajs, m._id),
    }));
}

const MaharajMaster = () => {
  const [maharajs, setMaharajs] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    _id: null,
    maharName: "",
    alias: "",
    parentMaharaj: "",
  });

  useEffect(() => {
    fetchMaharajs();
  }, []);

  const fetchMaharajs = async () => {
    const data = await maharajService.getMaharajs();
    setMaharajs(data);
  };

  const handleAddNew = () => {
    // Reset form
    setFormData({
      _id: null,
      maharName: "",
      alias: "",
      parentMaharaj: "",
    });
    setPopupOpen(true);
  };

  const handleEdit = (m) => {
    setFormData({
      _id: m._id,
      maharName: m.maharName,
      alias: m.alias || "",
      parentMaharaj: m.parentMaharaj || "",
    });
    setPopupOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await maharajService.deleteMaharaj(id);
      fetchMaharajs();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting Maharaj");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      maharName: formData.maharName,
      alias: formData.alias,
      parentMaharaj: formData.parentMaharaj === "" ? null : formData.parentMaharaj,
    };

    try {
      if (formData._id) {
        // Update existing
        await maharajService.updateMaharaj(formData._id, payload);
      } else {
        // Add new
        await maharajService.addMaharaj(payload);
      }
      setPopupOpen(false);
      fetchMaharajs();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting form");
    }
  };

  // Build the nested tree once from maharajs
  const treeData = buildTree(maharajs);

  // Recursively render <tr> rows for each node in the tree
  const renderRows = (data, level = 0) => {
    return data.flatMap((node) => {
      // Indentation (using dashes or arrow for hierarchy)
      const indentSpaces = "--".repeat(level * 4) + (level === 0 ? `+` : ">");
      // Combine name + alias
      const displayName =
        indentSpaces + node.maharName + (node.alias ? ` (${node.alias})` : "");

      return [
        <tr key={node._id}>
          <td style={{ textAlign: "left", whiteSpace: "pre" }}>{displayName}</td>
          <td>
            <button className="action-btn edit" onClick={() => handleEdit(node)}>
              <FaPencilAlt />
            </button>
          </td>
          <td>
            <button className="action-btn delete" onClick={() => handleDelete(node._id)}>
              <FaTrash />
            </button>
          </td>
        </tr>,

        // Recursively render child rows
        ...renderRows(node.children, level + 1),
      ];
    });
  };

  return (
    <div className="maharaj-master-wrapper">
      <div className="maharaj-master-card">
        <div className="maharaj-master-header">
          <h2>Maharaj Master</h2>
          <button className="add-btn" onClick={handleAddNew}>
            + Add Maharaj
          </button>
        </div>

        <div className="table-container">
          <table className="tree-table">
            <colgroup>
              <col style={{ width: "50%" }} />
              <col style={{ width: "25%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <tbody>{renderRows(treeData)}</tbody>
          </table>
        </div>
      </div>

      {/* Popup for add/edit */}
      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup-container">
            <button className="close-btn" onClick={() => setPopupOpen(false)}>
              ×
            </button>
            <form onSubmit={handleSubmit} className="tally-form">
              <label>Name:</label>
              <input
                type="text"
                name="maharName"
                value={formData.maharName}
                onChange={handleChange}
                required
              />

              <label>(alias):</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
              />

              <label>Under:</label>
              <select
                name="parentMaharaj"
                value={formData.parentMaharaj || ""}
                onChange={handleChange}
              >
                <option value="">Primary</option>
                {maharajs
                  .filter((m) => m._id !== formData._id)
                  .map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.maharName}
                    </option>
                  ))}
              </select>

              <button className="submit-btn" type="submit">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaharajMaster;
