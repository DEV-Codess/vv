import React from "react";
import { useNavigate } from "react-router-dom";
// Reuse the same CSS as your main dashboard
import "../styles/Dashboard.css";

const MasterPage = () => {
  const navigate = useNavigate();

  const subMasterButtons = [
    { label: "Maharaj Master", route: "/maharaj-master" },
    { label: "Inventory Master", route: "/inventory-master" },
    { label: "Category Master", route: "/category-master" },
    { label: "Donation Center Master", route: "/donation-center-master" },
    { label: "Donation Mode Master", route: "/donation-mode-master" },
    { label: "Unit Master", route: "/unit-master" },
  ];

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-title">All Masters</h1>
        <div className="dashboard-grid">
          {subMasterButtons.map((btn, idx) => (
            <button
              key={idx}
              className="dashboard-button"
              onClick={() => navigate(btn.route)}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MasterPage;
