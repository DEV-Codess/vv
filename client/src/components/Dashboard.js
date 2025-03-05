// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Dashboard.css";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const role = localStorage.getItem("role") || "user";
//   const permissions = role === 'user'
//     ? JSON.parse(localStorage.getItem('permissions') || '[]')
//     : [];

//   // Define all available tables (with routes)
//   const tableButtons = [
//     { label: 'Donor Master', route: '/donor-master' },
//     { label: 'Maharaj Master', route: '/maharaj-master' },
//     { label: 'Inventory Master', route: '/inventory-master' },
//     { label: 'Category Master', route: '/category-master' },
//     { label: 'Donation Center Master', route: '/donation-center-master' },
//     { label: 'Donation Mode Master', route: '/donation-mode-master' },
//     { label: 'Unit Master', route: '/unit-master' },
//   ];

//   // Decide which buttons to display based on role/permissions
//   const displayedButtons = role === 'admin'
//     ? tableButtons
//     : tableButtons.filter(btn => permissions.includes(btn.label));

//   return (
//     <div className="dashboard-wrapper">
//       <div className="dashboard-container">
//         <h1 className="dashboard-title">Master Dashboard</h1>
//         <div className="dashboard-grid">
//           {displayedButtons.map((btn, idx) => (
//             <button
//               key={idx}
//               className="dashboard-button"
//               onClick={() => navigate(btn.route)}
//             >
//               {btn.label}
//             </button>
//           ))}

//           {/* Admin-only extra buttons */}
//           {role === "admin" && (
//             <>
//               <button
//                 className="dashboard-button"
//                 onClick={() => navigate("/center-form")}
//               >
//                 Add Centre
//               </button>
//               <button
//                 className="dashboard-button"
//                 onClick={() => navigate("/register-user")}
//               >
//                 Register New User
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "user";
  const permissions = role === "user"
    ? JSON.parse(localStorage.getItem("permissions") || "[]")
    : [];

  // Admin Dashboard Buttons
  const adminButtons = [
    { label: "Master", route: "/master" },
    { label: "Donor", route: "/donor-master" },
    { label: "Purchase", route: "/purchase", static: true },
    { label: "Staff", route: "/register-user" },
    { label: "Vayavach Center", route: "/center-form" },
    { label: "Places", route: "/places", static: true },
    { label: "Exit", route: "/", static: true },
  ];

  // User Dashboard Buttons
  const userButtons = [
    { label: "Master", route: "/user-master" },
    { label: "Inward", route: "/inward", static: true },
    { label: "Outward", route: "/outward", static: true },
    { label: "Reports", route: "/reports", static: true },
    { label: "Exit", route: "/", static: true },
  ];

  // Decide which set of buttons to display
  const displayedButtons = role === "admin" ? adminButtons : userButtons;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard</h1>

        <div className="dashboard-grid">
          {displayedButtons.map((btn, idx) => (
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

export default Dashboard;
