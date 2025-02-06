import { useState, useEffect } from 'react';
import { fetchProducts, saveProduct, deleteProduct } from './api';

export const useProducts = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   // Función para cargar productos
   const loadProducts = async () => {
       try {
           const data = await fetchProducts();
           console.log('Productos cargados:', data);
           setProducts(data); // Guardamos los productos en el estado
       } catch (error) {
           setError(error.message);
       } finally {
           setLoading(false);
       }
   };

   // Función para guardar un producto
   const handleSave = async (product) => {
       try {
           const productToSave = {
               id: product._id, // Usamos _id en lugar de id
               nombre: product.nombre || product.name,
               precio: product.precio || product.price,
               codigo: product.codigo || `P${String(products.length + 1).padStart(3, '0')}`
           };

           const savedProduct = await saveProduct(productToSave);
           console.log('Producto guardado:', savedProduct);

           // Actualizamos la lista de productos
           setProducts(prev => {
               const newProducts = product._id
                   ? prev.map(p => p._id === product._id ? savedProduct : p) // Edición
                   : [...prev, savedProduct]; // Creación
               return newProducts;
           });
       } catch (error) {
           setError(error.message);
       }
   };

   // Función para eliminar un producto
   const handleDelete = async (_id) => { // Cambiamos id por _id
       try {
           await deleteProduct(_id); // Enviamos el _id al backend
           setProducts((prev) => prev.filter((p) => p._id !== _id)); // Filtramos por _id
       } catch (error) {
           if (error.message.includes('404')) {
               setError('El producto no fue encontrado en el backend.');
           } else {
               setError('Error al eliminar el producto.');
           }
           console.error('Error al eliminar el producto:', error);
       }
   };

   // Cargar productos cuando el componente se monta
   useEffect(() => {
       loadProducts();
   }, []);

   // Monitorear cambios en la lista de productos
   useEffect(() => {
       console.log('Estado actual de productos:', products);
   }, [products]);

   // Retornamos los valores necesarios
   return { products, loading, error, handleSave, handleDelete };
};