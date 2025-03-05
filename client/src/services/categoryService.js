// import axios from "axios";

// const API_URL = "http://localhost:5000/api/categories";

// export const getCategories = async () => {
//   const response = await axios.get(API_URL);
//   return response.data;
// };

// export const addCategory = async (formData) => {
//     await axios.post("http://localhost:5000/api/categories", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//   };
  
  
//   export const updateCategory = async (id, category) => {
//     const formData = new FormData();
//     formData.append("primaryCategory", category.get("primaryCategory"));
//     formData.append("subCategory", category.get("subCategory"));
//     formData.append("productName", category.get("productName"));

//     if (category.get("photo")) {
//         formData.append("photo", category.get("photo"));
//     } else if (category.get("existingPhoto")) {
//         formData.append("existingPhoto", category.get("existingPhoto"));
//     }

//     await axios.put(`http://localhost:5000/api/categories/${id}`, formData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//         },
//     });
// };



// export const deleteCategory = async (id) => {
//   await axios.delete(`${API_URL}/${id}`);
// };

// export default { getCategories, addCategory, updateCategory, deleteCategory };
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

export const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addCategory = async (categoryData) => {
  return await axios.post(API_URL, categoryData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateCategory = async (id, categoryData) => {
  return await axios.put(`${API_URL}/${id}`, categoryData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteCategory = async (id) => {
  return await axios.delete(`${API_URL}/${id}`);
};

export default { getCategories, addCategory, updateCategory, deleteCategory };
