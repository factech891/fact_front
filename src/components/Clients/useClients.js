// useClients.js
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5002/api';

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`);
            if (!response.ok) throw new Error(`Error: ${response.status}`);
            const data = await response.json();
            console.log('Clientes cargados:', data);
            setClients(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const saveClient = async (client) => {
        try {
            const clientData = {
                nombre: client.nombre,
                rif: client.rif,
                direccion: client.direccion,
                telefono: client.telefono,
                email: client.email
            };

            const method = client._id ? 'PUT' : 'POST';
            const url = client._id 
                ? `${API_BASE_URL}/clients/${client._id}`
                : `${API_BASE_URL}/clients`;

            console.log('Sending request to:', url, 'with method:', method);

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error: ${response.status}`);
            }

            const savedClient = await response.json();
            await fetchClients();
            return savedClient;
        } catch (error) {
            console.error('Error in saveClient:', error);
            setError(error.message);
            throw error;
        }
    };

    const deleteClient = async (_id) => {
        try {
            console.log('Attempting to delete client with ID:', _id);
            const response = await fetch(`${API_BASE_URL}/clients/${_id}`, { 
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Error: ${response.status}`);
            }

            console.log('Client deleted successfully');
            await fetchClients();
        } catch (error) {
            console.error('Error in deleteClient:', error);
            setError(error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return { clients, loading, error, saveClient, deleteClient };
};