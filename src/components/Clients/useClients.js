import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5002/api';

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClients = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/clients`);
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            const data = await response.json();
            setClients(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const saveClient = async (client) => {
        try {
            const method = client.id ? 'PUT' : 'POST';
            const url = client.id 
                ? `${API_BASE_URL}/clients/${client.id}`
                : `${API_BASE_URL}/clients`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(client),
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const savedClient = await response.json();
            setClients((prev) =>
                client.id
                    ? prev.map((c) => (c.id === client.id ? savedClient : c))
                    : [...prev, savedClient]
            );
        } catch (error) {
            setError(error.message);
        }
    };

    const deleteClient = async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/clients/${id}`, { 
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            setClients((prev) => prev.filter((c) => c.id !== id));
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    return { clients, loading, error, saveClient, deleteClient };
};