import { useState, useEffect } from 'react';
import { fetchProducts, saveProduct, deleteProduct } from './api';

export const useProducts = () => {
   const [products, setProducts] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);

   const loadProducts = async () => {
       try {
           const data = await fetchProducts();
           console.log('Productos cargados:', data);
           setProducts(data);
       } catch (error) {
           setError(error.message);
       } finally {
           setLoading(false);
       }
   };

   const handleSave = async (product) => {
       try {
           const productToSave = {
               id: product.id,
               nombre: product.nombre || product.name,
               precio: product.precio || product.price,
               codigo: product.codigo || `P${String(products.length + 1).padStart(3, '0')}`
           };

           const savedProduct = await saveProduct(productToSave);
           console.log('Producto guardado:', savedProduct);
           
           setProducts(prev => {
               const newProducts = product.id
                   ? prev.map(p => p.id === product.id ? savedProduct : p)
                   : [...prev, savedProduct];
               return newProducts;
           });
       } catch (error) {
           setError(error.message);
       }
   };

   const handleDelete = async (id) => {
       try {
           await deleteProduct(Number(id));
           setProducts((prev) => prev.filter((p) => p.id !== id));
       } catch (error) {
           if (error.message.includes('404')) {
               setError('El producto no fue encontrado en el backend.');
           } else {
               setError('Error al eliminar el producto.');
           }
           console.error('Error al eliminar el producto:', error);
       }
   };

   useEffect(() => {
       loadProducts();
   }, []);

   useEffect(() => {
       console.log('Estado actual de productos:', products);
   }, [products]);

   return { products, loading, error, handleSave, handleDelete };
};