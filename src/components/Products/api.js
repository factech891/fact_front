const API_BASE_URL = 'http://localhost:5002/api';

export const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
        throw new Error(`Error al obtener los productos: ${response.status}`);
    }
    return response.json();
};

export const saveProduct = async (product) => {
    console.log('Producto a guardar:', product);
    const method = product.id ? 'PUT' : 'POST';
    const url = product.id
        ? `${API_BASE_URL}/products/${product.id}`
        : `${API_BASE_URL}/products`;

    try {
        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: product.id,
                nombre: product.nombre || product.name,
                precio: product.precio || product.price,
                codigo: product.codigo || `P${String(product.id).padStart(3, '0')}`
            }),
        });

        if (!response.ok) {
            throw new Error(`Error al guardar el producto: ${response.status}`);
        }

        const savedProduct = await response.json();
        console.log('Respuesta del servidor:', savedProduct);
        return savedProduct;
    } catch (error) {
        console.error('Error en saveProduct:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    console.log(`ID enviado al backend para eliminar: ${id}`); // Log del ID enviado
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Error al eliminar el producto: ${response.status}`);
    }

    return response.status === 204 ? {} : await response.json();
};