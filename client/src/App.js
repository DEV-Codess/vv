import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import RegisterUser from './components/UserMaster';
import Dashboard from './components/Dashboard';
import DonorMaster from './components/DonorMaster';
import MaharajMaster from './components/MaharajMaster';
import InventoryMaster from './components/InventoryMaster';
import CategoryMaster from './components/CategoryMaster';
import DonationCenterMaster from './components/DonationCenterMaster';
import DonationModeMaster from './components/DonationModeMaster';
import ForgotPassword from './components/ForgotPassword';
import UnitMaster from './components/UnitMaster';
import CenterFormMaster from './components/CenterForm';
import './styles/DonorMaster.css';  // Ensure this import exists!
import './styles/Dashboard.css';  // Fix: Ensure Dashboard.css is imported
import MasterPage from "./components/MasterPage";
import UserMasterPage from "./components/UserMasterPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/donor-master" element={<DonorMaster />} />
                <Route path="/maharaj-master" element={<MaharajMaster />} />
                <Route path="/inventory-master" element={<InventoryMaster />} />
                <Route path="/category-master" element={<CategoryMaster />} />
                <Route path="/donation-center-master" element={<DonationCenterMaster />} />
                <Route path="/donation-mode-master" element={<DonationModeMaster />} />
                <Route path="/unit-master" element={<UnitMaster />} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/center-form" element={<CenterFormMaster />} />
                <Route path="/user-master" element={<UserMasterPage />} />
                <Route path="/master" element={<MasterPage />} />
                {/* <Route path="/dashboard" element={<Dashboard />} /> */}
                {/* Other static pages */}
                <Route path="/purchase" element={<div>Purchase Page (Coming Soon)</div>} />
                <Route path="/places" element={<div>Places Page (Coming Soon)</div>} />
                <Route path="/inward" element={<div>Inward Page (Coming Soon)</div>} />
                <Route path="/outward" element={<div>Outward Page (Coming Soon)</div>} />
                <Route path="/reports" element={<div>Reports Page (Coming Soon)</div>} />

                 {/* Exit (Redirect to Home) */}
                <Route path="/" element={<Home />} />
            </Routes>
        </Router>
    );
}

export default App;
