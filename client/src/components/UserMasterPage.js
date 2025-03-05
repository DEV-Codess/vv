import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const UserMasterPage = () => {
  const navigate = useNavigate();

  // The user’s assigned permissions are stored in localStorage
  const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");

  // All possible sub-masters
  const allMasters = [
    { label: "Maharaj Master", route: "/maharaj-master" },
    { label: "Inventory Master", route: "/inventory-master" },
    { label: "Category Master", route: "/category-master" },
    { label: "Donation Center Master", route: "/donation-center-master" },
    { label: "Donation Mode Master", route: "/donation-mode-master" },
    { label: "Unit Master", route: "/unit-master" },
  ];

  // Only display the masters that match the user’s assigned permissions
  const userMasters = allMasters.filter(m => permissions.includes(m.label));

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Your Assigned Masters</h1>
        <div className="dashboard-grid">
          {userMasters.length > 0 ? (
            userMasters.map((btn, idx) => (
              <button
                key={idx}
                className="dashboard-button"
                onClick={() => navigate(btn.route)}
              >
                {btn.label}
              </button>
            ))
          ) : (
            <p>No masters assigned.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMasterPage;
