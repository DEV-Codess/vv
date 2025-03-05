import React, { useState, useEffect } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import categoryService from "../services/categoryService";
import "../styles/CategoryMaster.css"; // Make sure this path is correct

/**
 * Recursively build a nested tree from the flat list of categories.
 */
function buildTree(categories, parentId = null) {
  return categories
    .filter((cat) => String(cat.parentCategory) === String(parentId))
    .map((cat) => ({
      ...cat,
      children: buildTree(categories, cat._id),
    }));
}

const CategoryMaster = () => {
  const [categories, setCategories] = useState([]);
  const [isPopupOpen, setPopupOpen] = useState(false);

  // Form fields
  const [formData, setFormData] = useState({
    _id: null,
    productName: "",
    alias: "",
    parentCategory: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from the backend
  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Open the modal for adding a new category
  const handleAddNew = () => {
    setFormData({
      _id: null,
      productName: "",
      alias: "",
      parentCategory: "",
    });
    setPopupOpen(true);
  };

  // Open the modal for editing an existing category
  const handleEdit = (category) => {
    setFormData({
      _id: category._id,
      productName: category.productName,
      alias: category.alias || "",
      parentCategory: category.parentCategory || "",
    });
    setPopupOpen(true);
  };

  // Delete a category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryService.deleteCategory(id);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error deleting category");
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      productName: formData.productName.trim(),
      alias: formData.alias.trim(),
      parentCategory: formData.parentCategory === "" ? null : formData.parentCategory,
    };

    try {
      if (formData._id) {
        // Update existing category
        await categoryService.updateCategory(formData._id, payload);
      } else {
        // Add new category
        await categoryService.addCategory(payload);
      }
      setPopupOpen(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error submitting form");
    }
  };

  // Build the nested tree of categories
  const treeData = buildTree(categories);

  /**
   * Recursively render <tr> rows for each node in the tree.
   * @param {Array} data - Array of category nodes (with .children).
   * @param {number} level - Depth in the tree (for indentation).
   * @returns {Array<JSX.Element>} An array of <tr> elements.
   */
  const renderRows = (data, level = 0) => {
    return data.flatMap((node) => {
      // Indentation: 4 dashes per level, plus a leading '+' or '>'
      const indentSpaces = "--".repeat(level * 4) + (level === 0 ? "+" : ">");
      const displayName =
        indentSpaces + node.productName + (node.alias ? ` (${node.alias})` : "");

      return [
        <tr key={node._id}>
          <td style={{ textAlign: "left", whiteSpace: "pre" }}>{displayName}</td>
          <td>
            <button className="cat-edit-btn" onClick={() => handleEdit(node)}>
              <FaPencilAlt />
            </button>
          </td>
          <td>
            <button className="cat-delete-btn" onClick={() => handleDelete(node._id)}>
              <FaTrash />
            </button>
          </td>
        </tr>,

        // Recursively render the child rows
        ...renderRows(node.children, level + 1),
      ];
    });
  };

  return (
    <div className="cat-wrapper">
      <div className="cat-container">
        {/* Header row: Title + Add button */}
        <div className="cat-header">
          <h2 className="cat-heading">Category Master</h2>
          <button className="cat-add-btn" onClick={handleAddNew}>
            + Add Category
          </button>
        </div>

        {/* Scrollable table container */}
        <div className="cat-table-container">
          <table className="cat-tree-table">
            <colgroup>
              <col style={{ width: "60%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <tbody>{renderRows(treeData)}</tbody>
          </table>
        </div>
      </div>

      {/* Popup (Modal) */}
      {isPopupOpen && (
        <div className="cat-overlay">
          <div className="cat-modal">
            <button className="cat-close-btn" onClick={() => setPopupOpen(false)}>
              &times;
            </button>
            <h3>{formData._id ? "Edit Category" : "Add Category"}</h3>

            <form onSubmit={handleSubmit} className="cat-form">
              <label>Name:</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />

              <label>Alias:</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
              />

              <label>Under:</label>
              <select
                name="parentCategory"
                value={formData.parentCategory || ""}
                onChange={handleChange}
              >
                <option value="">Primary</option>
                {categories
                  .filter((cat) => cat._id !== formData._id)
                  .map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.productName}
                    </option>
                  ))}
              </select>

              <div className="cat-form-submit">
                <button type="submit" className="cat-save-btn">
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

export default CategoryMaster;
