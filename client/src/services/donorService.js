import axios from "axios";

const API_URL = "http://localhost:5000/api/donors";  // ✅ Correct API URL

export const getDonors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addDonor = async (donor) => {
  await axios.post(API_URL, donor);
};

export const updateDonor = async (id, donor) => {
  await axios.put(`http://localhost:5000/api/donors/${id}`, donor);  // ✅ Correct URL
};

export const deleteDonor = async (id) => {
  await axios.delete(`${API_URL}/${id}`);  // ✅ Correct Delete URL
};

export default { getDonors, addDonor, updateDonor, deleteDonor };
