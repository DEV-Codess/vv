import axios from "axios";

const API_URL = "http://localhost:5000/api/maharajs";

export const getMaharajs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addMaharaj = async (maharajData) => {
  return await axios.post(API_URL, maharajData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateMaharaj = async (id, maharajData) => {
  return await axios.put(`${API_URL}/${id}`, maharajData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteMaharaj = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export default {
  getMaharajs,
  addMaharaj,
  updateMaharaj,
  deleteMaharaj,
};
