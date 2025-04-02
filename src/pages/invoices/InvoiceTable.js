// src/pages/invoices/InvoiceTable.js (VERSIÓN 1 - CORREGIDA PARA CLIENTE)
import { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, IconButton, Tooltip, Chip, Menu, MenuItem } from '@mui/material';
import {
  Edit,
  Delete,
  Visibility,
  FileDownload
} from '@mui/icons-material';

export const InvoiceTable = ({ invoices = [], onEdit, onDelete, onPreview, onDownload, onStatusChange }) => {
  const [statusMenu, setStatusMenu] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleStatusClick = (event, invoice) => {
    event.stopPropagation();
    setStatusMenu(event.currentTarget);
    setSelectedInvoice(invoice);
  };

  const handleStatusClose = () => {
    setStatusMenu(null);
    setSelectedInvoice(null);
  };

  const handleStatusChange = (newStatus) => {
    const invoiceId = selectedInvoice?._id || selectedInvoice?.id;
    if (onStatusChange && invoiceId) {
      onStatusChange(invoiceId, newStatus);
    }
    handleStatusClose();
  };

  // --- Funciones auxiliares para Status ---
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'Borrador';
      case 'pending': return 'Pendiente';
      case 'paid': return 'Pagada';
      case 'cancelled': return 'Anulada';
      case 'overdue': return 'Vencida';
      case 'partial': return 'Pago Parcial';
      default: return 'Borrador';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft': return 'default';
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'cancelled': return 'error';
      case 'overdue': return 'error';
      case 'partial': return 'info';
      default: return 'default';
    }
  };
  // --- Fin Funciones auxiliares para Status ---


  // --- Definición de Columnas para DataGrid ---
  const columns = [
    { field: 'number', headerName: 'N° Factura', flex: 1 },
    {
      field: 'date',
      headerName: 'Fecha',
      flex: 1,
      renderCell: (params) => {
        try {
          return params.value ? new Date(params.value).toLocaleDateString() : 'N/A';
        } catch (e) { return 'Fecha Inválida'; }
      }
    },
    {
      // --- Columna Cliente CORREGIDA ---
      field: 'clientName', // <-- Usa directamente el campo creado abajo
      headerName: 'Cliente',
      flex: 1.5,
      // No se necesita valueGetter ni renderCell para el nombre simple
    },
    {
      field: 'total',
      headerName: 'Total',
      flex: 1,
      renderCell: (params) => {
        const currency = params.row?.moneda || 'VES';
        const total = typeof params.row?.total === 'number' ? params.row.total : 0;
        return `${currency} ${total.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    },
    {
      field: 'status',
      headerName: 'Estado',
      flex: 1,
      renderCell: (params) => {
        const status = params.value || 'draft';
        const rowData = params.row;
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Chip
              label={getStatusLabel(status)}
              color={getStatusColor(status)}
              size="small"
              sx={{ mr: 1, cursor: 'pointer' }}
              onClick={(e) => handleStatusClick(e, rowData)}
            />
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 180,
      sortable: false,
      renderCell: (params) => {
        // params.row es un objeto de processedRows, que ya tiene todo (incluyendo notes/terms)
        const currentRow = params.row;

        return (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
            <Tooltip title="Previsualizar">
              <IconButton
                onClick={() => {
                  console.log('Datos (Opción 1 - Fila Procesada) a enviar a preview:', currentRow);
                  if (onPreview) onPreview(currentRow);
                }}
                color="info" size="small" >
                <Visibility fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Descargar PDF">
              <IconButton
                onClick={() => onDownload && onDownload(currentRow)}
                color="secondary" size="small" >
                <FileDownload fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Editar">
              <IconButton
                onClick={() => {
                  console.log('Datos (Opción 1 - Fila Procesada) a enviar a edit:', currentRow);
                  if (onEdit) onEdit(currentRow);
                }}
                color="primary" size="small" >
                <Edit fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                onClick={() => onDelete && onDelete(currentRow.id)}
                color="error" size="small" >
                <Delete fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];
  // --- Fin Definición de Columnas ---


  // --- Procesamiento de Filas (CORREGIDO para asegurar clientName) ---
  const processedRows = invoices.map(invoice => ({
    // --- Campos básicos visibles o para ID ---
    id: invoice._id,
    number: invoice.number || 'N/A',
    date: invoice.date,
    total: invoice.total || 0,
    status: invoice.status || 'draft',
    moneda: invoice.moneda || 'VES',

    // --- Campo EXPLÍCITO para la columna Cliente ---
    clientName: invoice.client?.nombre || 'N/A', // <--- CORREGIDO/ASEGURADO

    // --- Campos COMPLETOS necesarios para ACCIONES (Preview/Edit) ---
    _id: invoice._id,
    client: invoice.client || null, // Objeto cliente completo
    items: invoice.items || [],     // Items completos
    subtotal: invoice.subtotal || 0,
    tax: invoice.tax || 0,
    condicionesPago: invoice.condicionesPago,
    diasCredito: invoice.diasCredito,
    notes: invoice.notes || '',     // Notas
    terms: invoice.terms || ''      // Términos
  }));
  // --- Fin Procesamiento de Filas ---


  // --- Renderizado del Componente ---
  return (
    <>
      <DataGrid
        rows={processedRows}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5, 10, 25, 100]}
        autoHeight
        disableSelectionOnClick
        loading={!invoices || invoices.length === 0}
        components={{
          NoRowsOverlay: () => (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', p: 2 }}>
              <Box>No hay facturas disponibles</Box>
            </Box>
          )
        }}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': { backgroundColor: (theme) => theme.palette.grey[100], fontWeight: 'bold' },
          '& .MuiDataGrid-cell': { borderBottom: (theme) => `1px solid ${theme.palette.grey[200]}` },
          '& .MuiDataGrid-footerContainer': { borderTop: (theme) => `1px solid ${theme.palette.grey[300]}` },
          '& .MuiDataGrid-row:hover': { backgroundColor: (theme) => theme.palette.action.hover }
        }}
      />

      {/* Menú para cambiar estado */}
      <Menu anchorEl={statusMenu} open={Boolean(statusMenu)} onClose={handleStatusClose} >
        {['draft', 'pending', 'paid', 'partial', 'overdue', 'cancelled'].map((status) => (
          <MenuItem key={status} onClick={() => handleStatusChange(status)}>
            <Chip label={getStatusLabel(status)} size="small" color={getStatusColor(status)} sx={{ minWidth: '100px' }} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
  
};

export default InvoiceTable;