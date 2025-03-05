import axios from "axios";

const API_URL = "http://localhost:5000/api/donation-modes";

export const getDonationModes = async () => {
  return await axios.get(API_URL);
};

export const addDonationMode = async (mode) => {
  return await axios.post(API_URL, mode);
};

export const updateDonationMode = async (id, mode) => {
  return await axios.put(`${API_URL}/${id}`, mode);
};

export const deleteDonationMode = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export default { getDonationModes, addDonationMode, updateDonationMode, deleteDonationMode };
