// import axios from "axios";

// const API_URL = "http://localhost:5000/api/inventory";

// export const getInventory = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// export const addInventory = async (data) => {
//     await axios.post("http://localhost:5000/api/inventory", data, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   };
  
   

//   export const updateInventory = async (id, inventory) => {
//     const formData = new FormData();
//     formData.append("productName", inventory.get("productName"));
//     formData.append("region", inventory.get("region"));
//     formData.append("category", inventory.get("category"));
//     formData.append("unit", inventory.get("unit"));
//     formData.append("storageLocation", inventory.get("storageLocation"));
//     formData.append("minInventory", parseInt(inventory.get("minInventory"), 10));
//     formData.append("maxInventory", parseInt(inventory.get("maxInventory"), 10));
  
//     if (inventory.get("photo")) {
//       formData.append("photo", inventory.get("photo")); // ✅ Only send if a new image is uploaded
//     }
  
//     await axios.put(`http://localhost:5000/api/inventory/${id}`, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   };
  
  

// export const deleteInventory = async (id) => {
//   await axios.delete(`${API_URL}/${id}`);
// };

// export default { getInventory, addInventory, updateInventory, deleteInventory };
import axios from "axios";

const API_URL = "http://localhost:5000/api/inventory";

export const getInventory = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addInventory = async (formData) => {
  await axios.post(API_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateInventory = async (id, formData) => {
  await axios.put(`${API_URL}/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteInventory = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

export default {
  getInventory,
  addInventory,
  updateInventory,
  deleteInventory,
};
