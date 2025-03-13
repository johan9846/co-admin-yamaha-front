import Axios from "axios";

const apiUrl = import.meta.env.VITE_URL_MASTER_DATA;
console.log(apiUrl, " apiUrl");

export const getAllCategories = async () => {
  return Axios.get(`${apiUrl}/categories/allCategories`);
};

export const addCategories = async (body) => {
  return Axios.post(`${apiUrl}/categories/addCategory`, body);
};

export const updateCategories = async (id, body) => {
  return Axios.put(`${apiUrl}/categories/updateCategory/${id}`, body);
};

//productos

export const getAllProduct = async () => {
  return Axios.get(`${apiUrl}/products/allProducts`);
};


export const addProduct = async (formData) => {
  return Axios.post(`${apiUrl}/products/addProduct`, formData, {
    headers: {
      "Content-Type": "multipart/form-data", // Indica que se está enviando un archivo
    },
  });
};

export const deleteProduct = async (ids) => {
  return Axios.delete(`${apiUrl}/products/deleteProduct`, {
    data: { ids }, // Enviar el array correctamente como "ids"
    headers: { "Content-Type": "application/json" },
  });
};

export const updateProduct = async (id, body) => {
  return Axios.put(`${apiUrl}/products/updateProduct/${id}`, body);
};
