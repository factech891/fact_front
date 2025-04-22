// src/hooks/useDashboard.js (con Diagnósticos)
import { useState, useEffect, useMemo } from 'react';
import { useInvoices } from './useInvoices'; // Asegúrate que la ruta sea correcta
import { useClients } from './useClients';   // Asegúrate que la ruta sea correcta
import { useProducts } from './useProducts'; // Asegúrate que la ruta sea correcta
import exchangeRateApi from '../services/exchangeRateApi'; // Asegúrate que la ruta sea correcta

// Función auxiliar para truncar objetos grandes (sin cambios)
function truncateObject(obj, maxLength = 100) {
  const str = JSON.stringify(obj, null, 2);
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
}

// Función para normalizar IDs (sin cambios)
function normalizeId(id) {
  if (!id) return null;
  return typeof id === 'object' ? id.toString() : String(id);
}

// Función auxiliar para obtener rango de fechas según la selección (sin cambios)
const getDateRangeFromSelection = (selectedRange, customDateRange = null) => {
  if (selectedRange === 'custom' && customDateRange) {
    return {
      startDate: new Date(customDateRange.startDate),
      endDate: new Date(customDateRange.endDate)
    };
  }
  const today = new Date();
  const startDate = new Date();
  const endDate = new Date();
  switch (selectedRange) {
    case 'today':
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      startDate.setDate(today.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(today.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      const dayOfWeek = today.getDay();
      const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate.setDate(diff);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'lastWeek':
      const lastWeekDayOfWeek = today.getDay();
      const lastWeekDiff = today.getDate() - lastWeekDayOfWeek - 6;
      startDate.setDate(lastWeekDiff);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(lastWeekDiff + 6);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'lastMonth':
      startDate.setMonth(today.getMonth() - 1, 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(0);
      endDate.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '1M':
      startDate.setDate(today.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '3M':
      startDate.setMonth(today.getMonth() - 3);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '6M':
      startDate.setMonth(today.getMonth() - 6);
      startDate.setHours(0, 0, 0, 0);
      break;
    case '1Y':
      startDate.setFullYear(today.getFullYear() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate.setDate(1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setMonth(today.getMonth() + 1, 0);
      endDate.setHours(23, 59, 59, 999);
  }
  return { startDate, endDate };
};

export const useDashboard = (selectedRange = 'thisMonth', customDateRange = null) => {
  // Obtener datos crudos de los hooks correspondientes
  const { invoices, loading: invoicesLoading, error: invoicesError } = useInvoices(); // Añadir error
  const { clients, loading: clientsLoading, error: clientsError } = useClients();   // Añadir error
  const { products, loading: productsLoading } = useProducts(); // No necesitamos productos aquí directamente

  const [exchangeRate, setExchangeRate] = useState(null); // Inicializar a null
  const [loadingRate, setLoadingRate] = useState(true);
  const [rateError, setRateError] = useState(null);

  // Cargar la tasa de cambio al iniciar
  useEffect(() => {
    const loadExchangeRate = async () => {
      setRateError(null); // Limpiar error anterior
      setLoadingRate(true);
      try {
        const { rate } = await exchangeRateApi.getCurrentRate();
        console.log('Tasa de cambio cargada en useDashboard:', rate);
        setExchangeRate(rate);
      } catch (error) {
        console.error('Error al cargar tasa de cambio en useDashboard:', error);
        setRateError(error.message || 'Error cargando tasa');
        // Considerar si poner un valor por defecto o dejar null y manejarlo
        // setExchangeRate(40);
      } finally {
        setLoadingRate(false);
      }
    };
    loadExchangeRate();
  }, []);

  // Estado de carga combinado
  const loading = invoicesLoading || clientsLoading || loadingRate;
  // Combinar errores (opcional, para mostrar un error general si algo falla)
  const error = invoicesError || clientsError || rateError;

  // Obtener el rango de fechas basado en la selección (sin cambios)
  const timeRange = useMemo(() => {
    return getDateRangeFromSelection(selectedRange, customDateRange);
  }, [selectedRange, customDateRange]);

  // Filtrar facturas por rango de tiempo (sin cambios)
  const filteredInvoices = useMemo(() => {
    // Solo filtrar si invoices es un array válido
    if (!Array.isArray(invoices) || invoices.length === 0) return [];

    return invoices.filter(invoice => {
      const fechaStr = invoice.fecha || invoice.date;
      if (!fechaStr) return false;
      const invoiceDate = new Date(fechaStr);
      // Verificar que la fecha sea válida y esté dentro del rango
      return !isNaN(invoiceDate.getTime()) &&
             invoiceDate >= timeRange.startDate &&
             invoiceDate <= timeRange.endDate;
    });
  }, [invoices, timeRange]);

  // Función auxiliar para convertir monedas (MÁS ROBUSTA)
  const convertCurrency = (amount, fromCurrency, toCurrency, rate) => {
    // Validar entradas
    if (typeof amount !== 'number' || isNaN(amount) || typeof rate !== 'number' || isNaN(rate) || rate <= 0) {
      console.warn('convertCurrency: Inputs inválidos', { amount, fromCurrency, toCurrency, rate });
      return 0; // Devolver 0 si los inputs no son válidos
    }
    if (fromCurrency === toCurrency) return amount;

    if (fromCurrency === 'USD' && toCurrency === 'VES') {
      return amount * rate;
    } else if (fromCurrency === 'VES' && toCurrency === 'USD') {
      return amount / rate;
    }

    console.warn('convertCurrency: Conversión no soportada', { fromCurrency, toCurrency });
    return amount; // Devolver el monto original si la conversión no es soportada
  };


  // --- DEBUG --- Log de datos ANTES de calcular KPIs
  console.log('--- DEBUG useDashboard ---');
  console.log('Invoices (originales):', invoices);
  console.log('Filtered Invoices:', filteredInvoices);
  console.log('Clients:', clients);
  console.log('Exchange Rate:', exchangeRate);
  console.log('Loading State:', loading);
  console.log('Error State:', error);
  console.log('-------------------------');


  // Procesar datos para KPIs (MÁS ROBUSTO Y CON LOGS INTERNOS)
  const kpis = useMemo(() => {
    // Si está cargando o hay error o falta la tasa, devolver valores por defecto (0 o arrays vacíos)
    if (loading || error || typeof exchangeRate !== 'number' || isNaN(exchangeRate)) {
      console.log('KPIs useMemo: Devolviendo valores por defecto (loading/error/no rate)');
      return {
        totalPorMoneda: [], totalOperaciones: 0, totalClientes: 0, totalFacturas: 0,
        cambioIngresos: 0, cambioOperaciones: 0, cambioClientes: 0, cambioFacturas: 0,
        totalConsolidadoUSD: 0, totalConsolidadoVES: 0,
        ventasAyerUSD: 0, ventasMesPasadoUSD: 0, periodoSeleccionado: selectedRange
      };
    }

    // Asegurarse de que clients es un array
    const validClients = Array.isArray(clients) ? clients : [];

    // Calcular totales por moneda
    const totalesPorMonedaMap = {};
    let totalConsolidadoUSD = 0;

    filteredInvoices.forEach(invoice => {
      const moneda = invoice.moneda || 'USD'; // Asumir USD si no hay moneda
      // Asegurarse que el total es un número
      const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;

      if (!totalesPorMonedaMap[moneda]) {
        totalesPorMonedaMap[moneda] = 0;
      }
      totalesPorMonedaMap[moneda] += total;

      // Consolidar en USD
      totalConsolidadoUSD += convertCurrency(total, moneda, 'USD', exchangeRate);
    });

    // Convertir a array para la visualización
    const totalPorMoneda = Object.entries(totalesPorMonedaMap).map(([moneda, total]) => ({
      moneda,
      total: Math.round(total * 100) / 100 // Redondear
    }));

    // Calcular total consolidado en VES
    const totalConsolidadoVES = convertCurrency(totalConsolidadoUSD, 'USD', 'VES', exchangeRate);

    // Calcular totales generales
    const totalFacturas = filteredInvoices.length;
    const totalClientes = validClients.length; // Usar el array validado

    // --- Calcular ingresos del día anterior ---
    const hoy = new Date();
    const ayerStart = new Date(hoy);
    ayerStart.setDate(hoy.getDate() - 1);
    ayerStart.setHours(0, 0, 0, 0);
    const ayerEnd = new Date(hoy);
    ayerEnd.setDate(hoy.getDate() - 1);
    ayerEnd.setHours(23, 59, 59, 999);

    // Filtrar facturas de AYER (usando el array original 'invoices', no el filtrado por rango)
    const facturasAyer = (Array.isArray(invoices) ? invoices : []).filter(invoice => {
        const fechaStr = invoice.fecha || invoice.date;
        if (!fechaStr) return false;
        const fechaFactura = new Date(fechaStr);
        return !isNaN(fechaFactura.getTime()) && fechaFactura >= ayerStart && fechaFactura <= ayerEnd;
    });

    let ventasAyerUSD = 0;
    facturasAyer.forEach(invoice => {
      const moneda = invoice.moneda || 'USD';
      const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;
      ventasAyerUSD += convertCurrency(total, moneda, 'USD', exchangeRate);
    });

    // --- Calcular ingresos del mes anterior ---
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    const primerDiaMesPasado = new Date(anioActual, mesActual - 1, 1, 0, 0, 0, 0);
    const ultimoDiaMesPasado = new Date(anioActual, mesActual, 0, 23, 59, 59, 999); // Día 0 del mes actual es el último del anterior

    // Filtrar facturas del MES PASADO (usando el array original 'invoices')
    const facturasMesPasado = (Array.isArray(invoices) ? invoices : []).filter(invoice => {
        const fechaStr = invoice.fecha || invoice.date;
        if (!fechaStr) return false;
        const fecha = new Date(fechaStr);
        return !isNaN(fecha.getTime()) && fecha >= primerDiaMesPasado && fecha <= ultimoDiaMesPasado;
    });

    let ventasMesPasadoUSD = 0;
    facturasMesPasado.forEach(invoice => {
      const moneda = invoice.moneda || 'USD';
      const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;
      ventasMesPasadoUSD += convertCurrency(total, moneda, 'USD', exchangeRate);
    });

    // Calcular cambios porcentuales
    let cambioIngresos = 0;
    let cambioFacturas = 0; // Necesitaríamos facturas del período anterior para esto

    // Comparar ingresos actuales (totalConsolidadoUSD) con período anterior relevante
    let ingresosPeriodoAnterior = 0;
    if (selectedRange === 'thisMonth') {
        ingresosPeriodoAnterior = ventasMesPasadoUSD;
    } else if (selectedRange === 'today') {
        ingresosPeriodoAnterior = ventasAyerUSD;
    } // Añadir más lógica para otros rangos si es necesario

    if (ingresosPeriodoAnterior > 0) {
      cambioIngresos = ((totalConsolidadoUSD - ingresosPeriodoAnterior) / ingresosPeriodoAnterior) * 100;
    } else if (totalConsolidadoUSD > 0) {
      cambioIngresos = 100; // Si antes era 0 y ahora hay ingresos, es +100% (o infinito)
    }

    // Lógica simulada para cambios no calculados (igual que antes)
    const cambioOperaciones = 3.1;
    const cambioClientes = -0.8;

    // --- DEBUG --- Log de KPIs calculados ANTES de retornar
    const calculatedKpis = {
      totalPorMoneda,
      totalOperaciones: totalFacturas, // Usar totalFacturas calculado
      totalClientes,
      totalFacturas,
      cambioIngresos: Math.round(cambioIngresos * 10) / 10,
      cambioOperaciones,
      cambioClientes,
      cambioFacturas, // Aún simulado o 0 si no se calcula
      totalConsolidadoUSD: Math.round(totalConsolidadoUSD * 100) / 100,
      totalConsolidadoVES: Math.round(totalConsolidadoVES * 100) / 100,
      ventasAyerUSD: Math.round(ventasAyerUSD * 100) / 100,
      ventasMesPasadoUSD: Math.round(ventasMesPasadoUSD * 100) / 100,
      periodoSeleccionado: selectedRange
    };
    console.log('KPIs calculados en useMemo:', calculatedKpis);

    return calculatedKpis;

  // Dependencias del useMemo: deben incluir todo lo usado dentro
  }, [
      invoices, // Array original de facturas (para cálculos de ayer/mes pasado)
      filteredInvoices, // Facturas filtradas por rango (para totales del período)
      clients, // Array de clientes
      loading, // Estado de carga general
      error, // Estado de error general
      exchangeRate, // Tasa de cambio
      selectedRange // Rango de tiempo seleccionado
  ]);

  // ... resto de los useMemo para gráficos (facturasPorMes, facturasPorDia, etc.) ...
  // Asegúrate de que estos también manejen 'loading', 'error' y 'exchangeRate' inválido si es necesario

  // Procesar datos para el gráfico de facturación mensual
  const facturasPorMes = useMemo(() => {
    if (loading || error || typeof exchangeRate !== 'number' || isNaN(exchangeRate) || !filteredInvoices.length) return [];
    // ... (lógica existente, pero usando convertCurrency robusta y exchangeRate validado) ...
    const mesesMap = {};
    filteredInvoices.forEach(invoice => {
      const fechaStr = invoice.fecha || invoice.date;
      if (!fechaStr) return;
      const fecha = new Date(fechaStr);
      if (isNaN(fecha.getTime())) return;

      const mes = fecha.toLocaleString('es', { month: 'short' });
      const moneda = invoice.moneda || 'USD';
      const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;

      if (!mesesMap[mes]) {
        mesesMap[mes] = { USD: 0, VES: 0, total: 0 };
      }
      mesesMap[mes][moneda] = (mesesMap[mes][moneda] || 0) + total; // Acumular correctamente
      mesesMap[mes].total += convertCurrency(total, moneda, 'USD', exchangeRate);
    });
    return Object.entries(mesesMap).map(([name, data]) => ({
      name,
      USD: Math.round(data.USD * 100) / 100,
      VES: Math.round(data.VES * 100) / 100,
      total: Math.round(data.total * 100) / 100
    }));
  }, [filteredInvoices, loading, error, exchangeRate]);


  // Procesar datos para el gráfico de facturación diaria
  const facturasPorDia = useMemo(() => {
    if (loading || error || typeof exchangeRate !== 'number' || isNaN(exchangeRate) || !filteredInvoices.length) return [];
     // ... (lógica existente, pero usando convertCurrency robusta y exchangeRate validado) ...
     const diasMap = {};
     let totalFacturasProcesadas = 0;
     filteredInvoices.forEach(invoice => {
        const fechaStr = invoice.fecha || invoice.date;
        if (!fechaStr) return;
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return;

        const dia = fecha.getDate();
        const mesesAbr = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const mesAbr = mesesAbr[fecha.getMonth()];
        const fechaFormateada = `${dia} ${mesAbr}`;

        if (!diasMap[fechaFormateada]) {
          diasMap[fechaFormateada] = { fecha: fecha, USD: 0, VES: 0, total: 0, facturas: 0 };
        }
        diasMap[fechaFormateada].facturas += 1;
        totalFacturasProcesadas += 1;

        const moneda = invoice.moneda || 'USD';
        const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;

        diasMap[fechaFormateada][moneda] = (diasMap[fechaFormateada][moneda] || 0) + total; // Acumular correctamente
        diasMap[fechaFormateada].total += convertCurrency(total, moneda, 'USD', exchangeRate);
     });
     console.log(`Facturas por Día - Total procesadas: ${totalFacturasProcesadas}, Total filtradas: ${filteredInvoices.length}`);
     const resultado = Object.entries(diasMap).map(([fechaFormateada, datos]) => ({
        name: fechaFormateada,
        USD: Math.round(datos.USD * 100) / 100,
        VES: Math.round(datos.VES * 100) / 100,
        total: Math.round(datos.total * 100) / 100,
        facturas: parseInt(datos.facturas) || 0,
        fechaObj: datos.fecha
     }));
     return resultado.sort((a, b) => a.fechaObj - b.fechaObj);
  }, [filteredInvoices, loading, error, exchangeRate]);


  // Distribución por moneda
  const facturasPorTipo = useMemo(() => {
    if (loading || error || typeof exchangeRate !== 'number' || isNaN(exchangeRate) || !filteredInvoices.length) return [];
    // ... (lógica existente, pero usando convertCurrency robusta y exchangeRate validado) ...
    const monedasMap = {};
    let totalConsolidadoUSDForPercentage = 0; // Usar variable local para evitar conflictos
    filteredInvoices.forEach(invoice => {
        const moneda = invoice.moneda || 'USD';
        const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;
        if (!monedasMap[moneda]) {
          monedasMap[moneda] = 0;
        }
        monedasMap[moneda] += total;
        totalConsolidadoUSDForPercentage += convertCurrency(total, moneda, 'USD', exchangeRate);
    });
    return Object.entries(monedasMap).map(([moneda, value]) => {
        let valueInUSD = convertCurrency(value, moneda, 'USD', exchangeRate);
        const porcentaje = totalConsolidadoUSDForPercentage > 0 ? Math.round((valueInUSD / totalConsolidadoUSDForPercentage) * 100) : 0;
        const monedaEmojis = {'USD': '💵 USD', 'VES': '💰 VES', 'EUR': '💶 EUR', 'BTC': '₿ BTC'};
        const name = monedaEmojis[moneda] || moneda;
        return { name, value: porcentaje, raw: value };
    });
  }, [filteredInvoices, loading, error, exchangeRate]);


  // Facturas por año
  const facturasPorAnio = useMemo(() => {
    if (loading || error || typeof exchangeRate !== 'number' || isNaN(exchangeRate) || !filteredInvoices.length) return [];
    // ... (lógica existente, pero usando convertCurrency robusta y exchangeRate validado) ...
    const aniosMap = {};
    filteredInvoices.forEach(invoice => {
        const fechaStr = invoice.fecha || invoice.date;
        if (!fechaStr) return;
        const fecha = new Date(fechaStr);
        if (isNaN(fecha.getTime())) return;

        const anio = fecha.getFullYear().toString();
        const moneda = invoice.moneda || 'USD';
        const total = typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0;

        if (!aniosMap[anio]) {
          aniosMap[anio] = { USD: 0, VES: 0, total: 0 };
        }
        aniosMap[anio][moneda] = (aniosMap[anio][moneda] || 0) + total; // Acumular correctamente
        aniosMap[anio].total += convertCurrency(total, moneda, 'USD', exchangeRate);
    });
    return Object.entries(aniosMap).map(([name, data]) => ({
      name,
      USD: Math.round((data.USD || 0) * 100) / 100,
      VES: Math.round((data.VES || 0) * 100) / 100,
      total: Math.round((data.total || 0) * 100) / 100
    }));
  }, [filteredInvoices, loading, error, exchangeRate]);


  // Facturas recientes
  const facturasRecientes = useMemo(() => {
    // Usar filteredInvoices para mostrar recientes del período seleccionado
    if (loading || error || !filteredInvoices.length) return [];
    // Asegurarse que clients es un array
    const validClients = Array.isArray(clients) ? clients : [];

    return filteredInvoices
      .sort((a, b) => new Date(b.fecha || b.date) - new Date(a.fecha || a.date))
      .slice(0, 5)
      .map(invoice => {
        const numeroFactura = invoice.number || invoice.numeroFactura || invoice.numero || `INV-${invoice._id ? invoice._id.substring(0, 4) : ''}`;
        let clienteNombre = 'Cliente desconocido';
        const clientIdRef = invoice.client?._id || invoice.client || invoice.cliente; // Unificar referencia a cliente

        if (clientIdRef) {
            // Si el cliente está populado en la factura
            if (invoice.client && typeof invoice.client === 'object') {
                clienteNombre = invoice.client.name || invoice.client.nombre || clienteNombre;
            } else if (invoice.cliente && typeof invoice.cliente === 'object') { // Campo alternativo
                 clienteNombre = invoice.cliente.name || invoice.cliente.nombre || clienteNombre;
            } else {
                // Buscar en la lista de clientes si no está populado
                const clienteEncontrado = validClients.find(c => normalizeId(c._id) === normalizeId(clientIdRef));
                if (clienteEncontrado) {
                    clienteNombre = clienteEncontrado.nombre || clienteEncontrado.name || clienteNombre;
                }
            }
        }

        const estado = (invoice.status || invoice.estado || 'draft').toLowerCase();
        const estadoEmojis = {'paid': '✅ ', 'pagada': '✅ ', 'pending': '⏳ ', 'pendiente': '⏳ ', 'issued': '📨 ', 'emitida': '📨 ', 'draft': '📝 ', 'borrador': '📝 ', 'cancelled': '❌ ', 'cancelada': '❌ '};
        const estadoTraducido = {'draft': 'Borrador', 'issued': 'Emitida', 'paid': 'Pagada', 'cancelled': 'Cancelada', 'pending': 'Pendiente', 'borrador': 'Borrador', 'emitida': 'Emitida', 'pagada': 'Pagada', 'cancelada': 'Cancelada', 'pendiente': 'Pendiente'};
        const estadoEmoji = estadoEmojis[estado] || '📄 ';
        const estadoFinal = estadoTraducido[estado] || 'Borrador';

        return {
          id: numeroFactura,
          cliente: `👤 ${clienteNombre}`,
          fecha: new Date(invoice.fecha || invoice.date).toLocaleDateString('es-ES'),
          total: typeof invoice.total === 'number' && !isNaN(invoice.total) ? invoice.total : 0,
          moneda: invoice.moneda || 'USD',
          estado: `${estadoEmoji}${estadoFinal}`
        };
      });
  }, [filteredInvoices, clients, loading, error]); // Incluir clients y error


  // Clientes recientes
  const clientesRecientes = useMemo(() => {
    // Usar la lista completa de clientes, no los filtrados por factura
    if (loading || error || !Array.isArray(clients) || clients.length === 0) return [];
    const validClients = clients; // Ya sabemos que es un array

    return validClients
      // Ordenar por fecha de creación o ID si no hay fecha (asumiendo IDs más nuevos son recientes)
      .sort((a, b) => (new Date(b.createdAt || 0) - new Date(a.createdAt || 0)) || (b._id > a._id ? -1 : 1))
      .slice(0, 5)
      .map(client => {
        const nombreCliente = client.nombre || client.name || 'Sin Nombre';
        // Contar facturas del cliente usando el array original 'invoices'
        const clienteFacturasCount = (Array.isArray(invoices) ? invoices : []).filter(invoice => {
            const clientIdRef = invoice.client?._id || invoice.client || invoice.cliente;
            return normalizeId(clientIdRef) === normalizeId(client._id);
        }).length;

        let facturaEmoji = '📭 ';
        if (clienteFacturasCount > 10) facturaEmoji = '🔥 ';
        else if (clienteFacturasCount > 5) facturaEmoji = '⭐ ';
        else if (clienteFacturasCount > 0) facturaEmoji = '📄 ';

        const email = client.email || client.correo || '';
        const documento = client.rif || client.RIF || client.documento || '';

        return {
          id: client._id,
          nombre: `👤 ${nombreCliente}`,
          email: email,
          documento: documento,
          facturas: `${facturaEmoji}${clienteFacturasCount}` // Mostrar conteo numérico
        };
      });
  }, [clients, invoices, loading, error]); // Incluir invoices y error


  // Devolver todos los datos procesados
  return {
    loading,
    error, // Devolver el estado de error combinado
    kpis,
    facturasPorMes,
    facturasPorDia,
    facturasPorTipo,
    facturasPorAnio,
    facturasRecientes,
    clientesRecientes,
    exchangeRate,
    timeRange, // Rango de fechas calculado
    filteredInvoices // Facturas filtradas (útil para otros componentes si es necesario)
  };
};