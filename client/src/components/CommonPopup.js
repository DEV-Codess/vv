import React from "react";
import "../styles/MasterForms.css";

const CommonPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={onClose}>❌</button>
        {children}
      </div>
    </div>
  );
};

export default CommonPopup;
