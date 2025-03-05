import axios from "axios";

// ✅ Ensure this matches the backend route
const API_URL = "http://localhost:5000/api/donation-centers"; 

export const getDonationCenters = async () => {
  return await axios.get(API_URL);
};

export const addDonationCenter = async (center) => {
  return await axios.post(API_URL, center); // 🚩 This is causing the error
};

export const updateDonationCenter = async (id, center) => {
  return await axios.put(`${API_URL}/${id}`, center);
};

export const deleteDonationCenter = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};


export default { getDonationCenters, addDonationCenter, updateDonationCenter, deleteDonationCenter };
