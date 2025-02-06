import { useState, useEffect, useCallback } from 'react';
import { fetchInvoices, saveInvoice, deleteInvoice } from './api';
import { fetchClients } from '../Clients/api';
import { fetchProducts } from '../Products/api';

export const useInvoices = () => {
  const [facturas, setFacturas] = useState([]);
  const [filteredFacturas, setFilteredFacturas] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInvoices = useCallback(async () => {
      try {
          setLoading(true);
          const [invoicesData, clientsData, productsData] = await Promise.all([
              fetchInvoices(),
              fetchClients(),
              fetchProducts()
          ]);

          const formattedProducts = productsData.map(product => ({
              _id: product._id,
              codigo: product.codigo,
              nombre: product.nombre,
              precio: product.precio
          }));

          const formattedInvoices = invoicesData.map(factura => ({
              ...factura,
              client: {
                  _id: factura.client._id,
                  nombre: factura.client.nombre || "Cliente sin nombre",
                  direccion: factura.client.direccion || "",
                  rif: factura.client.rif || "",
                  condicionIva: factura.client.condicionIva || "",
              },
          }));

          setFacturas(formattedInvoices);
          setFilteredFacturas(formattedInvoices);
          setClients(clientsData);
          setProducts(formattedProducts);
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
              factura.client.nombre.toLowerCase().includes(lowercaseTerm) ||
              factura.client.rif?.toLowerCase().includes(lowercaseTerm)
          )
      );
  }, [facturas]);

  const handleSave = async (invoice) => {
      try {
          const data = await saveInvoice(invoice);
          const updatedFacturas = invoice._id
              ? facturas.map(f => (f._id === data._id ? {...data} : f))
              : [...facturas, data];
          setFacturas(updatedFacturas);
          setFilteredFacturas(updatedFacturas);
          return data;
      } catch (err) {
          setError(err.message);
          throw err;
      }
  };

  const handleDelete = async (_id) => {
      try {
          await deleteInvoice(_id);
          const updatedFacturas = facturas.filter(f => f._id !== _id);
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
      clients,
      products,
      searchTerm,
      loading,
      error,
      handleSearch,
      handleSave,
      handleDelete,
  };
};