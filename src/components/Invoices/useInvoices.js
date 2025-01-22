import { useState, useEffect, useCallback } from 'react';
import { fetchInvoices, saveInvoice, deleteInvoice } from './api';

export const useInvoices = () => {
    const [facturas, setFacturas] = useState([]);
    const [filteredFacturas, setFilteredFacturas] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadInvoices = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchInvoices();
            // Asegúrate de que `client` sea un objeto con la estructura correcta
            const formattedData = data.map(factura => ({
                ...factura,
                client: {
                    nombre: factura.client.nombre || "Cliente sin nombre",
                    direccion: factura.client.direccion || "",
                    cuit: factura.client.cuit || "",
                    condicionIva: factura.client.condicionIva || "",
                },
            }));
            setFacturas(formattedData);
            setFilteredFacturas(formattedData);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadInvoices();
    }, [loadInvoices]);

    const handleSearch = useCallback((term) => {
        setSearchTerm(term);
        const lowercaseTerm = term.toLowerCase();
        setFilteredFacturas(
            facturas.filter(factura => 
                factura.client.nombre.toLowerCase().includes(lowercaseTerm)
            )
        );
    }, [facturas]);

    const handleSave = async (invoice) => {
        try {
            const data = await saveInvoice(invoice);
            const updatedFacturas = invoice.id
                ? facturas.map(f => (f.id === data.id ? data : f))
                : [...facturas, data];
            setFacturas(updatedFacturas);
            setFilteredFacturas(updatedFacturas);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteInvoice(id);
            const updatedFacturas = facturas.filter(f => f.id !== id);
            setFacturas(updatedFacturas);
            setFilteredFacturas(updatedFacturas);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        facturas,
        filteredFacturas,
        searchTerm,
        loading,
        error,
        handleSearch,
        handleSave,
        handleDelete,
    };
};