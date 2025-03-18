import React from "react";
import { useNavigate } from "react-router-dom";
// Reuse the same CSS as your main dashboard
import "../styles/Dashboard.css";

const MasterPage = () => {
  const navigate = useNavigate();

  const subMasterButtons = [
    { label: "Maharaj", route: "/maharaj-master" },
    { label: "Inventory", route: "/inventory-master" },
    { label: "Category", route: "/category-master" },
    { label: "Donation Center", route: "/donation-center-master" },
    { label: "Donation Mode", route: "/donation-mode-master" },
    { label: "Unit", route: "/unit-master" },
    { label: "Exit", route: "/dashboard", static: true },
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
