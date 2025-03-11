// src/hooks/useDashboard.js
import { useState, useEffect, useMemo } from 'react';
import { useInvoices } from './useInvoices';
import { useClients } from './useClients';
import { useProducts } from './useProducts';

export const useDashboard = (timeRange = null) => {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProducts();
  
  const loading = invoicesLoading || clientsLoading || productsLoading;

  // Filtrar facturas por rango de tiempo (si se proporciona)
  const filteredInvoices = useMemo(() => {
    if (!invoices.length || !timeRange) return invoices;
    
    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.fecha || invoice.date);
      return invoiceDate >= timeRange.startDate && invoiceDate <= timeRange.endDate;
    });
  }, [invoices, timeRange]);

  // Procesar datos para KPIs
  const kpis = useMemo(() => {
    if (loading) return {
      totalIngresos: 0,
      totalOperaciones: 0,
      totalClientes: 0,
      totalFacturas: 0
    };

    // Calcular totales
    const totalIngresos = filteredInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    const totalFacturas = filteredInvoices.length;
    const totalClientes = clients.length;
    
    // Calcular cambios porcentuales (simulados - en una implementación real podrías comparar con el mes anterior)
    // Por ahora usaremos valores aleatorios para simular
    const cambioIngresos = 5.2; 
    const cambioOperaciones = 3.1;
    const cambioClientes = -0.8;
    const cambioFacturas = -2.5;

    return {
      totalIngresos,
      totalOperaciones: totalFacturas, // Usando la cantidad de facturas como operaciones
      totalClientes,
      totalFacturas,
      cambioIngresos,
      cambioOperaciones,
      cambioClientes,
      cambioFacturas
    };
  }, [filteredInvoices, clients, loading]);

  // Procesar datos para el gráfico de facturación mensual
  const facturasPorMes = useMemo(() => {
    if (loading) return [];

    const mesesMap = {};
    
    filteredInvoices.forEach(invoice => {
      const fecha = new Date(invoice.fecha || invoice.date);
      const mes = fecha.toLocaleString('es', { month: 'short' });
      
      if (!mesesMap[mes]) {
        mesesMap[mes] = 0;
      }
      
      mesesMap[mes] += parseFloat(invoice.total) || 0;
    });
    
    // Convertir a array para el gráfico
    return Object.entries(mesesMap).map(([name, total]) => ({
      name,
      total
    }));
  }, [filteredInvoices, loading]);

  // Procesar datos para el gráfico de distribución por tipo
  // Asumiendo que cada factura tiene un campo 'tipo' (si no lo tiene, ajustar según sea necesario)
  const facturasPorTipo = useMemo(() => {
    if (loading) return [];

    const tiposMap = {};
    const total = filteredInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total) || 0), 0);
    
    filteredInvoices.forEach(invoice => {
      const tipo = invoice.tipo || 'Nacional'; // Valor por defecto si no hay tipo
      
      if (!tiposMap[tipo]) {
        tiposMap[tipo] = 0;
      }
      
      tiposMap[tipo] += parseFloat(invoice.total) || 0;
    });
    
    // Convertir a array y calcular porcentajes
    return Object.entries(tiposMap).map(([name, value]) => ({
      name,
      value: Math.round((value / total) * 100) // Porcentaje redondeado
    }));
  }, [filteredInvoices, loading]);

  // Procesar datos para facturas recientes
  const facturasRecientes = useMemo(() => {
    if (loading) return [];

    return filteredInvoices
      .sort((a, b) => new Date(b.fecha || b.date) - new Date(a.fecha || a.date))
      .slice(0, 5)
      .map(invoice => {
        const cliente = clients.find(c => c._id === (invoice.cliente || invoice.clientId));
        return {
          id: invoice.numeroFactura || invoice.invoiceNumber || invoice._id,
          cliente: cliente ? (cliente.nombre || cliente.name) : 'Cliente desconocido',
          fecha: new Date(invoice.fecha || invoice.date).toLocaleDateString('es-ES'),
          total: parseFloat(invoice.total) || 0,
          estado: invoice.estado || invoice.status || 'Pendiente'
        };
      });
  }, [filteredInvoices, clients, loading]);

  // Procesar datos para clientes recientes
  const clientesRecientes = useMemo(() => {
    if (loading) return [];

    // Contar facturas por cliente
    const facturasPorCliente = {};
    filteredInvoices.forEach(invoice => {
      const clienteId = invoice.cliente || invoice.clientId;
      if (!facturasPorCliente[clienteId]) {
        facturasPorCliente[clienteId] = 0;
      }
      facturasPorCliente[clienteId]++;
    });

    // Obtener los clientes con sus facturas
    return clients
      .slice(0, 5)
      .map(client => ({
        id: client._id,
        nombre: client.nombre || client.name,
        pais: client.pais || client.country || 'Desconocido',
        facturas: facturasPorCliente[client._id] || 0
      }));
  }, [filteredInvoices, clients, loading]);

  return {
    loading,
    kpis,
    facturasPorMes,
    facturasPorTipo,
    facturasRecientes,
    clientesRecientes
  };
};