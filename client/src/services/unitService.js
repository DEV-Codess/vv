import axios from "axios";

const API_URL = "http://localhost:5000/api/unit";

export const getUnits = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addUnit = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateUnit = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteUnit = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getUnits,
  addUnit,
  updateUnit,
  deleteUnit,
};
