// src/hooks/useDashboard.js - Solución actualizada
import { useState, useEffect, useMemo } from 'react';
import { useInvoices } from './useInvoices';
import { useClients } from './useClients';
import { useProducts } from './useProducts';

// Función auxiliar para truncar objetos grandes
function truncateObject(obj, maxLength = 100) {
  const str = JSON.stringify(obj, null, 2);
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

// Función para normalizar IDs
function normalizeId(id) {
  if (!id) return null;
  return typeof id === 'object' ? id.toString() : String(id);
}

export const useDashboard = (timeRange = null, exchangeRate = 35.68) => {
  const { invoices, loading: invoicesLoading } = useInvoices();
  const { clients, loading: clientsLoading } = useClients();
  const { products, loading: productsLoading } = useProducts();
  
  const loading = invoicesLoading || clientsLoading || productsLoading;

  // Filtrar facturas por rango de tiempo
  const filteredInvoices = useMemo(() => {
    if (!invoices.length || !timeRange) return invoices;
    
    return invoices.filter(invoice => {
      const invoiceDate = new Date(invoice.fecha || invoice.date);
      return invoiceDate >= timeRange.startDate && invoiceDate <= timeRange.endDate;
    });
  }, [invoices, timeRange]);

  // Función auxiliar para convertir monedas
  const convertCurrency = (amount, fromCurrency, toCurrency) => {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'USD' && toCurrency === 'VES') {
      return amount * exchangeRate;
    } else if (fromCurrency === 'VES' && toCurrency === 'USD') {
      return amount / exchangeRate;
    }
    
    return amount; // Si no hay conversión disponible
  };

  // Procesar datos para KPIs con monedas SEPARADAS Y CONSOLIDADAS
  const kpis = useMemo(() => {
    if (loading) return {
      totalPorMoneda: [],
      totalOperaciones: 0,
      totalClientes: 0,
      totalFacturas: 0,
      cambioIngresos: 0,
      cambioOperaciones: 0,
      cambioClientes: 0,
      cambioFacturas: 0,
      totalConsolidadoUSD: 0,
      totalConsolidadoVES: 0
    };

    // Calcular totales por moneda (separados)
    const totalesPorMoneda = {};
    let totalConsolidadoUSD = 0;
    
    filteredInvoices.forEach(invoice => {
      const moneda = invoice.moneda || 'USD';
      const total = parseFloat(invoice.total) || 0;
      
      if (!totalesPorMoneda[moneda]) {
        totalesPorMoneda[moneda] = 0;
      }
      
      totalesPorMoneda[moneda] += total;
      
      // Consolidar en USD
      if (moneda === 'USD') {
        totalConsolidadoUSD += total;
      } else if (moneda === 'VES') {
        totalConsolidadoUSD += convertCurrency(total, 'VES', 'USD');
      }
    });
    
    // Convertir a array para la visualización
    const totalPorMoneda = Object.entries(totalesPorMoneda).map(([moneda, total]) => ({
      moneda,
      total
    }));
    
    // Calcular total consolidado en VES
    const totalConsolidadoVES = convertCurrency(totalConsolidadoUSD, 'USD', 'VES');
    
    const totalFacturas = filteredInvoices.length;
    const totalClientes = clients.length;
    
    // Cambios porcentuales simulados
    const cambioIngresos = 5.2; 
    const cambioOperaciones = 3.1;
    const cambioClientes = -0.8;
    const cambioFacturas = -2.5;

    return {
      totalPorMoneda,
      totalOperaciones: totalFacturas,
      totalClientes,
      totalFacturas,
      cambioIngresos,
      cambioOperaciones,
      cambioClientes,
      cambioFacturas,
      totalConsolidadoUSD,
      totalConsolidadoVES
    };
  }, [filteredInvoices, clients, loading, exchangeRate]);

  // Procesar datos para el gráfico de facturación mensual - SEPARADO POR MONEDA
  const facturasPorMes = useMemo(() => {
    if (loading || !filteredInvoices.length) return [];

    const mesesMap = {};
    
    filteredInvoices.forEach(invoice => {
      const fecha = new Date(invoice.fecha || invoice.date);
      const mes = fecha.toLocaleString('es', { month: 'short' });
      const moneda = invoice.moneda || 'USD';
      const total = parseFloat(invoice.total) || 0;
      
      if (!mesesMap[mes]) {
        mesesMap[mes] = { 
          USD: 0, 
          VES: 0,
          total: 0 // Total en USD para visualización
        };
      }
      
      // Agregar a la moneda correspondiente
      mesesMap[mes][moneda] += total;
      
      // Actualizar el total (convertido a USD para comparación)
      if (moneda === 'USD') {
        mesesMap[mes].total += total;
      } else if (moneda === 'VES') {
        mesesMap[mes].total += convertCurrency(total, 'VES', 'USD');
      } else {
        mesesMap[mes].total += total; // Otras monedas como USD por defecto
      }
    });
    
    // Convertir a array para el gráfico
    return Object.entries(mesesMap).map(([name, data]) => ({
      name,
      USD: Math.round(data.USD * 100) / 100,
      VES: Math.round(data.VES * 100) / 100,
      total: Math.round(data.total * 100) / 100
    }));
  }, [filteredInvoices, loading, exchangeRate]);

  // Distribución por moneda - PORCENTAJES PRECISOS
  const facturasPorTipo = useMemo(() => {
    if (loading || !filteredInvoices.length) return [];

    const monedasMap = {};
    
    // Calcular totales en USD para tener una base común
    let totalUSD = 0;
    
    filteredInvoices.forEach(invoice => {
      const moneda = invoice.moneda || 'USD';
      const total = parseFloat(invoice.total) || 0;
      
      if (!monedasMap[moneda]) {
        monedasMap[moneda] = 0;
      }
      
      monedasMap[moneda] += total;
      
      // Convertir a USD para calcular porcentajes
      if (moneda === 'USD') {
        totalUSD += total;
      } else if (moneda === 'VES') {
        totalUSD += convertCurrency(total, 'VES', 'USD');
      } else {
        totalUSD += total; // Otras monedas se tratan como USD
      }
    });
    
    // Convertir a array y calcular porcentajes
    return Object.entries(monedasMap).map(([moneda, value]) => {
      // Convertir el valor a USD para calcular el porcentaje
      let valueInUSD = value;
      if (moneda === 'VES') {
        valueInUSD = convertCurrency(value, 'VES', 'USD');
      }
      
      const porcentaje = Math.round((valueInUSD / totalUSD) * 100);
      
      // Formatear nombre para visualización
      const monedaEmojis = {
        'USD': '💵 USD',
        'VES': '💰 VES',
        'EUR': '💶 EUR',
        'BTC': '₿ BTC',
      };
      
      const name = monedaEmojis[moneda] || moneda;
      
      return {
        name,
        value: porcentaje,
        raw: value // Valor original sin formato
      };
    });
  }, [filteredInvoices, loading, exchangeRate]);

  // El resto del código permanece igual...
  const facturasRecientes = useMemo(() => {
    if (loading || !filteredInvoices.length) return [];

    return filteredInvoices
      .sort((a, b) => new Date(b.fecha || b.date) - new Date(a.fecha || a.date))
      .slice(0, 5)
      .map(invoice => {
        // Obtener número de factura
        const numeroFactura = invoice.number || invoice.numeroFactura || invoice.numero || 
                        `INV-${invoice._id ? invoice._id.substring(0, 4) : Math.floor(Math.random() * 9000 + 1000)}`;
        
        // Obtener nombre del cliente usando los datos populados
        let clienteNombre = 'Cliente desconocido';
        
        // Verificar si el cliente está populado como objeto
        if (invoice.client && typeof invoice.client === 'object') {
          clienteNombre = invoice.client.name || invoice.client.nombre || clienteNombre;
        } 
        // Verificar nombres alternativos de propiedades
        else if (invoice.cliente && typeof invoice.cliente === 'object') {
          clienteNombre = invoice.cliente.name || invoice.cliente.nombre || clienteNombre;
        }
        // Si tenemos un ID de cliente pero no está populado, buscarlo en el array de clientes
        else if (invoice.client || invoice.cliente || invoice.clientId) {
          const clientId = invoice.client || invoice.cliente || invoice.clientId;
          const cliente = clients.find(c => normalizeId(c._id) === normalizeId(clientId));
          if (cliente) {
            clienteNombre = cliente.nombre || cliente.name || clienteNombre;
          }
        }
        
        // Emoji según estado
        let estadoEmoji = '';
        const estado = invoice.status || invoice.estado || 'borrador';
        
        switch (estado.toLowerCase()) {
          case 'paid':
          case 'pagada':
            estadoEmoji = '✅ ';
            break;
          case 'issued':
          case 'emitida':
            estadoEmoji = '⏳ ';
            break;
          case 'draft':
          case 'borrador':
            estadoEmoji = '📝 ';
            break;
          case 'cancelled':
          case 'cancelada':
            estadoEmoji = '❌ ';
            break;
          default:
            estadoEmoji = '📄 ';
        }
        
        // Traducir estado
        const estadoTraducido = {
          'draft': 'Borrador',
          'issued': 'Emitida',
          'paid': 'Pagada',
          'cancelled': 'Cancelada',
          'borrador': 'Borrador',
          'emitida': 'Emitida',
          'pagada': 'Pagada',
          'cancelada': 'Cancelada'
        }[estado.toLowerCase()] || 'Borrador';
        
        return {
          id: numeroFactura,
          cliente: `👤 ${clienteNombre}`,
          fecha: new Date(invoice.fecha || invoice.date).toLocaleDateString('es-ES'),
          total: parseFloat(invoice.total) || 0,
          moneda: invoice.moneda || 'USD',
          estado: `${estadoEmoji}${estadoTraducido}`
        };
      });
  }, [filteredInvoices, clients, loading]);

  // Clientes recientes permanece igual
  const clientesRecientes = useMemo(() => {
    if (loading || !clients.length) return [];

    return clients
      .slice(0, 5)
      .map(client => {
        const nombreCliente = client.nombre || client.name;
        
        // Contar facturas relacionadas directamente desde las facturas disponibles
        const clienteFacturas = filteredInvoices.filter(invoice => {
          // Verificar por ID si el cliente está como objeto o como referencia
          if (invoice.client && typeof invoice.client === 'object') {
            return normalizeId(invoice.client._id) === normalizeId(client._id);
          } 
          // Verificar por referencia directa
          return normalizeId(invoice.client) === normalizeId(client._id) || 
                normalizeId(invoice.cliente) === normalizeId(client._id) || 
                normalizeId(invoice.clientId) === normalizeId(client._id);
        }).length;
        
        // Emoji según número de facturas
        let facturaEmoji = '';
        if (clienteFacturas > 10) facturaEmoji = '🔥 ';
        else if (clienteFacturas > 5) facturaEmoji = '⭐ ';
        else if (clienteFacturas > 0) facturaEmoji = '📄 ';
        else facturaEmoji = '📭 ';
        
        // Extraer email y documento correctamente
        const email = client.email || client.correo || '';
        const documento = client.rif || client.RIF || client.documento || '';
        
        return {
          id: client._id,
          nombre: `👤 ${nombreCliente}`,
          email: email,
          documento: documento,
          facturas: `${facturaEmoji}${clienteFacturas}`
        };
      });
  }, [clients, filteredInvoices, loading]);

  return {
    loading,
    kpis,
    facturasPorMes,
    facturasPorTipo,
    facturasRecientes,
    clientesRecientes,
    exchangeRate: exchangeRate
  };
};