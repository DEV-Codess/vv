// client/src/services/centerService.js

import axios from 'axios';

const API_URL = '/api/center-form'; // Ensure it matches your server route

// Fetch all centers
export const getCenters = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch centers';
  }
};

// Add a new center
export const addCenter = async (centerData) => {
  try {
    const response = await axios.post(API_URL, centerData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to add center';
  }
};

// Update existing center
export const updateCenter = async (id, centerData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, centerData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update center';
  }
};

// Delete a center
export const deleteCenter = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete center';
  }
};
