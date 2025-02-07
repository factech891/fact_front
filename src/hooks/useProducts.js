// src/hooks/useProducts.js
import { useState, useEffect } from 'react';
import { productsApi } from '../services/api';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      const data = await productsApi.getAll();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const saveProduct = async (product) => {
    try {
      const savedProduct = product._id 
        ? await productsApi.update(product._id, product)
        : await productsApi.create(product);
      await fetchProducts();
      return savedProduct;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await productsApi.delete(id);
      await fetchProducts();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, saveProduct, deleteProduct };
};