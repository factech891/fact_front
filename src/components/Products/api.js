// api.js
const API_BASE_URL = 'http://localhost:5002/api';

export const fetchProducts = async () => {
   const response = await fetch(`${API_BASE_URL}/products`);
   if (!response.ok) {
       const error = await response.json();
       throw new Error(error.error || `Error: ${response.status}`);
   }
   return response.json();
};

export const saveProduct = async (product) => {
   const method = product.id ? 'PUT' : 'POST';
   const url = product.id
       ? `${API_BASE_URL}/products/${product.id}`
       : `${API_BASE_URL}/products`;

   const bodyData = {
       nombre: product.nombre,
       precio: Number(product.precio)
   };

   if (!product.id) {
       bodyData.codigo = product.codigo?.toUpperCase();
   }

   const response = await fetch(url, {
       method,
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(bodyData)
   });

   if (!response.ok) {
       const error = await response.json();
       throw new Error(error.error || `Error: ${response.status}`);
   }

   return response.json();
};

export const deleteProduct = async (id) => {
   const response = await fetch(`${API_BASE_URL}/products/${id}`, {
       method: 'DELETE',
   });

   if (!response.ok && response.status !== 204) {
       const error = await response.json();
       throw new Error(error.error || `Error: ${response.status}`);
   }

   return response.status === 204 ? {} : response.json();
};