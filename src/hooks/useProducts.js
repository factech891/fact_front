// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setError(null); // Limpiar errores anteriores
      const data = await productsApi.getAll();
      console.log('5. Datos recibidos del API:', data);

      // Verifica que los datos sean un array
      if (!Array.isArray(data)) {
        throw new Error('Los datos recibidos no son un array');
      }

      // Asegurar que el precio y el stock sean números
      const processedData = data.map(product => {
        if (!product) {
          console.warn('Producto undefined detectado:', product);
          return { precio: 0, stock: 0 }; // Producto por defecto
        }
        return {
          ...product,
          precio: Number(product.precio) || 0,
          stock: Number(product.stock) || 0
        };
      });

      console.log('6. Datos procesados:', processedData);
      setProducts(processedData);
      setLoading(false);
    } catch (error) {
      console.error('Error en fetchProducts:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const saveProduct = async (product) => {
    try {
      setError(null); // Limpiar errores anteriores
      console.log('3. useProducts - Antes de API:', {
        precio: product.precio,
        productoCompleto: product
      });
      const savedProduct = product._id 
        ? await productsApi.update(product._id, product)
        : await productsApi.create(product);
      console.log('4. useProducts - Respuesta API:', savedProduct);
      await fetchProducts();
      return savedProduct;
    } catch (error) {
      console.error('Error en saveProduct:', error);
      setError(error.message);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      setError(null); // Limpiar errores anteriores
      const response = await productsApi.delete(id);
      await fetchProducts();
      return { success: true, message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error('Error en deleteProduct:', error);
      // Manejar específicamente el error de permisos
      const errorMessage = error.message || 'Error al eliminar el producto';
      setError(errorMessage);
      throw error; // Propagar el error para que la UI pueda reaccionar
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, saveProduct, deleteProduct, fetchProducts };
};