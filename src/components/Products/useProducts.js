import { useState, useEffect } from 'react';
import { fetchProducts, saveProduct, deleteProduct } from './api';

export const useProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await fetchProducts();
            setProducts(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handleSave = async (product) => {
        try {
            const savedProduct = await saveProduct(product);
            setProducts((prev) =>
                product.id
                    ? prev.map((p) => (p.id === product.id ? savedProduct : p))
                    : [...prev, savedProduct]
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        console.log(`ID del producto a eliminar: ${id}`);  // Verifica el ID
        console.log(`Productos actuales:`, products);      // Verifica la lista de productos
        try {
            await deleteProduct(Number(id));  // Convierte el ID a número
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

    return { products, loading, error, handleSave, handleDelete };
};